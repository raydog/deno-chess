import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Rook > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PieceType.Rook, Color.White, true),
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
    h7: encodePieceSpace(PieceType.Rook, Color.White, true),
    e7: encodePieceSpace(PieceType.King, Color.White, true),
    h4: encodePieceSpace(PieceType.Knight, Color.White, true),
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
    d7: encodePieceSpace(PieceType.Rook, Color.White, true),
    d5: encodePieceSpace(PieceType.Rook, Color.Black, true),
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
