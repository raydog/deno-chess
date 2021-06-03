import { Color, COLOR_BLACK, COLOR_WHITE } from "../src/datatypes/Color.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { boardLacksMaterial } from "../src/logic/boardLacksMaterial.ts";
import { buildStandardBoard } from "../src/logic/boardLayouts/standard.ts";
import { asserts } from "../testDeps.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("Board Lacks Material > Standard opening", function () {
  const b = buildStandardBoard();
  asserts.assertEquals(boardLacksMaterial(b), false);
});

Deno.test("Board Lacks Material > Just kings", function () {
  const b = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b), true);
});

Deno.test("Board Lacks Material > King vs King + Bishop", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    f5: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), true);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    b3: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), true);
});

Deno.test("Board Lacks Material > King vs King + Knight", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    f5: encodePieceSpace(PieceType.Knight, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), true);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    b3: encodePieceSpace(PieceType.Knight, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), true);
});

Deno.test("Board Lacks Material > King + Bishop vs King + Bishop", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    a3: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true), // << On black
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    f5: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true), // << On white
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    a3: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true), // << On black
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    h4: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true), // << On black
  });
  asserts.assertEquals(boardLacksMaterial(b2), true);

  const b3 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    b3: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true), // << On white
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    g4: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true), // << On white
  });
  asserts.assertEquals(boardLacksMaterial(b3), true);
});

Deno.test("Board Lacks Material > Queens are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Queen, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    d3: encodePieceSpace(PieceType.Queen, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Rooks are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Rook, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    d3: encodePieceSpace(PieceType.Rook, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Pawns are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Pawn, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
    d3: encodePieceSpace(PieceType.Pawn, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Duplicate knights are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Knight, COLOR_WHITE, true),
    d8: encodePieceSpace(PieceType.Knight, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Knight, COLOR_BLACK, true),
    d8: encodePieceSpace(PieceType.Knight, COLOR_BLACK, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Duplicate bishops can be ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    d7: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true),
    d7: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);

  const b3 = boardLayout({
    a2: encodePieceSpace(PieceType.King, COLOR_WHITE, true),
    c7: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true),
    d6: encodePieceSpace(PieceType.Bishop, COLOR_BLACK, true),
    h6: encodePieceSpace(PieceType.Bishop, COLOR_WHITE, true),
    f6: encodePieceSpace(PieceType.King, COLOR_BLACK, true),
  });
  asserts.assertEquals(boardLacksMaterial(b3), true);
});
