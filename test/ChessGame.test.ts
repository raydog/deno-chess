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
  const moves = game.allMoves().sort();
  asserts.assertEquals(moves, [
    "a2a3",
    "a2a4",
    "b1a3",
    "b1c3",
    "b2b3",
    "b2b4",
    "c2c3",
    "c2c4",
    "d2d3",
    "d2d4",
    "e2e3",
    "e2e4",
    "f2f3",
    "f2f4",
    "g1f3",
    "g1h3",
    "g2g3",
    "g2g4",
    "h2h3",
    "h2h4",
  ]);
});

Deno.test("ChessGame Public API > List single pawn moves", function () {
  const game = ChessGame.NewStandardGame();
  const moves = game.allMoves("d2").sort();
  asserts.assertEquals(moves, [
    "d2d3",
    "d2d4",
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
  asserts.assertEquals(game.history().reverse()[0].white, "O-O");
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
  asserts.assertEquals(game.history().reverse()[0].black, "O-O-O");
  asserts.assertEquals(game.getStatus(), { state: "active", turn: "white" });
});

Deno.test("ChessGame Public API > Can checkmate", function () {
  const game = ChessGame.NewStandardGame();
  game.move("e2e4").move("e7e5");
  game.move("f1c4").move("f8c5");
  game.move("d1f3").move("d7d6");
  game.move("f3f7");
  asserts.assertEquals(game.getStatus(), { state: "checkmate", turn: "black", winner: "white" });
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
  asserts.assertEquals(game.history().reverse()[0].white, "b8=N");
});

Deno.test("ChessGame Public API > Promote to Queen after capture", function () {
  const game = ChessGame.NewStandardGame();
  game.move("a2a4").move("b7b5");
  game.move("a4b5").move("b8a6");
  game.move("b5b6").move("a6c5");
  game.move("b6b7").move("c5e6");
  game.move("b7a8", "Q");
  asserts.assertEquals(game.history().reverse()[0].white, "bxa8=Q");
});

Deno.test("ChessGame Public API > Rejects moves after game over", function () {
  const game = ChessGame.NewStandardGame();
  game
    .move("e2e4").move("e7e5")
    .move("f1c4").move("f8c5")
    .move("d1f3").move("d7d6")
    .move("f3f7");

  asserts.assertEquals(game.getStatus(), { state: "checkmate", turn: "black", winner: "white" });
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
