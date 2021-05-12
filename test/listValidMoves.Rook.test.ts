import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";

Deno.test("List Valid Moves > Rook > Center movements", function () {
  const b = new Board();
  const idx = coordFromAN("d5");
  b.set(idx, encodePieceSpace(PieceType.Rook, Color.White, false, false));
  assertMoves(b, listValidMoves(b, idx), [
    "d8",
    "d7",
    "d6",
    "d4",
    "d3",
    "d2",
    "d1",
    "a5",
    "b5",
    "c5",
    "e5",
    "f5",
    "g5",
    "h5",
  ]);
});

Deno.test("List Valid Moves > Rook > Handles blocks", function () {
  const b = new Board();
  const idx = coordFromAN("h7");
  b.set(idx, encodePieceSpace(PieceType.Rook, Color.White, false, false));
  b.set(
    coordFromAN("e7"),
    encodePieceSpace(PieceType.King, Color.White, false, false),
  );
  b.set(
    coordFromAN("h4"),
    encodePieceSpace(PieceType.Knight, Color.White, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "h8",
    "h6",
    "h5",
    "f7",
    "g7",
  ]);
});

Deno.test("List Valid Moves > Rook > Handles captures", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.Rook, Color.White, false, false));
  b.set(
    coordFromAN("d5"),
    encodePieceSpace(PieceType.Rook, Color.Black, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "a7",
    "b7",
    "c7",
    "e7",
    "f7",
    "g7",
    "h7",
    "d8",
    "d6",
    "d5",
  ]);
});
