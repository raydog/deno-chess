import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardFill } from "./testUtils/boardFill.ts";

Deno.test("List Valid Moves > Pawn > White opening", function () {
  const b = new Board();
  const idx = coordFromAN("c2");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White));
  assertMoves(b, listValidMoves(b, idx), ["c3", "c4"]);
});

Deno.test("List Valid Moves > Pawn > Black opening", function () {
  const b = new Board();
  const idx = coordFromAN("f7");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black));
  assertMoves(b, listValidMoves(b, idx), ["f6", "f5"]);
});

Deno.test("List Valid Moves > Pawn > White basic move", function () {
  const b = new Board();
  const idx = coordFromAN("d6");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White, true));
  assertMoves(b, listValidMoves(b, idx), ["d7"]);
});

Deno.test("List Valid Moves > Pawn > Black basic move", function () {
  const b = new Board();
  const idx = coordFromAN("b2");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black, true));
  assertMoves(b, listValidMoves(b, idx), ["b1"]);
});

Deno.test("List Valid Moves > Pawn > White blocked by white", function () {
  const b = new Board();
  const idx = coordFromAN("e4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White, true));
  b.set(
    coordFromAN("e5"),
    encodePieceSpace(PieceType.Queen, Color.White, true),
  );
  assertMoves(b, listValidMoves(b, idx), []);
});

Deno.test("List Valid Moves > Pawn > White blocked by black", function () {
  const b = new Board();
  const idx = coordFromAN("e4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White, true));
  b.set(
    coordFromAN("e5"),
    encodePieceSpace(PieceType.Knight, Color.Black, true),
  );
  assertMoves(b, listValidMoves(b, idx), []);
});

Deno.test("List Valid Moves > Pawn > Black blocked by white", function () {
  const b = new Board();
  const idx = coordFromAN("b3");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black, true));
  b.set(
    coordFromAN("b2"),
    encodePieceSpace(PieceType.Queen, Color.White, true),
  );
  assertMoves(b, listValidMoves(b, idx), []);
});

Deno.test("List Valid Moves > Pawn > Black blocked by black", function () {
  const b = new Board();
  const idx = coordFromAN("b3");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black, true));
  b.set(
    coordFromAN("b2"),
    encodePieceSpace(PieceType.Knight, Color.Black, true),
  );
  assertMoves(b, listValidMoves(b, idx), []);
});

Deno.test("List Valid Moves > Pawn > White opening capture left", function () {
  const b = new Board();
  const idx = coordFromAN("h2");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White));
  b.set(
    coordFromAN("g3"),
    encodePieceSpace(PieceType.Bishop, Color.Black, true),
  );
  assertMoves(b, listValidMoves(b, idx), ["h3", "h4", "g3"]);
});

Deno.test("List Valid Moves > Pawn > White opening capture right", function () {
  const b = new Board();
  const idx = coordFromAN("a2");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White));
  b.set(
    coordFromAN("b3"),
    encodePieceSpace(PieceType.Rook, Color.Black, true),
  );
  assertMoves(b, listValidMoves(b, idx), ["a3", "a4", "b3"]);
});

Deno.test("List Valid Moves > Pawn > White opening capture both", function () {
  const b = new Board();
  const idx = coordFromAN("c2");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White));
  b.set(
    coordFromAN("b3"),
    encodePieceSpace(PieceType.Rook, Color.Black, true),
  );
  b.set(
    coordFromAN("d3"),
    encodePieceSpace(PieceType.Rook, Color.Black, true),
  );
  assertMoves(b, listValidMoves(b, idx), ["c3", "c4", "b3", "d3"]);
});

Deno.test("List Valid Moves > Pawn > Black opening capture left", function () {
  const b = new Board();
  const idx = coordFromAN("h7");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black));
  b.set(
    coordFromAN("g6"),
    encodePieceSpace(PieceType.Bishop, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), ["h6", "h5", "g6"]);
});

Deno.test("List Valid Moves > Pawn > Black opening capture right", function () {
  const b = new Board();
  const idx = coordFromAN("a7");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black));
  b.set(
    coordFromAN("b6"),
    encodePieceSpace(PieceType.Rook, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), ["a6", "a5", "b6"]);
});

Deno.test("List Valid Moves > Pawn > Black opening capture both", function () {
  const b = new Board();
  const idx = coordFromAN("c7");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black));
  b.set(
    coordFromAN("b6"),
    encodePieceSpace(PieceType.Rook, Color.White),
  );
  b.set(
    coordFromAN("d6"),
    encodePieceSpace(PieceType.Rook, Color.White),
  );
  assertMoves(b, listValidMoves(b, idx), ["c6", "c5", "b6", "d6"]);
});

Deno.test("List Valid Moves > Pawn > White middle captures in filled board", function () {
  const b = new Board();
  boardFill(b, encodePieceSpace(PieceType.Queen, Color.Black));
  const idx = coordFromAN("c4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White));
  assertMoves(b, listValidMoves(b, idx), ["b5", "d5"]);
});

Deno.test("List Valid Moves > Pawn > White left captures in filled board", function () {
  const b = new Board();
  boardFill(b, encodePieceSpace(PieceType.Queen, Color.Black));
  const idx = coordFromAN("a4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White));
  assertMoves(b, listValidMoves(b, idx), ["b5"]);
});

Deno.test("List Valid Moves > Pawn > White right captures in filled board", function () {
  const b = new Board();
  boardFill(b, encodePieceSpace(PieceType.Queen, Color.Black));
  const idx = coordFromAN("h4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White));
  assertMoves(b, listValidMoves(b, idx), ["g5"]);
});

Deno.test("List Valid Moves > Pawn > Black middle captures in filled board", function () {
  const b = new Board();
  boardFill(b, encodePieceSpace(PieceType.Queen, Color.White));
  const idx = coordFromAN("c4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black));
  assertMoves(b, listValidMoves(b, idx), ["b3", "d3"]);
});

Deno.test("List Valid Moves > Pawn > Black left captures in filled board", function () {
  const b = new Board();
  boardFill(b, encodePieceSpace(PieceType.Queen, Color.White));
  const idx = coordFromAN("a4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black));
  assertMoves(b, listValidMoves(b, idx), ["b3"]);
});

Deno.test("List Valid Moves > Pawn > Black right captures in filled board", function () {
  const b = new Board();
  boardFill(b, encodePieceSpace(PieceType.Queen, Color.White));
  const idx = coordFromAN("h4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black));
  assertMoves(b, listValidMoves(b, idx), ["g3"]);
});

Deno.test("List Valid Moves > Pawn > White captures en passant on the left", function () {
  const b = new Board();
  const idx = coordFromAN("e5");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White, true));
  b.set(coordFromAN("d5"), encodePieceSpace(PieceType.Pawn, Color.Black, true, true));
  assertMoves(b, listValidMoves(b, idx), ["d6", "e6"]);
});

Deno.test("List Valid Moves > Pawn > White captures en passant on the right", function () {
  const b = new Board();
  const idx = coordFromAN("e5");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.White, true));
  b.set(coordFromAN("f5"), encodePieceSpace(PieceType.Pawn, Color.Black, true, true));
  assertMoves(b, listValidMoves(b, idx), ["e6", "f6"]);
});

Deno.test("List Valid Moves > Pawn > Black captures en passant on the left", function () {
  const b = new Board();
  const idx = coordFromAN("e4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black, true));
  b.set(coordFromAN("d4"), encodePieceSpace(PieceType.Pawn, Color.White, true, true));
  assertMoves(b, listValidMoves(b, idx), ["d3", "e3"]);
});

Deno.test("List Valid Moves > Pawn > Black captures en passant on the right", function () {
  const b = new Board();
  const idx = coordFromAN("e4");
  b.set(idx, encodePieceSpace(PieceType.Pawn, Color.Black, true));
  b.set(coordFromAN("f4"), encodePieceSpace(PieceType.Pawn, Color.White, true, true));
  assertMoves(b, listValidMoves(b, idx), ["e3", "f3"]);
});
