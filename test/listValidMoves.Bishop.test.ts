import { Color, COLOR_BLACK, COLOR_WHITE } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Bishop > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d5")), [
    "Bc4",
    "Bb3",
    "Ba2",
    "Bc6",
    "Bb7",
    "Ba8",
    "Be6",
    "Bf7",
    "Bg8",
    "Be4",
    "Bf3",
    "Bg2",
    "Bh1",
  ]);
});

Deno.test("List Valid Moves > Bishop > Handles blocks", function () {
  const b = boardLayout({
    h3: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    f1: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    e6: encodePieceSpace(PieceType.Knight, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h3")), [
    "Bg2",
    "Bg4",
    "Bf5",
  ]);
});

Deno.test("List Valid Moves > Bishop > Handles captures", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    f5: encodePieceSpace(PieceType.Rook, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Bc8",
    "Be8",
    "Bc6",
    "Bb5",
    "Ba4",
    "Be6",
    "Bxf5",
  ]);
});

Deno.test("List Valid Moves > Bishop > Blocks check", function () {
  const b = boardLayout({
    e3: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    b2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    e5: encodePieceSpace(PieceType.Queen, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("e3")), [
    "Bd4",
  ]);
});

Deno.test("List Valid Moves > Bishop > Ends check by capture", function () {
  const b = boardLayout({
    h2: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    b2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    e5: encodePieceSpace(PieceType.Queen, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h2")), [
    "Bxe5",
  ]);
});

Deno.test("List Valid Moves > Bishop > Pinned", function () {
  const b = boardLayout({
    c4: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    c1: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Queen, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("c4")), []);
});
