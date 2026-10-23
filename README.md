# Opening Reps

A local chess opening trainer. There's nothing to install and no server to run. Click the link https://burrellkeb.github.io/Chess-Trainer/ to run on laptop or Safari.

# To make it an app

Open the link. Press the three dots. Press share. Press view more. Press add to home screen. Leave open as Web App checked and click Add in the top right.

# How it works
- **Learn**: new lines only. The trainer plays the opponent's moves and highlights yours in blue.
- **Practice all**: every line in an opening, shuffled, no hints.
- **Review**: lines that spaced repetition says are due. The header button reviews across all openings.
- A wrong move is taken back, and the correct move is shown. You have to play the right move to continue. A missed line comes back later in the same session and is scheduled again soon.
- Clean lines climb through intervals of 1, 3, 7, 16, 35 and 80 days.
- Progress is stored in your browser's localStorage.

# Adding openings or lines
Edit `repertoire.js`. Each line is plain SAN from the starting position. If you have Node installed, run `node check.js` afterward. It confirms every move is legal and that your own move is the same everywhere a position repeats.

Files: `index.html`, `style.css`, `app.js` (trainer and spaced repetition), `repertoire.js` (data), `lib/chess.js` (chess.js 0.10.3, BSD-2 license).
