import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";

Deno.test("List Valid Moves > Knight > Center movements", function () {
  const b = new Board();
  const idx = coordFromAN("d5");
  b.set(idx, encodePieceSpace(PieceType.Knight, Color.White, false, false));
  assertMoves(b, listValidMoves(b, idx), [
    "b4",
    "b6",
    "c3",
    "c7",
    "e3",
    "e7",
    "f4",
    "f6",
  ]);
});

Deno.test("List Valid Moves > Knight > Handles blocks", function () {
  const b = new Board();
  const idx = coordFromAN("h7");
  b.set(idx, encodePieceSpace(PieceType.Knight, Color.White, false, false));
  b.set(
    coordFromAN("f8"),
    encodePieceSpace(PieceType.Bishop, Color.White, false, false),
  );
  b.set(
    coordFromAN("g5"),
    encodePieceSpace(PieceType.Pawn, Color.White, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "f6",
  ]);
});

Deno.test("List Valid Moves > Knight > Handles captures", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.Knight, Color.White, false, false));
  b.set(
    coordFromAN("b6"),
    encodePieceSpace(PieceType.Pawn, Color.Black, false, false),
  );
  b.set(
    coordFromAN("f8"),
    encodePieceSpace(PieceType.Knight, Color.Black, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "b6",
    "b8",
    "c5",
    "e5",
    "f6",
    "f8",
  ]);
});
