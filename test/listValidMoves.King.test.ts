import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";

Deno.test("List Valid Moves > King > Center movements", function () {
  const b = new Board();
  const idx = coordFromAN("d5");
  b.set(idx, encodePieceSpace(PieceType.King, Color.White, false, false));
  assertMoves(b, listValidMoves(b, idx), [
    "c4",
    "c5",
    "c6",
    "d4",
    "d6",
    "e4",
    "e5",
    "e6",
  ]);
});

Deno.test("List Valid Moves > King > Handles blocks", function () {
  const b = new Board();
  const idx = coordFromAN("h7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.White, false, false));
  b.set(
    coordFromAN("g8"),
    encodePieceSpace(PieceType.Bishop, Color.White, false, false),
  );
  b.set(
    coordFromAN("f7"),
    encodePieceSpace(PieceType.Knight, Color.White, false, false),
  );
  b.set(
    coordFromAN("h6"),
    encodePieceSpace(PieceType.Pawn, Color.White, false, false),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "h8",
    "g7",
    "g6",
  ]);
});

Deno.test("List Valid Moves > King > Handles captures", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.White, false, false));
  b.set(
    coordFromAN("c7"),
    encodePieceSpace(PieceType.Pawn, Color.Black, false, false),
  );
  b.set(
    coordFromAN("e8"),
    encodePieceSpace(PieceType.Knight, Color.Black, false, false),
  );
  b.set(
    coordFromAN("d6"),
    encodePieceSpace(PieceType.Bishop, Color.Black, false, false),
  );
  // TODO: Some of these moves put the king in check... :X
  assertMoves(b, listValidMoves(b, idx), [
    "c8",
    "d8",
    "e8",
    "c7",
    "e7",
    "c6",
    "d6",
    "e6",
  ]);
});
