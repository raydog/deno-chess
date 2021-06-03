import { Color, COLOR_BLACK, COLOR_WHITE } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > King > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d5")), [
    "Kc4",
    "Kc5",
    "Kc6",
    "Kd4",
    "Kd6",
    "Ke4",
    "Ke5",
    "Ke6",
  ]);
});

Deno.test("List Valid Moves > King > Handles blocks", function () {
  const b = boardLayout({
    h7: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    g8: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    f7: encodePieceSpace(PieceType.Knight, COLOR_WHITE, true),
    h6: encodePieceSpace(PieceType.Pawn, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), [
    "Kh8",
    "Kg7",
    "Kg6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by pawn", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    d5: encodePieceSpace(PieceType.Pawn, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Ke8",
    "Kc7",
    "Ke7",
    "Kd6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by bishop", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    f7: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Kc7",
    "Ke7",
    "Kc6",
    "Kd6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by knight", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    f5: encodePieceSpace(PieceType.Knight, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Ke8",
    "Kc7",
    "Kc6",
    "Ke6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by rook", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    e2: encodePieceSpace(PieceType.Rook, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Kc7",
    "Kc6",
    "Kd6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by queen", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    d5: encodePieceSpace(PieceType.Queen, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Ke8",
    "Kc7",
    "Ke7",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by king", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    b7: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kd8",
    "Ke8",
    "Ke7",
    "Kd6",
    "Ke6",
  ]);
});

Deno.test("List Valid Moves > King > Allows safe captures", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Pawn, COLOR_BLACK, true),
    e6: encodePieceSpace(PieceType.Knight, COLOR_BLACK, true),
    d6: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Ke8",
    "Kc6",
    "Kxe6",
  ]);
});

Deno.test("List Valid Moves > King > Simple queenside castle", function () {
  const b = boardLayout({
    e1: encodePieceSpace(PieceType.King, COLOR_WHITE),
    a1: encodePieceSpace(PieceType.Rook, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e1")), [
    "Kd1",
    "Kd2",
    "Ke2",
    "Kf1",
    "Kf2",
    "O-O-O",
  ]);
});

Deno.test("List Valid Moves > King > Simple kingside castle", function () {
  const b = boardLayout({
    e1: encodePieceSpace(PieceType.King, COLOR_WHITE),
    h1: encodePieceSpace(PieceType.Rook, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e1")), [
    "Kd1",
    "Kd2",
    "Ke2",
    "Kf1",
    "Kf2",
    "O-O",
  ]);
});

Deno.test("List Valid Moves > King > Blocked queenside castle", function () {
  const b = boardLayout({
    e1: encodePieceSpace(PieceType.King, COLOR_WHITE),
    b1: encodePieceSpace(PieceType.Knight, COLOR_WHITE),
    a1: encodePieceSpace(PieceType.Rook, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e1")), [
    "Kd1",
    "Kd2",
    "Ke2",
    "Kf1",
    "Kf2",
  ]);
});

Deno.test("List Valid Moves > King > Blocked kingside castle", function () {
  const b = boardLayout({
    e1: encodePieceSpace(PieceType.King, COLOR_WHITE),
    f1: encodePieceSpace(PieceType.Bishop, COLOR_WHITE),
    h1: encodePieceSpace(PieceType.Rook, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e1")), [
    "Kd1",
    "Kd2",
    "Ke2",
    "Kf2",
  ]);
});
