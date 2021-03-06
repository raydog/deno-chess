import { COLOR_BLACK, COLOR_WHITE } from "../src/core/datatypes/Color.ts";
import { coordFromAN } from "../src/core/datatypes/Coord.ts";
import { createSimpleCapture } from "../src/core/datatypes/Move.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/core/datatypes/Space.ts";
import { listValidMoves } from "../src/core/logic/listValidMoves.ts";
import { performMove } from "../src/core/logic/performMove.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > King > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
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
    h7: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    g8: encodePieceSpace(PIECETYPE_BISHOP, COLOR_WHITE, true),
    f7: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE, true),
    h6: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), [
    "Kh8",
    "Kg7",
    "Kg6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by pawn", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK, true),
    d5: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
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
    d7: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK, true),
    f7: encodePieceSpace(PIECETYPE_BISHOP, COLOR_WHITE, true),
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
    d7: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK, true),
    f5: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE, true),
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
    d7: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    e2: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK, true),
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
    d7: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK, true),
    d5: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE, true),
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
    d7: encodePieceSpace(PIECETYPE_KING, COLOR_BLACK, true),
    b7: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
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
    d7: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    c7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
    e6: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK, true),
    d6: encodePieceSpace(PIECETYPE_BISHOP, COLOR_BLACK, true),
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
    e1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE),
    a1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
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
    e1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE),
    h1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
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
    e1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE),
    b1: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE),
    a1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
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
    e1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE),
    f1: encodePieceSpace(PIECETYPE_BISHOP, COLOR_WHITE),
    h1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e1")), [
    "Kd1",
    "Kd2",
    "Ke2",
    "Kf2",
  ]);
});

Deno.test("List Valid Moves > King > Cannot castle kingside with enemy piece", function () {
  const b = boardLayout({
    a1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
    h1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
    e1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE),

    b3: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK),
    g3: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK),
  });
  performMove(
    b,
    createSimpleCapture(
      b.get(0x26),
      0x26,
      0x07,
      b.get(0x07),
      0x07,
      b.getPriorState(),
    ),
  );
  const m = listValidMoves(b, coordFromAN("e1"));
  assertMoves(b, m, [
    "Kd1",
    "Ke2",
    "Kf1",
    // NOT: O-O !
  ]);
});

Deno.test("List Valid Moves > King > Cannot castle queenside with enemy piece", function () {
  const b = boardLayout({
    a1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
    h1: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE),
    e1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE),

    b3: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK),
    g3: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK),
  });
  performMove(
    b,
    createSimpleCapture(
      b.get(0x21),
      0x21,
      0x00,
      b.get(0x00),
      0x00,
      b.getPriorState(),
    ),
  );
  const m = listValidMoves(b, coordFromAN("e1"));
  assertMoves(b, m, [
    "Kd1",
    "Kd2",
    "Kf2",
    // NOT: O-O-O !
  ]);
});
