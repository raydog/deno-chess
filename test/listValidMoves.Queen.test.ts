import { COLOR_BLACK, COLOR_WHITE } from "../src/core/datatypes/Color.ts";
import { coordFromAN } from "../src/core/datatypes/Coord.ts";
import {
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/core/datatypes/Space.ts";
import { listValidMoves } from "../src/core/logic/listValidMoves.ts";
import { assertMoves } from "./testUtils/assertMoves.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("List Valid Moves > Queen > Center movements", function () {
  const b = boardLayout({
    d5: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE),
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
    h7: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE),
    e7: encodePieceSpace(PIECETYPE_KING, COLOR_WHITE),
    h4: encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE),
    d3: encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE),
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
    d7: encodePieceSpace(PIECETYPE_QUEEN, COLOR_WHITE),
    d5: encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK),
    b7: encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK),
    e7: encodePieceSpace(PIECETYPE_QUEEN, COLOR_BLACK),
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
