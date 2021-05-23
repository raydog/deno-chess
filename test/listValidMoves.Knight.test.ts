import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Knight > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PieceType.Knight, Color.White),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d5")), [
    "Nb4",
    "Nb6",
    "Nc3",
    "Nc7",
    "Ne3",
    "Ne7",
    "Nf4",
    "Nf6",
  ]);
});

Deno.test("List Valid Moves > Knight > Handles blocks", function () {
  const b = boardLayout({
    h7: encodePieceSpace(PieceType.Knight, Color.White),
    f8: encodePieceSpace(PieceType.Bishop, Color.White),
    g5: encodePieceSpace(PieceType.Pawn, Color.White),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), [
    "Nf6",
  ]);
});

Deno.test("List Valid Moves > Knight > Handles captures", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.Knight, Color.White),
    b6: encodePieceSpace(PieceType.Pawn, Color.Black),
    f8: encodePieceSpace(PieceType.Knight, Color.Black),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Nxb6",
    "Nb8",
    "Nc5",
    "Ne5",
    "Nf6",
    "Nxf8",
  ]);
});

Deno.test("List Valid Moves > Knight > Blocks check", function () {
  const b = boardLayout({
    f1: encodePieceSpace(PieceType.King, Color.White, true),
    f6: encodePieceSpace(PieceType.Queen, Color.Black, true),
    g1: encodePieceSpace(PieceType.Knight, Color.White),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("g1")), [
    "Nf3",
  ]);
});
