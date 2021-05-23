import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { listValidMoves } from "../src/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Queen > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PieceType.Queen, Color.White),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d5")), [
    "Qa2",
    "Qa5",
    "Qa8",
    "Qb3",
    "Qb5",
    "Qb7",
    "Qc4",
    "Qc5",
    "Qc6",
    "Qd1",
    "Qd2",
    "Qd3",
    "Qd4",
    "Qd6",
    "Qd7",
    "Qd8",
    "Qe4",
    "Qe5",
    "Qe6",
    "Qf3",
    "Qf5",
    "Qf7",
    "Qg2",
    "Qg5",
    "Qg8",
    "Qh1",
    "Qh5",
  ]);
});

Deno.test("List Valid Moves > Queen > Handles blocks", function () {
  const b = boardLayout({
    h7: encodePieceSpace(PieceType.Queen, Color.White),
    e7: encodePieceSpace(PieceType.King, Color.White),
    h4: encodePieceSpace(PieceType.Knight, Color.White),
    d3: encodePieceSpace(PieceType.Pawn, Color.White),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("h7")), [
    "Qh8",
    "Qh6",
    "Qh5",
    "Qf7",
    "Qg7",
    "Qg8",
    "Qg6",
    "Qf5",
    "Qe4",
  ]);
});

Deno.test("List Valid Moves > Queen > Handles captures", function () {
  const b = boardLayout({
    d7: encodePieceSpace(PieceType.Queen, Color.White),
    d5: encodePieceSpace(PieceType.Pawn, Color.Black),
    b7: encodePieceSpace(PieceType.Rook, Color.Black),
    e7: encodePieceSpace(PieceType.Queen, Color.Black),
  });
  assertMoves(b, listValidMoves(b, coordFromAN("d7")), [
    "Qa4",
    "Qb5",
    "Qxb7",
    "Qc6",
    "Qc7",
    "Qc8",
    "Qxd5",
    "Qd6",
    "Qd8",
    "Qe6",
    "Qxe7",
    "Qe8",
    "Qf5",
    "Qg4",
    "Qh3",
  ]);
});
