// Run with: node check.js  — verifies every move is legal and your moves are consistent.
const { Chess } = require('./lib/chess.js');
global.window = {}; require('./repertoire.js');
let ok = true;
for (const op of window.REPERTOIRE) {
  const mine = {}; // fen -> my move
  for (const line of op.lines) {
    const g = new Chess();
    line.moves.trim().split(/\s+/).forEach((san, i) => {
      if (!ok && false) return;
      const fen = g.fen().split(' ').slice(0, 4).join(' ');
      const myTurn = (g.turn() === 'w') === (op.side === 'white');
      const m = g.move(san);
      if (!m) { ok = false; console.log(`ILLEGAL ${op.id} / ${line.name}: move ${i + 1} "${san}"`); throw 0; }
      if (myTurn) {
        if (mine[fen] && mine[fen] !== m.san) { ok = false; console.log(`CONFLICT ${op.id}: ${mine[fen]} vs ${m.san} (${line.name})`); }
        mine[fen] = m.san;
      }
    });
  }
  console.log(`${op.name}: ${op.lines.length} lines OK`);
}
process.exit(ok ? 0 : 1);
