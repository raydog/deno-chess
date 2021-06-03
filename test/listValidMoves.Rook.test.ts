import { Color, COLOR_BLACK, COLOR_WHITE } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType, PIECETYPE_KING, PIECETYPE_KNIGHT, PIECETYPE_ROOK } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Rook > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d5")), [
    "Rd8",
    "Rd7",
    "Rd6",
    "Rd4",
    "Rd3",
    "Rd2",
    "Rd1",
    "Ra5",
    "Rb5",
    "Rc5",
    "Re5",
    "Rf5",
    "Rg5",
    "Rh5",
  ]);
});

Deno.test("List Valid Moves > Rook > Handles blocks", function () {
  const b = boardLayout({
    h7: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
    e7: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE, true),
    h4: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), [
    "Rh8",
    "Rh6",
    "Rh5",
    "Rf7",
    "Rg7",
  ]);
});

Deno.test("List Valid Moves > Rook > Handles captures", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE, true),
    d5: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Ra7",
    "Rb7",
    "Rc7",
    "Re7",
    "Rf7",
    "Rg7",
    "Rh7",
    "Rd8",
    "Rd6",
    "Rxd5",
  ]);
});
