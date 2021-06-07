import { COLOR_BLACK, COLOR_WHITE } from "../src/core/datatypes/Color.ts";
import { coordFromAN } from "../src/core/datatypes/Coord.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/core/datatypes/Space.ts";
import { listValidMoves } from "../src/core/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Pawn > White opening", function () {
  const b = boardLayout({
    c2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("c2")), ["c3", "c4"]);
});

Deno.test("List Valid Moves > Pawn > Black opening", function () {
  const b = boardLayout({
    f7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("f7")), ["f6", "f5"]);
});

Deno.test("List Valid Moves > Pawn > White basic move", function () {
  const b = boardLayout({
    d6: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d6")), ["d7"]);
});

Deno.test("List Valid Moves > Pawn > Black basic move", function () {
  const b = boardLayout({
    b3: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("b3")), ["b2"]);
});

Deno.test("List Valid Moves > Pawn > White blocked by white", function () {
  const b = boardLayout({
    e4: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
    e5: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e4")), []);
});

Deno.test("List Valid Moves > Pawn > White blocked by black", function () {
  const b = boardLayout({
    e4: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
    e5: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e4")), []);
});

Deno.test("List Valid Moves > Pawn > Black blocked by white", function () {
  const b = boardLayout({
    b3: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
    b2: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("b3")), []);
});

Deno.test("List Valid Moves > Pawn > Black blocked by black", function () {
  const b = boardLayout({
    b3: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
    b2: encodePieceSpace(PIECETYPE_QUEEN, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("b3")), []);
});

Deno.test("List Valid Moves > Pawn > White promotion", function () {
  const b = boardLayout({
    c7: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("c7")), ["c8=Q"]);
});

Deno.test("List Valid Moves > Pawn > Black promotion", function () {
  const b = boardLayout({
    e2: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e2")), ["e1=Q"]);
});

Deno.test("List Valid Moves > Pawn > White capture promotion", function () {
  const b = boardLayout({
    c7: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
    d8: encodePieceSpace(PIECETYPE_QUEEN, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("c7")), ["c8=Q", "cxd8=Q"]);
});

Deno.test("List Valid Moves > Pawn > Black capture promotion", function () {
  const b = boardLayout({
    e2: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
    f1: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e2")), ["e1=Q", "exf1=Q"]);
});

Deno.test("List Valid Moves > Pawn > White opening capture left", function () {
  const b = boardLayout({
    h2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE),
    g3: encodePieceSpace(PIECETYPE_BISHOP, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h2")), ["h3", "h4", "hxg3"]);
});

Deno.test("List Valid Moves > Pawn > White opening capture right", function () {
  const b = boardLayout({
    a2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE),
    b3: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("a2")), ["a3", "a4", "axb3"]);
});

Deno.test("List Valid Moves > Pawn > White opening capture both", function () {
  const b = boardLayout({
    c2: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE),
    b3: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK, true),
    d3: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("c2")), [
    "c3",
    "c4",
    "cxb3",
    "cxd3",
  ]);
});

Deno.test("List Valid Moves > Pawn > Black opening capture left", function () {
  const b = boardLayout({
    h7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
    g6: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), ["h6", "h5", "hxg6"]);
});

Deno.test("List Valid Moves > Pawn > Black opening capture right", function () {
  const b = boardLayout({
    a7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
    b6: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("a7")), ["a6", "a5", "axb6"]);
});

Deno.test("List Valid Moves > Pawn > Black opening capture both", function () {
  const b = boardLayout({
    c7: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
    b6: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
    d6: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("c7")), [
    "c6",
    "c5",
    "cxb6",
    "cxd6",
  ]);
});

Deno.test("List Valid Moves > Pawn > White captures en passant on the left", function () {
  const b = boardLayout({
    e5: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
    d5: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
  });
  b.current.ep = coordFromAN("d6");
  assertMoves(b, listValidMoves(b, coordFromAN("e5")), ["exd6", "e6"]);
});

Deno.test("List Valid Moves > Pawn > White captures en passant on the right", function () {
  const b = boardLayout({
    e5: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
    f5: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
  });
  b.current.ep = coordFromAN("f6");
  assertMoves(b, listValidMoves(b, coordFromAN("e5")), ["e6", "exf6"]);
});

Deno.test("List Valid Moves > Pawn > Black captures en passant on the left", function () {
  const b = boardLayout({
    e4: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
    d4: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
  });
  b.current.ep = coordFromAN("d3");
  assertMoves(b, listValidMoves(b, coordFromAN("e4")), ["exd3", "e3"]);
});

Deno.test("List Valid Moves > Pawn > Black captures en passant on the right", function () {
  const b = boardLayout({
    e4: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK, true),
    f4: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE, true),
  });
  b.current.ep = coordFromAN("f3");
  assertMoves(b, listValidMoves(b, coordFromAN("e4")), ["e3", "exf3"]);
});
