(() => {
  // ---------- Spaced repetition ----------
  // Each line has a box. Getting it right moves it up a box; a mistake drops it to box 1.
  const INTERVAL_DAYS = [0, 0, 1, 3, 7, 16, 35, 80]; // index = box
  const DAY = 86400000;
  const KEY = 'openingReps.v1';

  let store = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || { lines: {} }; } catch { return { lines: {} }; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} }
  const lineId = (op, i) => `${op.id}:${i}`;
  const rec = id => store.lines[id];
  const isDue = id => rec(id) && rec(id).due <= Date.now();

  function grade(id, clean) {
    const r = rec(id) || { box: 0, passes: 0, fails: 0 };
    r.box = clean ? Math.min(r.box + 1, INTERVAL_DAYS.length - 1) : 1;
    clean ? r.passes++ : r.fails++;
    // Same-day boxes come back in 10 minutes; others at the start of the due day.
    r.due = INTERVAL_DAYS[r.box] === 0 ? Date.now() + 10 * 60000
      : new Date(new Date().setHours(4, 0, 0, 0)).getTime() + INTERVAL_DAYS[r.box] * DAY;
    store.lines[id] = r; save();
  }

  // ---------- Home ----------
  const $ = id => document.getElementById(id);
  function allDue() {
    const out = [];
    REPERTOIRE.forEach(op => op.lines.forEach((l, i) => { if (isDue(lineId(op, i))) out.push({ op, i }); }));
    return out;
  }

  function renderHome() {
    $('session').hidden = true; $('home').hidden = false;
    const due = allDue();
    $('reviewAll').textContent = due.length ? `Review ${due.length} due` : 'Nothing due';
    $('reviewAll').disabled = !due.length;
    $('cards').innerHTML = '';
    REPERTOIRE.forEach(op => {
      const ids = op.lines.map((_, i) => lineId(op, i));
      const fresh = ids.filter(id => !rec(id)).length;
      const dueN = ids.filter(isDue).length;
      const solid = ids.filter(id => rec(id) && rec(id).box >= 3).length;
      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = `
        <div class="side">You play ${op.side}</div>
        <h2>${op.name}</h2>
        <p>${op.blurb}</p>
        <div class="bar"><span style="width:${(100 * solid / ids.length).toFixed(0)}%"></span></div>
        <div class="stats small">${solid}/${ids.length} solid · ${fresh} new · ${dueN} due</div>
        <div class="row">
          <button data-a="learn" ${fresh ? '' : 'disabled'} class="${fresh ? 'primary' : ''}">Learn ${fresh || ''}</button>
          <button data-a="practice">Practice all</button>
          <button data-a="due" ${dueN ? '' : 'disabled'}>Review ${dueN || ''}</button>
        </div>`;
      c.querySelector('[data-a=learn]').onclick = () =>
        start(`${op.name}: Learn`, op.lines.map((_, i) => ({ op, i })).filter(x => !rec(lineId(op, x.i))), 'learn');
      c.querySelector('[data-a=practice]').onclick = () =>
        start(`${op.name}: Practice`, shuffle(op.lines.map((_, i) => ({ op, i }))), 'recall');
      c.querySelector('[data-a=due]').onclick = () =>
        start(`${op.name}: Review`, shuffle(op.lines.map((_, i) => ({ op, i })).filter(x => isDue(lineId(op, x.i)))), 'recall');
      $('cards').appendChild(c);
    });
  }
  $('reviewAll').onclick = () => start('Daily review', shuffle(allDue()), 'recall');
  $('homeLink').onclick = renderHome;
  $('quitBtn').onclick = renderHome;
  $('resetAll').onclick = e => {
    e.preventDefault();
    if (confirm('Erase all saved progress?')) { store = { lines: {} }; save(); renderHome(); }
  };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- Session ----------
  // mode 'learn': the correct move is shown before you play it.
  // mode 'recall': no hints; a wrong move shows the answer and counts as a miss.
  let S = null;

  function start(title, queue, mode) {
    if (!queue.length) return;
    S = { title, queue, mode, idx: 0, retried: new Set(), total: queue.length, done: 0 };
    $('home').hidden = true; $('session').hidden = false;
    $('sessionTitle').textContent = title;
    loadLine();
  }

  function loadLine() {
    const { op, i } = S.queue[S.idx];
    const line = op.lines[i];
    Object.assign(S, {
      op, i, line, id: lineId(op, i), game: new Chess(), ply: 0, clean: true, finished: false,
      moves: line.moves.trim().split(/\s+/), selected: null, last: null, hintSqs: null, wrongSq: null,
      showHints: S.mode === 'learn'
    });
    S.orient = op.side === 'white' ? 'w' : 'b';
    $('lineTitle').textContent = line.name;
    $('progress').textContent = `Line ${S.done + 1} of ${S.total}${S.mode === 'learn' ? ' · hints on' : ''}`;
    $('note').hidden = true; $('nextBtn').hidden = true; $('hintBtn').disabled = false;
    say(S.mode === 'learn' ? 'Play the highlighted move.' : 'Your move. Play it from memory.', '');
    renderMoves(); advance();
  }

  const myTurn = () => (S.game.turn() === 'w') === (S.op.side === 'white');

  // Play opponent moves automatically; stop when it's your turn or the line ends.
  function advance() {
    S.hintSqs = null;
    if (S.ply >= S.moves.length) return finishLine();
    if (!myTurn()) {
      draw();
      setTimeout(() => {
        const m = S.game.move(S.moves[S.ply]);
        S.ply++; S.last = [m.from, m.to]; renderMoves(); advance();
      }, S.ply === 0 ? 450 : 380);
      return;
    }
    if (S.showHints) S.hintSqs = expected();
    draw();
  }

  function expected() {
    const g = new Chess(S.game.fen());
    const m = g.move(S.moves[S.ply]);
    return [m.from, m.to, m.san];
  }

  function tryMove(from, to) {
    if (!S || S.finished || !myTurn()) return false;
    const m = S.game.move({ from, to, promotion: 'q' });
    if (!m) return false;
    if (m.san === S.moves[S.ply]) {
      S.ply++; S.last = [from, to]; S.selected = null;
      say(`✓ ${m.san}. That's book.`, 'good');
      renderMoves(); advance();
    } else {
      // Wrong: show it briefly, take it back, reveal the right move.
      S.game.undo();
      const [ef, et, esan] = expected();
      S.clean = false; S.selected = null; S.wrongSq = to; S.hintSqs = [ef, et];
      say(`✗ ${m.san} isn't in your repertoire. The move here is ${esan}. Play it to continue.`, 'bad');
      draw();
      setTimeout(() => { S.wrongSq = null; draw(); }, 700);
    }
    return true;
  }

  $('hintBtn').onclick = () => {
    if (!S || S.finished || !myTurn()) return;
    if (S.mode === 'recall') S.clean = false;
    const [f, t, san] = expected();
    S.hintSqs = [f, t];
    say(S.mode === 'recall' ? `Hint: ${san}. This line counts as missed.` : `Hint: ${san}`, 'bad');
    draw();
  };

  function finishLine() {
    S.finished = true; draw();
    // In learn mode the first pass is study, so it is graded as a clean intro (box 1 → due again soon).
    grade(S.id, S.mode === 'learn' ? true : S.clean);
    if (!S.clean && S.mode === 'recall' && !S.retried.has(S.id)) {
      S.retried.add(S.id); S.queue.push(S.queue[S.idx]); S.total++; // see it again this session
    }
    say(S.clean ? 'Line complete with no mistakes.' : 'Line complete. You will see it again soon.', S.clean ? 'good' : 'bad');
    $('note').textContent = S.line.note; $('note').hidden = false;
    $('hintBtn').disabled = true;
    S.done++;
    const more = S.idx + 1 < S.queue.length;
    $('nextBtn').textContent = more ? 'Next line →' : 'Finish';
    $('nextBtn').hidden = false; $('nextBtn').focus();
  }
  $('nextBtn').onclick = () => {
    S.idx++;
    if (S.idx < S.queue.length) loadLine();
    else { renderHome(); }
  };
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && S && S.finished && !$('session').hidden) $('nextBtn').click();
  });

  function say(t, cls) { const f = $('feedback'); f.textContent = t; f.className = 'feedback ' + cls; }

  function renderMoves() {
    const h = S.game.history(), ol = $('moveList'); ol.innerHTML = '';
    const mineWhite = S.op.side === 'white';
    for (let k = 0; k < h.length; k += 2) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="${mineWhite ? 'mine' : 'theirs'}">${h[k]}</span> ` +
        (h[k + 1] ? `<span class="${mineWhite ? 'theirs' : 'mine'}">${h[k + 1]}</span>` : '');
      ol.appendChild(li);
    }
  }

  // ---------- Board ----------
  const GLYPH = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
  const board = $('board');

  function squares() {
    const files = 'abcdefgh', out = [];
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
      const file = S.orient === 'w' ? files[f] : files[7 - f];
      const rank = S.orient === 'w' ? 8 - r : r + 1;
      out.push({ sq: file + rank, light: (f + r) % 2 === 0, showFile: r === 7, showRank: f === 0, file, rank });
    }
    return out;
  }

  function draw() {
    board.innerHTML = '';
    const legal = S.selected ? S.game.moves({ square: S.selected, verbose: true }).map(m => m.to) : [];
    for (const s of squares()) {
      const d = document.createElement('div');
      d.className = 'sq ' + (s.light ? 'l' : 'd');
      d.dataset.sq = s.sq;
      if (S.last && S.last.includes(s.sq)) d.classList.add('last');
      if (S.hintSqs && S.hintSqs.slice(0, 2).includes(s.sq)) d.classList.add('hint');
      if (S.selected === s.sq) d.classList.add('sel');
      if (S.wrongSq === s.sq) d.classList.add('wrong');
      if (s.showFile) d.insertAdjacentHTML('beforeend', `<span class="coord f">${s.file}</span>`);
      if (s.showRank) d.insertAdjacentHTML('beforeend', `<span class="coord r">${s.rank}</span>`);
      const p = S.game.get(s.sq);
      if (p) {
        const el = document.createElement('span');
        el.className = 'pc ' + p.color; el.textContent = GLYPH[p.type] + '︎';
        d.appendChild(el);
      }
      if (legal.includes(s.sq)) d.insertAdjacentHTML('beforeend', p ? '<span class="ring"></span>' : '<span class="dot"></span>');
      board.appendChild(d);
    }
  }

  // Click-to-move and drag-to-move with pointer events.
  let drag = null;
  board.addEventListener('pointerdown', e => {
    const sqEl = e.target.closest('.sq'); if (!sqEl || !S || S.finished || !myTurn()) return;
    const sq = sqEl.dataset.sq, p = S.game.get(sq);
    if (S.selected && S.selected !== sq && (!p || p.color !== S.game.turn())) {
      tryMove(S.selected, sq) || (S.selected = null, draw()); return;
    }
    if (p && p.color === S.game.turn()) {
      S.selected = sq; draw();
      const orig = board.querySelector(`[data-sq="${sq}"] .pc`);
      const ghost = orig.cloneNode(true);
      ghost.classList.add('drag');
      ghost.style.fontSize = getComputedStyle(orig).fontSize;
      ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
      document.body.appendChild(ghost); orig.classList.add('ghost');
      drag = { from: sq, ghost, moved: false };
      board.setPointerCapture(e.pointerId);
    }
  });
  board.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.moved = true;
    drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
  });
  board.addEventListener('pointerup', e => {
    if (!drag) return;
    const { from, ghost, moved } = drag; drag = null; ghost.remove();
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.sq')?.dataset.sq;
    if (moved && target && target !== from) { if (!tryMove(from, target)) draw(); }
    else draw(); // plain click: keep selection, show legal moves
  });

  renderHome();
})();
