// Repertoire data. To add an opening, copy one block and edit it.
// side: which color YOU play. Each line is a move sequence from the start
// position in plain SAN. The trainer plays the other side's moves for you.
// Rule: in any position, your move must be the same across all lines of an
// opening (opponent moves can branch freely). check.js enforces this.

window.REPERTOIRE = [
  {
    id: "london",
    name: "London System",
    side: "white",
    blurb: "d4, Bf4, e3, Nf3, c3, Nbd2, Bd3. Same setup against almost everything Black plays.",
    lines: [
      {
        name: "Main line vs ...d5, ...e6, ...c5",
        moves: "d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3",
        note: "When Black offers the bishop trade with ...Bd6, step back to g3. If Black takes, hxg3 gives you a half-open h-file for an attack on the castled king."
      },
      {
        name: "Early ...c5 and ...Qb6",
        moves: "d4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3 c4 Qc2",
        note: "...Qb6 hits b2. Answer with Qb3 to offer a queen trade that would straighten Black's pawns. After ...c4 the queen just drops back to c2, still eyeing h7."
      },
      {
        name: "Bd6 played before ...c5",
        moves: "d4 d5 Bf4 Nf6 e3 e6 Nf3 Bd6 Bg3 O-O Nbd2 c5 c3 Nc6 Bd3",
        note: "Same idea as the main line: keep the bishop with Bg3. Your pieces land on the same squares no matter the move order."
      },
      {
        name: "Early ...Bf5",
        moves: "d4 d5 Bf4 Bf5 e3 Nf6 c4 e6 Nc3 Bb4 Qb3",
        note: "Once Black's light-squared bishop has left the queenside, b7 is weak. c4 plus Qb3 puts pressure on b7 and d5 at the same time."
      },
      {
        name: "Vs King's Indian setup",
        moves: "d4 Nf6 Bf4 g6 e3 Bg7 Nf3 O-O Be2 d6 h3",
        note: "Against ...g6 and ...d6, Be2 is more useful than Bd3 because Black will push ...e5. h3 gives the f4 bishop a retreat square on h2."
      }
    ]
  },
  {
    id: "pirc",
    name: "Pirc Defense",
    side: "black",
    blurb: "1.e4 d6 2.d4 Nf6 3.Nc3 g6. Let White build a center, then strike at it with ...c5, ...e5 or ...b5.",
    lines: [
      {
        name: "Classical (4.Nf3)",
        moves: "e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2 O-O O-O c6",
        note: "The quiet main line. ...c6 prepares ...b5 or ...Qc7 and ...e5. Castle first, then decide where to break."
      },
      {
        name: "Austrian Attack (4.f4)",
        moves: "e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 c5 dxc5 Qa5 Bd3 Qxc5",
        note: "White's big center is a target. Hit it right away with ...c5, and after dxc5 Qa5 the queen recovers the pawn."
      },
      {
        name: "150 Attack (4.Be3 / Qd2)",
        moves: "e4 d6 d4 Nf6 Nc3 g6 Be3 c6 Qd2 b5 f3 Nbd7",
        note: "White wants Qd2, Bh6 and h4 to mate you. Play on the queenside before castling. ...b5 gains space and threatens ...b4 to kick the c3 knight."
      },
      {
        name: "Bg5 setup",
        moves: "e4 d6 d4 Nf6 Nc3 g6 Bg5 Bg7 Qd2 h6 Bh4 c6",
        note: "Ask the bishop with ...h6. It can't go to h6 itself to trade off your Bg7 while it sits on h4."
      },
      {
        name: "3.f3 (avoiding Nc3)",
        moves: "e4 d6 d4 Nf6 f3 e5 d5 Be7",
        note: "3.f3 aims for a Sämisch-style setup. ...e5 locks the center and a quiet ...Be7 keeps things solid."
      }
    ]
  },
  {
    id: "dutch",
    name: "Dutch Defense (Leningrad)",
    side: "black",
    blurb: "1.d4 f5 with ...Nf6, ...g6, ...Bg7, ...O-O, ...d6. Fight for e4 and the kingside.",
    lines: [
      {
        name: "Main line with c4 and g3",
        moves: "d4 f5 c4 Nf6 g3 g6 Bg2 Bg7 Nf3 O-O O-O d6 Nc3 Qe8 d5 a5",
        note: "...Qe8 prepares ...e5 and can swing to h5 or f7. Once White plays d5, ...a5 secures c5 for a knight."
      },
      {
        name: "Staunton Gambit (2.e4)",
        moves: "d4 f5 e4 fxe4 Nc3 Nf6 Bg5 Nc6 d5 Ne5 Qd4 Nf7",
        note: "Take the pawn and develop. ...Nc6 hits d4 so White can't calmly win back e4. Nf7 covers both g5 and e5."
      },
      {
        name: "Early Bg5",
        moves: "d4 f5 Bg5 h6 Bh4 g5 Bg3 f4 e3 h5",
        note: "Grab space and chase the bishop. ...h5 threatens ...h4 to trap it. White has to deal with that immediately."
      },
      {
        name: "Nc3 and Bg5",
        moves: "d4 f5 Nc3 Nf6 Bg5 d5 Bxf6 exf6 e3 c6",
        note: "...d5 stops e4 for good. After Bxf6 exf6 your pawns are doubled but they cover e5, and you keep the bishop pair."
      },
      {
        name: "Quiet Nf3, g3 without c4",
        moves: "d4 f5 Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O b3 d6 Bb2 Qe8",
        note: "Same Leningrad setup. Against b3 and Bb2, ...Qe8 still prepares ...e5 to blunt the long-diagonal bishop."
      }
    ]
  },
  {
    id: "caro",
    name: "Caro-Kann",
    side: "black",
    blurb: "1.e4 c6 2.d4 d5. Solid structure, and the light-squared bishop gets out before ...e6.",
    lines: [
      {
        name: "Advance Variation (3.e5)",
        moves: "e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 Be3 cxd4 Nxd4 Ne7",
        note: "Get the bishop to f5 before ...e6, then hit d4 with ...c5. The knight goes to e7 so it can reach c6 or f5."
      },
      {
        name: "Classical (3.Nc3 dxe4)",
        moves: "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6",
        note: "When White pushes h4-h5, keep the bishop alive with ...h6 and ...Bh7. Trading it on d3 leaves you with a very solid position."
      },
      {
        name: "Exchange (3.exd5)",
        moves: "e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7",
        note: "Develop the bishop to g4 before playing ...e6. When Qb3 hits b7, ...Qd7 defends it and keeps your pieces connected."
      },
      {
        name: "Panov Attack (5.c4)",
        moves: "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7 cxd5 Nxd5",
        note: "White gets an isolated d-pawn. Recapture with the knight and blockade d5. In the endgame that pawn is a weakness."
      },
      {
        name: "Two Knights (2.Nc3, 3.Nf3)",
        moves: "e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3 Qxf3 e6 d4 Nf6",
        note: "Pin the knight, then give up the bishop for it. You get a rock-solid ...e6/...d5 center."
      }
    ]
  }
];
