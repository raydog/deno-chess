import { Color } from "../src/datatypes/Color.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { buildStandardBoard } from "../src/logic/boardLayouts/standard.ts";
import {
  listAllValidMoves,
} from "../src/logic/listValidMoves.ts";
import { asserts } from "../testDeps.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List All Valid Moves > Standard opening", function () {
  const b = buildStandardBoard();
  const m = listAllValidMoves(b, Color.White, true);
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
  ]);
});

Deno.test("List All Valid Moves > Sparse endgame", function () {
  const b = boardLayout({
    c4: encodePieceSpace(PieceType.Knight, Color.Black, true),
    b8: encodePieceSpace(PieceType.King, Color.Black, true),
    b7: encodePieceSpace(PieceType.Pawn, Color.Black, false),
    g1: encodePieceSpace(PieceType.King, Color.White, true),
    h1: encodePieceSpace(PieceType.Queen, Color.White, true),
  });
  const m = listAllValidMoves(b, Color.White, true);
  // White: 17 (4 King dirs + 12 queen moves + 1 queen captures pawn)
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
  ]);
});

Deno.test("List All Valid Moves > Detects a checkmate", function () {
  const b = boardLayout({
    a1: encodePieceSpace(PieceType.Rook, Color.White, false),
    b1: encodePieceSpace(PieceType.King, Color.White, true),
    a2: encodePieceSpace(PieceType.Pawn, Color.White, false),
    b2: encodePieceSpace(PieceType.Pawn, Color.White, false),
    c2: encodePieceSpace(PieceType.Pawn, Color.White, false),

    a7: encodePieceSpace(PieceType.Queen, Color.Black, true),
    a8: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  const m = listAllValidMoves(b, Color.Black, true);
  // White: 17 (4 King dirs + 12 queen moves + 1 queen captures pawn)
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
    "Qg1# 0-1",
    "Qg7",
    "Qh7",
    "Qxa2+",
  ]);
});

Deno.test("List All Valid Moves > Detects a stalemate", function () {
  const b = boardLayout({
    h8: encodePieceSpace(PieceType.King, Color.Black, true),
    f5: encodePieceSpace(PieceType.Pawn, Color.Black, true),

    f4: encodePieceSpace(PieceType.Pawn, Color.White, true),
    e1: encodePieceSpace(PieceType.King, Color.White, false),
    e7: encodePieceSpace(PieceType.Queen, Color.White, true),
  });
  const m = listAllValidMoves(b, Color.White, true);
  // White: 17 (4 King dirs + 12 queen moves + 1 queen captures pawn)
  assertMoves(b, m, [
    "Kd1",
    "Kd2",
    "Ke2",
    "Kf1",
    "Kf2",
    "Qa3",
    "Qa7",
    "Qb4",
    "Qb7",
    "Qc5",
    "Qc7",
    "Qd6",
    "Qd7",
    "Qd8+",
    "Qe2",
    "Qe3",
    "Qe4",
    "Qe5+",
    "Qe6",
    "Qe8+",
    "Qf6+",
    "Qf7 0-0",
    "Qf8+",
    "Qg5",
    "Qg7+",
    "Qh4+",
    "Qh7+",
  ]);
});
