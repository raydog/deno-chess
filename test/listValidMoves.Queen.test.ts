import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";

Deno.test("List Valid Moves > Queen > Center movements", function () {
  const b = new Board();
  const idx = coordFromAN("d5");
  b.set(idx, encodePieceSpace(PieceType.Queen, Color.White, false, false));
  assertMoves(b, listValidMoves(b, idx), [
    "a2",
    "a5",
    "a8",
    "b3",
    "b5",
    "b7",
    "c4",
    "c5",
    "c6",
    "d1",
    "d2",
    "d3",
    "d4",
    "d6",
    "d7",
    "d8",
    "e4",
    "e5",
    "e6",
    "f3",
    "f5",
    "f7",
    "g2",
    "g5",
    "g8",
    "h1",
    "h5",
  ]);
});

Deno.test("List Valid Moves > Queen > Handles blocks", function () {
  const b = new Board();
  const idx = coordFromAN("h7");
  b.set(idx, encodePieceSpace(PieceType.Queen, Color.White, false, false));
  b.set(
    coordFromAN("e7"),
    encodePieceSpace(PieceType.King, Color.White, false, false),
  );
  b.set(
    coordFromAN("h4"),
    encodePieceSpace(PieceType.Knight, Color.White, false, false),
  );
  b.set(
    coordFromAN("d3"),
    encodePieceSpace(PieceType.Pawn, Color.White, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "h8",
    "h6",
    "h5",
    "f7",
    "g7",
    "g8",
    "g6",
    "f5",
    "e4",
  ]);
});

Deno.test("List Valid Moves > Queen > Handles captures", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.Queen, Color.White, false, false));
  b.set(
    coordFromAN("d5"),
    encodePieceSpace(PieceType.Pawn, Color.Black, false, false),
  );
  b.set(
    coordFromAN("b7"),
    encodePieceSpace(PieceType.Rook, Color.Black, false, false),
  );
  b.set(
    coordFromAN("e7"),
    encodePieceSpace(PieceType.Queen, Color.Black, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "a4",
    "b5",
    "b7",
    "c6",
    "c7",
    "c8",
    "d5",
    "d6",
    "d8",
    "e6",
    "e7",
    "e8",
    "f5",
    "g4",
    "h3",
  ]);
});
