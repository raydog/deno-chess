import { Color } from "../src/datatypes/Color.ts";
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
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b), true);
});

Deno.test("Board Lacks Material > King vs King + Bishop", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    f5: encodePieceSpace(PieceType.Bishop, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), true);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    b3: encodePieceSpace(PieceType.Bishop, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), true);
});

Deno.test("Board Lacks Material > King vs King + Knight", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    f5: encodePieceSpace(PieceType.Knight, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), true);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    b3: encodePieceSpace(PieceType.Knight, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), true);
});

Deno.test("Board Lacks Material > King + Bishop vs King + Bishop", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    a3: encodePieceSpace(PieceType.Bishop, Color.White, true), // << On black
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    f5: encodePieceSpace(PieceType.Bishop, Color.Black, true), // << On white
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    a3: encodePieceSpace(PieceType.Bishop, Color.White, true), // << On black
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    h4: encodePieceSpace(PieceType.Bishop, Color.Black, true), // << On black
  });
  asserts.assertEquals(boardLacksMaterial(b2), true);

  const b3 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    b3: encodePieceSpace(PieceType.Bishop, Color.White, true), // << On white
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    g4: encodePieceSpace(PieceType.Bishop, Color.Black, true), // << On white
  });
  asserts.assertEquals(boardLacksMaterial(b3), true);
});

Deno.test("Board Lacks Material > Queens are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Queen, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    d3: encodePieceSpace(PieceType.Queen, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Rooks are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Rook, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    d3: encodePieceSpace(PieceType.Rook, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Pawns are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Pawn, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
    d3: encodePieceSpace(PieceType.Pawn, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Duplicate knights are ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Knight, Color.White, true),
    d8: encodePieceSpace(PieceType.Knight, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Knight, Color.Black, true),
    d8: encodePieceSpace(PieceType.Knight, Color.Black, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);
});

Deno.test("Board Lacks Material > Duplicate bishops can be ok", function () {
  const b1 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Bishop, Color.White, true),
    d7: encodePieceSpace(PieceType.Bishop, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b1), false);

  const b2 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Bishop, Color.Black, true),
    d7: encodePieceSpace(PieceType.Bishop, Color.Black, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b2), false);

  const b3 = boardLayout({
    a2: encodePieceSpace(PieceType.King, Color.White, true),
    c7: encodePieceSpace(PieceType.Bishop, Color.Black, true),
    d6: encodePieceSpace(PieceType.Bishop, Color.Black, true),
    h6: encodePieceSpace(PieceType.Bishop, Color.White, true),
    f6: encodePieceSpace(PieceType.King, Color.Black, true),
  });
  asserts.assertEquals(boardLacksMaterial(b3), true);
});
