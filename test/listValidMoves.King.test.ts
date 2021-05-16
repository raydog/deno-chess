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
  b.set(idx, encodePieceSpace(PieceType.King, Color.White));
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
  b.set(idx, encodePieceSpace(PieceType.King, Color.White));
  b.set(
    coordFromAN("g8"),
    encodePieceSpace(PieceType.Bishop, Color.White),
  );
  b.set(
    coordFromAN("f7"),
    encodePieceSpace(PieceType.Knight, Color.White),
  );
  b.set(
    coordFromAN("h6"),
    encodePieceSpace(PieceType.Pawn, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "h8",
    "g7",
    "g6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by pawn", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.Black));
  b.set(
    coordFromAN("d5"),
    encodePieceSpace(PieceType.Pawn, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "c8", "d8", "e8", "c7", "e7", "d6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by bishop", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.Black));
  b.set(
    coordFromAN("f7"),
    encodePieceSpace(PieceType.Bishop, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "c8", "d8", "c7", "e7", "c6", "d6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by knight", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.Black));
  b.set(
    coordFromAN("f5"),
    encodePieceSpace(PieceType.Knight, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "c8", "d8", "e8", "c7", "c6", "e6"
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by rook", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.White));
  b.set(
    coordFromAN("e2"),
    encodePieceSpace(PieceType.Rook, Color.Black),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "c8", "d8", "c7", "c6", "d6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by queen", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.Black));
  b.set(
    coordFromAN("d5"),
    encodePieceSpace(PieceType.Queen, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "c8","e8", "c7", "e7",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by king", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.Black));
  b.set(
    coordFromAN("b7"),
    encodePieceSpace(PieceType.King, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "d8","e8", "e7", "d6", "e6"
  ]);
});


Deno.test("List Valid Moves > King > Allows safe captures", function () {
  const b = new Board();
  const idx = coordFromAN("d7");
  b.set(idx, encodePieceSpace(PieceType.King, Color.White));
  b.set(
    coordFromAN("c7"),
    encodePieceSpace(PieceType.Pawn, Color.Black),
  );
  b.set(
    coordFromAN("e6"),
    encodePieceSpace(PieceType.Knight, Color.Black),
  );
  b.set(
    coordFromAN("d6"),
    encodePieceSpace(PieceType.Bishop, Color.Black),
  );
  assertMoves(b, listValidMoves(b, idx), [
    "c8",
    "e8",
    "c6",
    "e6",
  ]);
});

