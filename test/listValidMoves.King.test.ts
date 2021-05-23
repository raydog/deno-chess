import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > King > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PieceType.King, Color.White, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d5")), [
    "Kc4",
    "Kc5",
    "Kc6",
    "Kd4",
    "Kd6",
    "Ke4",
    "Ke5",
    "Ke6",
  ]);
});

Deno.test("List Valid Moves > King > Handles blocks", function () {
  const b = boardLayout({
    h7: encodePieceSpace(PieceType.King, Color.White, true),
    g8: encodePieceSpace(PieceType.Bishop, Color.White, true),
    f7: encodePieceSpace(PieceType.Knight, Color.White, true),
    h6: encodePieceSpace(PieceType.Pawn, Color.White, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), [
    "Kh8",
    "Kg7",
    "Kg6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by pawn", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, Color.Black, true),
    d5: encodePieceSpace(PieceType.Pawn, Color.White, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Ke8",
    "Kc7",
    "Ke7",
    "Kd6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by bishop", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, Color.Black, true),
    f7: encodePieceSpace(PieceType.Bishop, Color.White, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Kc7",
    "Ke7",
    "Kc6",
    "Kd6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by knight", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, Color.Black, true),
    f5: encodePieceSpace(PieceType.Knight, Color.White, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Ke8",
    "Kc7",
    "Kc6",
    "Ke6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by rook", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, Color.White, true),
    e2: encodePieceSpace(PieceType.Rook, Color.Black, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Kd8",
    "Kc7",
    "Kc6",
    "Kd6",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by queen", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, Color.Black, true),
    d5: encodePieceSpace(PieceType.Queen, Color.White, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Ke8",
    "Kc7",
    "Ke7",
  ]);
});

Deno.test("List Valid Moves > King > Avoids check by king", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, Color.Black, true),
    b7: encodePieceSpace(PieceType.King, Color.White, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kd8",
    "Ke8",
    "Ke7",
    "Kd6",
    "Ke6",
  ]);
});

Deno.test("List Valid Moves > King > Allows safe captures", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Pawn, Color.Black, true),
    e6: encodePieceSpace(PieceType.Knight, Color.Black, true),
    d6: encodePieceSpace(PieceType.Bishop, Color.Black, true),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Kc8",
    "Ke8",
    "Kc6",
    "Kxe6",
  ]);
});
