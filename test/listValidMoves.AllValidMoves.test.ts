import { COLOR_BLACK, COLOR_WHITE } from "../src/core/datatypes/Color.ts";
import {
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/core/datatypes/Space.ts";
import { buildStandardBoard } from "../src/core/logic/boardLayouts/standard.ts";
import { listAllValidMoves } from "../src/core/logic/listValidMoves.ts";
import { asserts } from "../testDeps.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List All Valid Moves > Standard opening", function () {
  const b = buildStandardBoard();
  const m = listAllValidMoves(b, COLOR_WHITE);
  // 20 moves: 8 pawns * 2 moves (1 or 2 steps) + 2 knights * 2 directions (left and right)
  asserts.assertEquals(m.length, 20);
  assertMoves(b, m, [
    "Na3",
    "Nc3",
    "Nf3",
    "Nh3",
    "a3",
    "a4",
    "b3",
    "b4",
    "c3",
    "c4",
    "d3",
    "d4",
    "e3",
    "e4",
    "f3",
    "f4",
    "g3",
    "g4",
    "h3",
    "h4",
  ], true);
});

Deno.test("List All Valid Moves > Sparse endgame", function () {
  const b = boardLayout({
    c4: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK, true),
    b8: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK, true),
    b7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, false),
    g1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    h1: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE, true),
  });
  const m = listAllValidMoves(b, COLOR_WHITE);
  assertMoves(b, m, [
    "Kf1",
    "Kg2",
    "Kh2",
    "Kf2",
    "Qh2+",
    "Qh3",
    "Qh4",
    "Qh5",
    "Qh6",
    "Qh7",
    "Qh8+",
    "Qg2",
    "Qf3",
    "Qe4",
    "Qd5",
    "Qc6",
    "Qxb7+",
  ], true);
});

Deno.test("List All Valid Moves > Detects a checkmate", function () {
  const b = boardLayout({
    a1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, false),
    b1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    a2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, false),
    b2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, false),
    c2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, false),

    a7: encodePieceSpace(PIECETYPE_QUEEN, COLOR_BLACK, true),
    a8: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK, true),
  });
  const m = listAllValidMoves(b, COLOR_BLACK);
  assertMoves(b, m, [
    "Kb7",
    "Kb8",
    "Qa3",
    "Qa4",
    "Qa5",
    "Qa6",
    "Qb6",
    "Qb7",
    "Qb8",
    "Qc5",
    "Qc7",
    "Qd4",
    "Qd7",
    "Qe3",
    "Qe7",
    "Qf2",
    "Qf7",
    "Qg1#",
    "Qg7",
    "Qh7",
    "Qxa2+",
  ], true);
});

Deno.test("List All Valid Moves > Kingside castle that delivers check", function () {
  const b = boardLayout({
    a8: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK),
    h8: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK),
    e8: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK),
    a7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
    h7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),

    f1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
  });
  const m = listAllValidMoves(b, COLOR_BLACK);
  assertMoves(b, m, [
    "Kd7",
    "Kd8",
    "Ke7",
    "Kf7",
    "Kf8",
    "O-O+",
    "O-O-O",
    "Rb8",
    "Rc8",
    "Rd8",
    "Rf8+",
    "Rg8",
    "a5",
    "a6",
    "h5",
    "h6",
  ], true);
});

Deno.test("List All Valid Moves > Queenside castle that delivers checkmate", function () {
  const b = boardLayout({
    a8: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK),
    h8: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK),
    e8: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK),
    a7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
    h7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),

    d1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    c2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
    e2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
    c1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
    e1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
  });
  const m = listAllValidMoves(b, COLOR_BLACK);
  assertMoves(b, m, [
    "Kd7",
    "Kd8",
    "Ke7",
    "Kf7",
    "Kf8",
    "O-O",
    "O-O-O#",
    "Rb8",
    "Rc8",
    "Rd8#",
    "Rf8",
    "Rg8",
    "a5",
    "a6",
    "h5",
    "h6",
  ], true);
});
