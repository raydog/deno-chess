import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";

Deno.test("List Valid Moves > Bishop > Center movements", function () {
  const b = new Board();
  const idx = coordFromAN("d5");
  b.set(idx, encodePieceSpace(PieceType.Bishop, Color.White, false, false));
  assertMoves(b, listValidMoves(b, idx), [
    "c4",
    "b3",
    "a2",
    "c6",
    "b7",
    "a8",
    "e6",
    "f7",
    "g8",
    "e4",
    "f3",
    "g2",
    "h1",
  ]);
});

Deno.test("List Valid Moves > Bishop > Handles blocks", function () {
  const b = new Board();
  const idx = coordFromAN("h3");
  b.set(idx, encodePieceSpace(PieceType.Bishop, Color.White, false, false));
  b.set(
    coordFromAN("f1"),
    encodePieceSpace(PieceType.King, Color.White, false, false),
  );
  b.set(
    coordFromAN("e6"),
    encodePieceSpace(PieceType.Knight, Color.White, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "g2",
    "g4",
    "f5",
  ]);
});

Deno.test("List Valid Moves > Bishop > Handles captures", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.Bishop, Color.White, false, false));
  b.set(
    coordFromAN("f5"),
    encodePieceSpace(PieceType.Rook, Color.Black, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "c8",
    "e8",
    "c6",
    "b5",
    "a4",
    "e6",
    "f5",
  ]);
});
