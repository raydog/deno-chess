import {
  ChessGameOver,
  ChessNeedsPromotion,
} from "../src/core/datatypes/ChessError.ts";
import { ChessGame } from "../src/public/ChessGame.ts";
import { coordToAN } from "../src/core/datatypes/Coord.ts";
import { asserts } from "../testDeps.ts";

Deno.test("ChessGame Public API > Start new standard game", function () {
  const game = ChessGame.NewStandardGame();
  asserts.assertEquals(game.getStatus(), { state: "active", turn: "white" });
});

Deno.test("ChessGame Public API > String rendering", function () {
  const game = ChessGame.NewStandardGame();
  asserts.assertEquals(
    game.toString().split("\n"),
    [
      "     a  b  c  d  e  f  g  h    ",
      "   +------------------------+  ",
      " 8 | r  n  b  q  k  b  n  r | 8",
      " 7 | p  p  p  p  p  p  p  p | 7",
      " 6 |                        | 6",
      " 5 |                        | 5",
      " 4 |                        | 4",
      " 3 |                        | 3",
      " 2 | P  P  P  P  P  P  P  P | 2",
      " 1 | R  N  B  Q  K  B  N  R | 1",
      "   +------------------------+  ",
      "     a  b  c  d  e  f  g  h    ",
    ],
  );
});

Deno.test("ChessGame Public API > List all moves", function () {
  const game = ChessGame.NewStandardGame();
  const moves = game.allMoves();
  asserts.assertEquals(moves, [
    {
      dest: "a3",
      from: "b1",
      promotion: false,
    },
    {
      dest: "c3",
      from: "b1",
      promotion: false,
    },
    {
      dest: "f3",
      from: "g1",
      promotion: false,
    },
    {
      dest: "h3",
      from: "g1",
      promotion: false,
    },
    {
      dest: "a3",
      from: "a2",
      promotion: false,
    },
    {
      dest: "a4",
      from: "a2",
      promotion: false,
    },
    {
      dest: "b3",
      from: "b2",
      promotion: false,
    },
    {
      dest: "b4",
      from: "b2",
      promotion: false,
    },
    {
      dest: "c3",
      from: "c2",
      promotion: false,
    },
    {
      dest: "c4",
      from: "c2",
      promotion: false,
    },
    {
      dest: "d3",
      from: "d2",
      promotion: false,
    },
    {
      dest: "d4",
      from: "d2",
      promotion: false,
    },
    {
      dest: "e3",
      from: "e2",
      promotion: false,
    },
    {
      dest: "e4",
      from: "e2",
      promotion: false,
    },
    {
      dest: "f3",
      from: "f2",
      promotion: false,
    },
    {
      dest: "f4",
      from: "f2",
      promotion: false,
    },
    {
      dest: "g3",
      from: "g2",
      promotion: false,
    },
    {
      dest: "g4",
      from: "g2",
      promotion: false,
    },
    {
      dest: "h3",
      from: "h2",
      promotion: false,
    },
    {
      dest: "h4",
      from: "h2",
      promotion: false,
    },
  ]);
});

Deno.test("ChessGame Public API > List single pawn moves", function () {
  const game = ChessGame.NewStandardGame();
  const moves = game.allMoves("d2");
  asserts.assertEquals(moves, [
    {
      dest: "d3",
      from: "d2",
      promotion: false,
    },
    {
      dest: "d4",
      from: "d2",
      promotion: false,
    },
  ]);
});

Deno.test("ChessGame Public API > List a promotion", function () {
  const game = ChessGame.NewFromFEN("7q/P7/8/8/8/8/1p6/7Q w - - 0 1");
  asserts.assertEquals(game.allMoves("a7"), [
    {
      dest: "a8",
      from: "a7",
      promotion: true,
    },
  ]);
});

Deno.test("ChessGame Public API > Can move", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e2e4");
  asserts.assertEquals(game.getStatus(), { state: "active", turn: "black" });
});

Deno.test("ChessGame Public API > Can castle kingside", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e2e4").move("e7e5");
  game.move("g1f3").move("b8c6");
  game.move("f1c4").move("f8c5");
  game.move("e1g1");
  asserts.assertEquals(game.history().reverse()[0].san, "O-O");
  asserts.assertEquals(game.getStatus(), { state: "active", turn: "black" });
});

Deno.test("ChessGame Public API > Can castle queenside", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e2e4").move("e7e5");
  game.move("g1f3").move("b8c6");
  game.move("c2c4").move("b7b6");
  game.move("d2d4").move("c8a6");
  game.move("d4d5").move("d8f6");
  game.move("d1d2").move("e8c8");
  asserts.assertEquals(game.history().reverse()[0].san, "O-O-O");
  asserts.assertEquals(game.getStatus(), { state: "active", turn: "white" });
});

Deno.test("ChessGame Public API > Can checkmate", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e2e4").move("e7e5");
  game.move("f1c4").move("f8c5");
  game.move("d1f3").move("d7d6");
  game.move("f3f7");
  asserts.assertEquals(game.getStatus(), {
    state: "checkmate",
    turn: "black",
    winner: "white",
  });
});

Deno.test("ChessGame Public API > Promote requires a param", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a2a4").move("b7b5");
  game.move("a4b5").move("b8a6");
  game.move("b5b6").move("a6c5");
  game.move("b6b7").move("c5e6");
  asserts.assertThrows(
    () => game.move("b7b8"),
    ChessNeedsPromotion,
    "Promotion piece",
  );
});

Deno.test("ChessGame Public API > Promote to Knight", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a2a4").move("b7b5");
  game.move("a4b5").move("b8a6");
  game.move("b5b6").move("a6c5");
  game.move("b6b7").move("c5e6");
  game.move("b7b8", "N");
  asserts.assertEquals(game.history().reverse()[0].san, "b8=N");
});

Deno.test("ChessGame Public API > Promote to Queen after capture", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a2a4").move("b7b5");
  game.move("a4b5").move("b8a6");
  game.move("b5b6").move("a6c5");
  game.move("b6b7").move("c5e6");
  game.move("b7a8", "Q");
  asserts.assertEquals(game.history().reverse()[0].san, "bxa8=Q");
});

Deno.test("ChessGame Public API > Rejects moves after game over", function () {
  const game = ChessGame.NewStandardGame();
  game
    .move("e2e4").move("e7e5")
    .move("f1c4").move("f8c5")
    .move("d1f3").move("d7d6")
    .move("f3f7");

  asserts.assertEquals(game.getStatus(), {
    state: "checkmate",
    turn: "black",
    winner: "white",
  });
  asserts.assertThrows(() => game.move("e8f7"), ChessGameOver, "Game is over");
});

Deno.test("ChessGame Public API > Draws after 3 repeats", function () {
  const game = ChessGame.NewStandardGame();

  game.move("b1c3").move("g8f6");
  game.move("c3b1").move("f6g8"); // Start seen twice now.

  game.move("b1c3").move("g8f6");
  game.move("c3b1").move("f6g8"); // Third times the charm.

  asserts.assertEquals(game.getStatus(), {
    state: "draw-repetition",
    turn: "white",
    winner: "draw",
  });
  asserts.assertThrows(() => game.move("e8f7"), ChessGameOver, "Game is over");
});

Deno.test("ChessGame Public API > Draws after 50 moves", function () {
  const game = ChessGame.NewStandardGame();
  game.move("d2d4").move("d7d5");
  game.move("d1d3").move("d8d7");
  game.move("d3a3").move("d7d8");
  game.move("g1f3").move("g8f6");
  game.move("f3e5").move("f6e4");

  // The white piece runs a circuit around the board. The black piece just move back and forward:
  for (let n = 0; n < 2; n++) {
    for (let i = 0; i < 7; i++) {
      game.move(coordToAN(i | 0x20) + coordToAN((i + 1) | 0x20));
      game.move((i % 2 === 0) ? "d8d7" : "d7d8");
    }
    for (let i = 2; i < 5; i++) {
      game.move(coordToAN((i * 0x10) | 7) + coordToAN((i * 0x10 + 0x10) | 7));
      game.move((i % 2 === 1) ? "d8d7" : "d7d8");
    }
    for (let i = 7; i > 0; i--) {
      game.move(coordToAN(i | 0x50) + coordToAN((i - 1) | 0x50));
      game.move((i % 2 === 1) ? "d8d7" : "d7d8");
    }
    for (let i = 5; i > 2; i--) {
      game.move(coordToAN((i * 0x10)) + coordToAN((i * 0x10 - 0x10)));
      game.move((i % 2 === 0) ? "d8d7" : "d7d8");
    }
    // Avoid repetition fails:
    if (n === 0) {
      game.move("e1d1").move("c8f5");
    }
  }

  for (let i = 0; i < 5; i++) {
    game.move(coordToAN(i | 0x20) + coordToAN((i + 1) | 0x20));
    game.move((i % 2 === 0) ? "d8d7" : "d7d8");
  }

  asserts.assertEquals(game.getStatus(), {
    state: "draw-fifty-moves",
    turn: "white",
    winner: "draw",
  });
  asserts.assertThrows(() => game.move("e8f7"), ChessGameOver, "Game is over");
});

Deno.test("ChessGame Public API > Stalemate", function () {
  const game = ChessGame.NewStandardGame();

  game.move("e2e3").move("a7a5");
  game.move("d1h5").move("a8a6");
  game.move("h5a5").move("h7h5");
  game.move("h2h4").move("a6h6");
  game.move("a5c7").move("f7f6");
  game.move("c7d7").move("e8f7");
  game.move("d7b7").move("d8d3");
  game.move("b7b8").move("d3h7");
  game.move("b8c8").move("f7g6");
  game.move("c8e6"); // Stalemate

  asserts.assertEquals(game.getStatus(), {
    state: "draw-stalemate",
    turn: "black",
    winner: "draw",
  });
  asserts.assertThrows(() => game.move("a2a4"), ChessGameOver, "Game is over");
});

Deno.test("ChessGame Public API > FEN Output > Standard opening", function () {
  const game = ChessGame.NewStandardGame();

  asserts.assertEquals(
    game.toString("fen"),
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
});

Deno.test("ChessGame Public API > FEN Output > Checkmate", function () {
  const game = ChessGame.NewStandardGame();

  game.move("f2f3").move("e7e5");
  game.move("g2g4").move("d8h4"); // Ouch!

  asserts.assertEquals(
    game.toString("fen"),
    "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
  );
});

Deno.test("ChessGame Public API > FEN Output > Stalemate", function () {
  const game = ChessGame.NewStandardGame();

  game.move("e2e3").move("a7a5");
  game.move("d1h5").move("a8a6");
  game.move("h5a5").move("h7h5");
  game.move("h2h4").move("a6h6");
  game.move("a5c7").move("f7f6");
  game.move("c7d7").move("e8f7");
  game.move("d7b7").move("d8d3");
  game.move("b7b8").move("d3h7");
  game.move("b8c8").move("f7g6");
  game.move("c8e6"); // Stalemate

  asserts.assertEquals(
    game.toString("fen"),
    "5bnr/4p1pq/4Qpkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 2 10",
  );
});

Deno.test("ChessGame Public API > FEN Input > Game of the Century", function () {
  const game = ChessGame.NewFromFEN(
    "1Q6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5 w - - 16 42",
  );
  asserts.assertEquals(
    game.toString().split("\n"),
    [
      "     a  b  c  d  e  f  g  h    ",
      "   +------------------------+  ",
      " 8 |    Q                   | 8",
      " 7 |                p  k    | 7",
      " 6 |       p           p    | 6",
      " 5 |    p        N        p | 5",
      " 4 |    b                 P | 4",
      " 3 |    b  n                | 3",
      " 2 |       r           P    | 2",
      " 1 |       K                | 1",
      "   +------------------------+  ",
      "     a  b  c  d  e  f  g  h    ",
    ],
  );
  asserts.assertObjectMatch(game.getStatus(), {
    state: "checkmate",
    turn: "white",
    winner: "black",
  });
});

Deno.test("ChessGame Public API > PGN Input > Game of the Century", function () {
  const game = ChessGame.NewFromPGN(`[Event "Third Rosenwald Trophy"]
  [Site "New York, NY USA"]
  [Date "1956.10.17"]
  [EventDate "1956.10.07"]
  [Round "8"]
  [Result "0-1"]
  [White "Donald Byrne"]
  [Black "Robert James Fischer"]
  [ECO "D92"]
  [WhiteElo "?"]
  [BlackElo "?"]
  [PlyCount "82"]
  
  1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4
  7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 {11. Be2
  followed by 12. O-O would have been more prudent. The bishop
  move played allows a sudden crescendo of tactical points to be
  uncovered by Fischer. -- Wade} Na4 {!} 12. Qa3 {On 12. Nxa4
  Nxe4 and White faces considerable difficulties.} Nxc3 {At
  first glance, one might think that this move only helps White
  create a stronger pawn center; however, Fischer's plan is
  quite the opposite. By eliminating the Knight on c3, it
  becomes possible to sacrifice the exchange via Nxe4 and smash
  White's center, while the King remains trapped in the center.}
  13. bxc3 Nxe4 {The natural continuation of Black's plan.}
  14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 {!! If
  this is the game of the century, then 17...Be6!! must be the
  counter of the century. Fischer offers his queen in exchange
  for a fierce attack with his minor pieces. Declining this
  offer is not so easy: 18. Bxe6 leads to a 'Philidor Mate'
  (smothered mate) with ...Qb5+ 19. Kg1 Ne2+ 20. Kf1 Ng3+
  21. Kg1 Qf1+ 22. Rxf1 Ne2#. Other ways to decline the queen
  also run into trouble: e.g., 18. Qxc3 Qxc5} 18. Bxb6 Bxc4+
  19. Kg1 Ne2+ 20. Kf1 Nxd4+ {This tactical scenario, where a
  king is repeatedly revealed to checks, is sometimes called a
  "windmill."} 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4
  Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1
  29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 {Every piece
  and pawn of the black camp is defended. The white queen has
  nothing to do.} 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1
  Ng3+ {Now Byrne is hopelessly entangled in Fischer's mating
  net.} 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+
  41. Kc1 Rc2# 0-1`);
  asserts.assertEquals(
    game.toString().split("\n"),
    [
      "     a  b  c  d  e  f  g  h    ",
      "   +------------------------+  ",
      " 8 |    Q                   | 8",
      " 7 |                p  k    | 7",
      " 6 |       p           p    | 6",
      " 5 |    p        N        p | 5",
      " 4 |    b                 P | 4",
      " 3 |    b  n                | 3",
      " 2 |       r           P    | 2",
      " 1 |       K                | 1",
      "   +------------------------+  ",
      "     a  b  c  d  e  f  g  h    ",
    ],
  );
  asserts.assertObjectMatch(game.getStatus(), {
    state: "checkmate",
    turn: "white",
    winner: "black",
  });
});
