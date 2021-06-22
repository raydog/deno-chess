import { ChessBadMove } from "../src/core/datatypes/ChessError.ts";
import { COLOR_BLACK, COLOR_WHITE } from "../src/core/datatypes/Color.ts";
import { PIECETYPE_QUEEN } from "../src/core/datatypes/PieceType.ts";
import { boardFromFEN } from "../src/core/logic/FEN/boardFromFEN.ts";
import { findMoveBySAN } from "../src/core/logic/findMoveBySAN.ts";
import { listAllValidMoves } from "../src/core/logic/listValidMoves.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Find Move by SAN > Pawn > Single", function () {
  const board = boardFromFEN("5k2/8/8/8/2P5/8/1K6/8 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assert(findMoveBySAN(moves, "c5"));
});

Deno.test("Find Move by SAN > Pawn > Openings", function () {
  const board = boardFromFEN("1k6/8/8/8/8/8/4PPP1/5K2 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assert(findMoveBySAN(moves, "f4"));
  asserts.assert(findMoveBySAN(moves, "f3"));
});

Deno.test("Find Move by SAN > Pawn > Captures", function () {
  const board = boardFromFEN("1k6/8/4b1p1/5P2/8/5n2/4P1P1/5K2 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assert(findMoveBySAN(moves, "exf3"));
  asserts.assert(findMoveBySAN(moves, "gxf3"));
  asserts.assert(findMoveBySAN(moves, "fxe6"));
  asserts.assert(findMoveBySAN(moves, "fxg6"));
});

Deno.test("Find Move by SAN > Pawn > Promote", function () {
  const board = boardFromFEN("2r3kr/3P1ppp/8/8/8/8/1K6/2n2q2 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  const move1 = findMoveBySAN(moves, "dxc8=Q# 1-0");
  asserts.assert(move1);
  asserts.assertEquals(move1.promote, PIECETYPE_QUEEN);
});

Deno.test("Find Move by SAN > Pawn > En Passant", function () {
  const board = boardFromFEN("5k2/8/8/3Pp3/8/8/1K6/8 w - e6 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assert(findMoveBySAN(moves, "dxe6"));
});

Deno.test("Find Move by SAN > Bishops > Normal Move", function () {
  const board = boardFromFEN("8/5pk1/8/8/8/8/5B2/6K1 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assert(findMoveBySAN(moves, "Bc5"));
});

Deno.test("Find Move by SAN > Bishops > Ambiguous (Rank) Moves", function () {
  const board = boardFromFEN("8/5pk1/1B6/8/8/8/1B6/6K1 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assertThrows(
    () => findMoveBySAN(moves, "Bd4"),
    ChessBadMove,
    "ambiguous",
  );
  asserts.assert(findMoveBySAN(moves, "B2d4"));
});

Deno.test("Find Move by SAN > Bishops > Ambiguous (File) Moves", function () {
  const board = boardFromFEN("6k1/3p4/8/8/1B3B2/8/8/3K4 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assertThrows(
    () => findMoveBySAN(moves, "Bd6"),
    ChessBadMove,
    "ambiguous",
  );
  asserts.assert(findMoveBySAN(moves, "Bfd6"));
});

Deno.test("Find Move by SAN > Bishops > Ambiguous (Full) Moves", function () {
  const board = boardFromFEN("1B4k1/3p4/8/8/1B3B2/8/8/3K4 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assertThrows(
    () => findMoveBySAN(moves, "Bd6"),
    ChessBadMove,
    "ambiguous",
  );
  asserts.assertThrows(
    () => findMoveBySAN(moves, "Bbd6"),
    ChessBadMove,
    "ambiguous",
  );
  asserts.assertThrows(
    () => findMoveBySAN(moves, "B4d6"),
    ChessBadMove,
    "ambiguous",
  );
  asserts.assert(findMoveBySAN(moves, "Bb4d6"));
});

Deno.test("Find Move by SAN > Bishops > Capture", function () {
  const board = boardFromFEN("8/1b3pk1/8/8/8/5R2/8/6K1 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_BLACK);
  asserts.assert(findMoveBySAN(moves, "Bxf3"));
});

Deno.test("Find Move by SAN > Knight > Move", function () {
  const board = boardFromFEN("5k2/8/1N3n2/8/8/8/1K6/8 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_BLACK);
  asserts.assert(findMoveBySAN(moves, "Nd5"));
});

Deno.test("Find Move by SAN > Knight > Capture", function () {
  const board = boardFromFEN("5k2/8/5n2/3N4/8/8/1K6/8 w - - 0 1");
  const moves = listAllValidMoves(board, COLOR_BLACK);
  asserts.assert(findMoveBySAN(moves, "Nxd5"));
});

Deno.test("Find Move by SAN > King > Castle Kingside", function () {
  const board = boardFromFEN(
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
  );
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assert(findMoveBySAN(moves, "O-O"));
});

Deno.test("Find Move by SAN > King > Castle Queenside", function () {
  const board = boardFromFEN(
    "r3kb1r/ppp2ppp/2np1nq1/1N2p1B1/4P1b1/3P1NP1/PPP1BP1P/R2QK2R w KQkq - 0 1",
  );
  const moves = listAllValidMoves(board, COLOR_BLACK);
  asserts.assert(findMoveBySAN(moves, "O-O-O"));
});

Deno.test("Find Move by SAN > King > Castle Kingside with annotations", function () {
  const board = boardFromFEN(
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
  );
  const moves = listAllValidMoves(board, COLOR_WHITE);
  asserts.assert(findMoveBySAN(moves, "O-O# 1-0"));
});

Deno.test("Find Move by SAN > King > Castle Queenside with annotations", function () {
  const board = boardFromFEN(
    "r3kb1r/ppp2ppp/2np1nq1/1N2p1B1/4P1b1/3P1NP1/PPP1BP1P/R2QK2R w KQkq - 0 1",
  );
  const moves = listAllValidMoves(board, COLOR_BLACK);
  asserts.assert(findMoveBySAN(moves, "O-O-O+!?"));
});
