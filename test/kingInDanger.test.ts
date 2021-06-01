import { Color } from "../src/datatypes/Color.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { kingInDanger } from "../src/logic/kingInDanger.ts";
import { asserts } from "../testDeps.ts";
import { boardLayout } from "./testUtils/boardLayout.ts";

Deno.test("King In Danger > Pawn > Attack", function () {
  for (const pawn of ["b7", "d7"]) {
    const b = boardLayout({
      c8: encodePieceSpace(PieceType.King, Color.Black, true),
      [pawn]: encodePieceSpace(PieceType.Pawn, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Pawn > Neutral", function () {
  const b = boardLayout({
    c8: encodePieceSpace(PieceType.King, Color.Black, true),
    c7: encodePieceSpace(PieceType.Pawn, Color.White, true),
  });
  asserts.assertEquals(kingInDanger(b, Color.Black), false);
});

Deno.test("King In Danger > Bishop > Attack", function () {
  for (const bishop of ["g1", "c3", "b6", "h8"]) {
    const b = boardLayout({
      d4: encodePieceSpace(PieceType.King, Color.Black, true),
      [bishop]: encodePieceSpace(PieceType.Bishop, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Bishop > Blocked", function () {
  const b1 = boardLayout({
    d4: encodePieceSpace(PieceType.King, Color.Black, true),
    g1: encodePieceSpace(PieceType.Bishop, Color.White, true),
    f2: encodePieceSpace(PieceType.Pawn, Color.White, true),
  });
  asserts.assertEquals(kingInDanger(b1, Color.Black), false);

  const b2 = boardLayout({
    d4: encodePieceSpace(PieceType.King, Color.Black, true),
    b2: encodePieceSpace(PieceType.Bishop, Color.White, true),
    c3: encodePieceSpace(PieceType.Rook, Color.Black, true),
  });
  asserts.assertEquals(kingInDanger(b2, Color.Black), false);
});

Deno.test("King In Danger > Bishop > Neutral", function () {
  const b = boardLayout({
    d4: encodePieceSpace(PieceType.King, Color.Black, true),
    h5: encodePieceSpace(PieceType.Bishop, Color.White, true),
  });
  asserts.assertEquals(kingInDanger(b, Color.Black), false);
});

Deno.test("King In Danger > Knight > Attack", function () {
  for (const knight of ["c6", "e6", "f5", "f3", "e2", "c2", "b3", "b5"]) {
    const b = boardLayout({
      d4: encodePieceSpace(PieceType.King, Color.Black, true),
      [knight]: encodePieceSpace(PieceType.Knight, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Knight > Neutral", function () {
  const b = boardLayout({
    d4: encodePieceSpace(PieceType.King, Color.Black, true),
    e5: encodePieceSpace(PieceType.Knight, Color.White, true),
  });
  asserts.assertEquals(kingInDanger(b, Color.Black), false);
});

Deno.test("King In Danger > Rook > Attack", function () {
  for (const rook of ["d2", "c4", "d8", "g4"]) {
    const b = boardLayout({
      d4: encodePieceSpace(PieceType.King, Color.Black, true),
      [rook]: encodePieceSpace(PieceType.Rook, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Rook > Blocked", function () {
  for (const rook of ["d1", "b4", "d8", "g4"]) {
    const b = boardLayout({
      d4: encodePieceSpace(PieceType.King, Color.Black, true),
      c4: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      e4: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      d3: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      d5: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      [rook]: encodePieceSpace(PieceType.Rook, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), false);
  }
});

Deno.test("King In Danger > Rook > Neutral", function () {
  const b = boardLayout({
    d4: encodePieceSpace(PieceType.King, Color.Black, true),
    e5: encodePieceSpace(PieceType.Rook, Color.White, true),
  });
  asserts.assertEquals(kingInDanger(b, Color.Black), false);
});

Deno.test("King In Danger > Queen > Attack", function () {
  for (const queen of ["d5", "h8", "h4", "g1", "d3", "c3", "a4", "a7"]) {
    const b = boardLayout({
      d4: encodePieceSpace(PieceType.King, Color.Black, true),
      [queen]: encodePieceSpace(PieceType.Queen, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Queen > Blocked", function () {
  for (const queen of ["d6", "h8", "h4", "g1", "d2", "b2", "a4", "a7"]) {
    const b = boardLayout({
      d4: encodePieceSpace(PieceType.King, Color.Black, true),
      d5: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      d3: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      c4: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      e4: encodePieceSpace(PieceType.Pawn, Color.Black, true),
      c5: encodePieceSpace(PieceType.Knight, Color.White, true),
      e5: encodePieceSpace(PieceType.Knight, Color.White, true),
      c3: encodePieceSpace(PieceType.Knight, Color.White, true),
      e3: encodePieceSpace(PieceType.Knight, Color.White, true),
      [queen]: encodePieceSpace(PieceType.Queen, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), false);
  }
});

Deno.test("King In Danger > Queen > Neutral", function () {
  const b = boardLayout({
    d4: encodePieceSpace(PieceType.King, Color.Black, true),
    f3: encodePieceSpace(PieceType.Queen, Color.White, true),
  });
  asserts.assertEquals(kingInDanger(b, Color.Black), false);
});

Deno.test("King In Danger > King > Attack", function () {
  for (const king of ["d5", "d3", "c4", "e4", "c5", "e5", "c3", "e3"]) {
    const b = boardLayout({
      d4: encodePieceSpace(PieceType.King, Color.Black, true),
      [king]: encodePieceSpace(PieceType.King, Color.White, true),
    });
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > King > Neutral", function () {
  const b = boardLayout({
    d4: encodePieceSpace(PieceType.King, Color.Black, true),
    f3: encodePieceSpace(PieceType.King, Color.White, true),
  });
  asserts.assertEquals(kingInDanger(b, Color.Black), false);
});
