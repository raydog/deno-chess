import { COLOR_BLACK, COLOR_WHITE } from "../src/core/datatypes/Color.ts";
import { coordFromAN } from "../src/core/datatypes/Coord.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
} from "../src/core/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/core/datatypes/Space.ts";
import { listValidMoves } from "../src/core/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Knight > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d5")), [
    "Nb4",
    "Nb6",
    "Nc3",
    "Nc7",
    "Ne3",
    "Ne7",
    "Nf4",
    "Nf6",
  ]);
});

Deno.test("List Valid Moves > Knight > Handles blocks", function () {
  const b = boardLayout({
    h7: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE),
    f8: encodePieceSpace(PIECETYPE_BISHOP, COLOR_WHITE),
    g5: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), [
    "Nf6",
  ]);
});

Deno.test("List Valid Moves > Knight > Handles captures", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE),
    b6: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
    f8: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_BLACK),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Nxb6",
    "Nb8",
    "Nc5",
    "Ne5",
    "Nf6",
    "Nxf8",
  ]);
});

Deno.test("List Valid Moves > Knight > Blocks check", function () {
  const b = boardLayout({
    f1: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    f6: encodePieceSpace(PIECETYPE_QUEEN, COLOR_BLACK, true),
    g1: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("g1")), [
    "Nf3",
  ]);
});
