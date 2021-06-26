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
    },
    {
      dest: "c3",
      from: "b1",
    },
    {
      dest: "f3",
      from: "g1",
    },
    {
      dest: "h3",
      from: "g1",
    },
    {
      dest: "a3",
      from: "a2",
    },
    {
      dest: "a4",
      from: "a2",
    },
    {
      dest: "b3",
      from: "b2",
    },
    {
      dest: "b4",
      from: "b2",
    },
    {
      dest: "c3",
      from: "c2",
    },
    {
      dest: "c4",
      from: "c2",
    },
    {
      dest: "d3",
      from: "d2",
    },
    {
      dest: "d4",
      from: "d2",
    },
    {
      dest: "e3",
      from: "e2",
    },
    {
      dest: "e4",
      from: "e2",
    },
    {
      dest: "f3",
      from: "f2",
    },
    {
      dest: "f4",
      from: "f2",
    },
    {
      dest: "g3",
      from: "g2",
    },
    {
      dest: "g4",
      from: "g2",
    },
    {
      dest: "h3",
      from: "h2",
    },
    {
      dest: "h4",
      from: "h2",
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
    },
    {
      dest: "d4",
      from: "d2",
    },
  ]);
});

Deno.test("ChessGame Public API > List a promotion", function () {
  const game = ChessGame.NewFromFEN("7q/P7/8/8/8/8/1p6/7Q w - - 0 1");
  asserts.assertEquals(game.allMoves("a7"), [
    {
      dest: "a8",
      from: "a7",
      promotion: "Q",
    },
    {
      dest: "a8",
      from: "a7",
      promotion: "R",
    },
    {
      dest: "a8",
      from: "a7",
      promotion: "N",
    },
    {
      dest: "a8",
      from: "a7",
      promotion: "B",
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

Deno.test("ChessGame Public API > Promote to Knight in UCI", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a2a4").move("b7b5");
  game.move("a4b5").move("b8a6");
  game.move("b5b6").move("a6c5");
  game.move("b6b7").move("c5e6");
  game.move("b7b8n");
  asserts.assertEquals(game.history().reverse()[0].san, "b8=N");
});

Deno.test("ChessGame Public API > Promote to Queen after capture in UCI", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a2a4").move("b7b5");
  game.move("a4b5").move("b8a6");
  game.move("b5b6").move("a6c5");
  game.move("b6b7").move("c5e6");
  game.move("b7a8Q");
  asserts.assertEquals(game.history().reverse()[0].san, "bxa8=Q");
});

Deno.test("ChessGame Public API > Promote to Knight in SAN", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a4").move("b5");
  game.move("axb5").move("Na6");
  game.move("b6").move("Nc5");
  game.move("b7").move("Ne6");
  game.move("b8=N");
  asserts.assertEquals(game.history().reverse()[0].san, "b8=N");
});

Deno.test("ChessGame Public API > Promote to Queen after capture in SAN", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a4").move("b5");
  game.move("axb5").move("Na6");
  game.move("b6").move("Nc5");
  game.move("b7").move("Ne6");
  game.move("bxa8=Q");
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

Deno.test("ChessGame Public API > PGN Output > Produces a parsable result", function () {
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
  const pgn = game.toString("pgn");
  const game2 = ChessGame.NewFromPGN(pgn);
  asserts.assertEquals(game2.getStatus(), {
    state: "checkmate",
    turn: "black",
    winner: "white",
  });
});

Deno.test("ChessGame Public API > PGN Output > Works with custom starts", function () {
  const game = ChessGame.NewFromFEN(
    "3rqr2/3ppp2/8/8/8/8/3PPP2/3RKR2 w - - 0 1",
  );
  game.move("e4").move("e5");
  game.move("Rc1").move("Rh8");
  const pgn = game.toString("pgn");
  asserts.assertStringIncludes(pgn, '[Result "*"]');
  asserts.assertStringIncludes(pgn, '[SetUp "1"]');
  asserts.assertStringIncludes(
    pgn,
    '[FEN "3rqr2/3ppp2/8/8/8/8/3PPP2/3RKR2 w - - 0 1"]',
  );
});

Deno.test("ChessGame Public API > Move revert > Standard moves", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e4").move("e5");
  _testManyUndos(game, [
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  ]);
});

Deno.test("ChessGame Public API > Move revert > Captures", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e4").move("e5");
  game.move("d4").move("d5");
  game.move("dxe5").move("dxe4");
  game.move("Qxd8+").move("Kxd8");
  _testManyUndos(game, [
    "rnbk1bnr/ppp2ppp/8/4P3/4p3/8/PPP2PPP/RNB1KBNR w KQ - 0 5",
    "rnbQkbnr/ppp2ppp/8/4P3/4p3/8/PPP2PPP/RNB1KBNR b KQkq - 0 4",
    "rnbqkbnr/ppp2ppp/8/4P3/4p3/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
    "rnbqkbnr/ppp2ppp/8/3pP3/4P3/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
    "rnbqkbnr/ppp2ppp/8/3pp3/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3",
    "rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  ]);
});

Deno.test("ChessGame Public API > Move revert > Castles", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e4").move("e5");
  game.move("Nf3").move("Bc5");
  game.move("Bc4").move("Nc6");
  game.move("Kf1");
  asserts.assertEquals(
    game.toString("fen"),
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1K1R b kq - 5 4",
  );
  game.undoMove();
  game.move("Kg1");
  asserts.assertEquals(
    game.toString("fen"),
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4",
  );
  game.undoMove();
  game.move("Ke2");
  asserts.assertEquals(
    game.toString("fen"),
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPPKPPP/RNBQ3R b kq - 5 4",
  );
});

Deno.test("ChessGame Public API > Move revert > Restores En Passant", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e4").move("Nf6");
  game.move("e5").move("d5");
  game.move("Bc4");
  asserts.assertEquals(
    game.toString("fen"),
    "rnbqkb1r/ppp1pppp/5n2/3pP3/2B5/8/PPPP1PPP/RNBQK1NR b KQkq - 1 3",
  );
  game.undoMove();
  asserts.assertEquals(
    game.toString("fen"),
    "rnbqkb1r/ppp1pppp/5n2/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3",
  );
  game.move("exd6");
  asserts.assertEquals(
    game.toString("fen"),
    "rnbqkb1r/ppp1pppp/3P1n2/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3",
  );
  game.undoMove();
  asserts.assertEquals(
    game.toString("fen"),
    "rnbqkb1r/ppp1pppp/5n2/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3",
  );
});

Deno.test("ChessGame Public API > Move revert > Undoes a promotion", function () {
  const game = ChessGame.NewFromPGN(`
    [Site "Test case"]
    1. a4 b5 2. axb5 Nc6 3. b6 Ne5 4. b7 Nc4 *
  `);
  asserts.assertEquals(
    game.toString("fen"),
    "r1bqkbnr/pPpppppp/8/8/2n5/8/1PPPPPPP/RNBQKBNR w KQkq - 1 5",
  );
  game.move("b8=N");
  asserts.assertEquals(
    game.toString("fen"),
    "rNbqkbnr/p1pppppp/8/8/2n5/8/1PPPPPPP/RNBQKBNR b KQkq - 0 5",
  );
  game.undoMove();
  asserts.assertEquals(
    game.toString("fen"),
    "r1bqkbnr/pPpppppp/8/8/2n5/8/1PPPPPPP/RNBQKBNR w KQkq - 1 5",
  );
  game.move("bxa8=Q");
  asserts.assertEquals(
    game.toString("fen"),
    "Q1bqkbnr/p1pppppp/8/8/2n5/8/1PPPPPPP/RNBQKBNR b KQk - 0 5",
  );
  game.undoMove();
  asserts.assertEquals(
    game.toString("fen"),
    "r1bqkbnr/pPpppppp/8/8/2n5/8/1PPPPPPP/RNBQKBNR w KQkq - 1 5",
  );
});

Deno.test("ChessGame Public API > Move revert > Repetitions", function () {
  const game = ChessGame.NewStandardGame();
  for (let i = 0; i < 10; i++) {
    game.move("Nc3");
    game.undoMove();
  }
  game.move("Nc3");
  asserts.assertObjectMatch(game.getStatus(), {
    state: "active",
    turn: "black",
  });
});

Deno.test("ChessGame Public API > Move revert > Checkmate", function () {
  const game = ChessGame.NewStandardGame();
  game.move("f4").move("e6");
  game.move("g4").move("Qh4#");
  asserts.assertObjectMatch(game.getStatus(), {
    state: "checkmate",
    turn: "white",
    winner: "black",
  });
  game.undoMove();
  asserts.assertObjectMatch(game.getStatus(), {
    state: "active",
    turn: "black",
  });
  game.undoMove();
  asserts.assertObjectMatch(game.getStatus(), {
    state: "active",
    turn: "white",
  });
  asserts.assertEquals(
    game.toString("fen"),
    "rnbqkbnr/pppp1ppp/4p3/8/5P2/8/PPPPP1PP/RNBQKBNR w KQkq - 0 2",
  );
});

// Test our ability to undo moves
function _testManyUndos(game: ChessGame, fens: string[]) {
  for (let idx = 0; idx < fens.length; idx++) {
    asserts.assertEquals(game.toString("fen"), fens[idx]);
    game.undoMove();
  }
}
