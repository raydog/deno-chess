import { Board } from "../src/datatypes/Board.ts";
import { Color } from "../src/datatypes/Color.ts";
import { coordFromAN } from "../src/datatypes/Coord.ts";
import { PieceType } from "../src/datatypes/PieceType.ts";
import { encodePieceSpace } from "../src/datatypes/Space.ts";
import { kingInDanger } from "../src/logic/kingInDanger.ts";
import { asserts } from "../testDeps.ts";

Deno.test("King In Danger > Pawn > Attack", function () {
  for (const pawnPos of ["b7", "d7"]) {
    const b = new Board();
    b.set(
      coordFromAN("c8"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN(pawnPos),
      encodePieceSpace(PieceType.Pawn, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Pawn > Neutral", function () {
  const b = new Board();
  b.set(
    coordFromAN("c8"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b.set(
    coordFromAN("c7"),
    encodePieceSpace(PieceType.Pawn, Color.White, false, true),
  );
  asserts.assertEquals(kingInDanger(b, Color.Black), false);
});

Deno.test("King In Danger > Bishop > Attack", function () {
  for (const bishopPos of ["g1", "c3", "b6", "h8"]) {
    const b = new Board();
    b.set(
      coordFromAN("d4"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN(bishopPos),
      encodePieceSpace(PieceType.Bishop, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Bishop > Blocked", function () {
  const b1 = new Board();
  b1.set(
    coordFromAN("d4"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b1.set(
    coordFromAN("g1"),
    encodePieceSpace(PieceType.Bishop, Color.White, false, true),
  );
  b1.set(
    coordFromAN("f2"),
    encodePieceSpace(PieceType.Pawn, Color.White, false, true),
  );
  asserts.assertEquals(kingInDanger(b1, Color.Black), false);

  const b2 = new Board();
  b2.set(
    coordFromAN("d4"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b2.set(
    coordFromAN("b2"),
    encodePieceSpace(PieceType.Bishop, Color.White, false, true),
  );
  b2.set(
    coordFromAN("c3"),
    encodePieceSpace(PieceType.Rook, Color.Black, false, true),
  );
  asserts.assertEquals(kingInDanger(b2, Color.Black), false);
});

Deno.test("King In Danger > Bishop > Neutral", function () {
  const b1 = new Board();
  b1.set(
    coordFromAN("d4"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b1.set(
    coordFromAN("h5"),
    encodePieceSpace(PieceType.Bishop, Color.White, false, true),
  );
  asserts.assertEquals(kingInDanger(b1, Color.Black), false);
});

Deno.test("King In Danger > Knight > Attack", function () {
  for (const knightPos of ["c6", "e6", "f5", "f3", "e2", "c2", "b3", "b5"]) {
    const b = new Board();
    b.set(
      coordFromAN("d4"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN(knightPos),
      encodePieceSpace(PieceType.Knight, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Knight > Neutral", function () {
  const b1 = new Board();
  b1.set(
    coordFromAN("d4"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b1.set(
    coordFromAN("e5"),
    encodePieceSpace(PieceType.Knight, Color.White, false, true),
  );
  asserts.assertEquals(kingInDanger(b1, Color.Black), false);
});

Deno.test("King In Danger > Rook > Attack", function () {
  for (const rookPos of ["d2", "c4", "d8", "g4"]) {
    const b = new Board();
    b.set(
      coordFromAN("d4"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN(rookPos),
      encodePieceSpace(PieceType.Rook, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Rook > Blocked", function () {
  for (const rookPos of ["d1", "b4", "d8", "g4"]) {
    const b = new Board();
    b.set(
      coordFromAN("d4"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN("c4"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN("e4"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN("d3"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN("d5"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN(rookPos),
      encodePieceSpace(PieceType.Rook, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), false);
  }
});

Deno.test("King In Danger > Rook > Neutral", function () {
  const b1 = new Board();
  b1.set(
    coordFromAN("d4"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b1.set(
    coordFromAN("e5"),
    encodePieceSpace(PieceType.Rook, Color.White, false, true),
  );
  asserts.assertEquals(kingInDanger(b1, Color.Black), false);
});

Deno.test("King In Danger > Queen > Attack", function () {
  for (const queenPos of ["d5", "h8", "h4", "g1", "d3", "c3", "a4", "a7"]) {
    const b = new Board();
    b.set(
      coordFromAN("d4"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN(queenPos),
      encodePieceSpace(PieceType.Queen, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > Queen > Blocked", function () {
  for (const queenPos of ["d6", "h8", "h4", "g1", "d2", "b2", "a4", "a7"]) {
    const b = new Board();
    b.set(
      coordFromAN("d4"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN("d5"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN("d3"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN("c4"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN("e4"),
      encodePieceSpace(PieceType.Pawn, Color.Black, false, true),
    );
    b.set(
      coordFromAN("c5"),
      encodePieceSpace(PieceType.Knight, Color.White, false, true),
    );
    b.set(
      coordFromAN("e5"),
      encodePieceSpace(PieceType.Knight, Color.White, false, true),
    );
    b.set(
      coordFromAN("c3"),
      encodePieceSpace(PieceType.Knight, Color.White, false, true),
    );
    b.set(
      coordFromAN("e3"),
      encodePieceSpace(PieceType.Knight, Color.White, false, true),
    );
    b.set(
      coordFromAN(queenPos),
      encodePieceSpace(PieceType.Queen, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), false);
  }
});

Deno.test("King In Danger > Queen > Neutral", function () {
  const b1 = new Board();
  b1.set(
    coordFromAN("d4"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b1.set(
    coordFromAN("f3"),
    encodePieceSpace(PieceType.Queen, Color.White, false, true),
  );
  asserts.assertEquals(kingInDanger(b1, Color.Black), false);
});

Deno.test("King In Danger > King > Attack", function () {
  for (const kingPos of ["d5", "d3", "c4", "e4", "c5", "e5", "c3", "e3"]) {
    const b = new Board();
    b.set(
      coordFromAN("d4"),
      encodePieceSpace(PieceType.King, Color.Black, false, true),
    );
    b.set(
      coordFromAN(kingPos),
      encodePieceSpace(PieceType.King, Color.White, false, true),
    );
    asserts.assertEquals(kingInDanger(b, Color.Black), true);
  }
});

Deno.test("King In Danger > King > Neutral", function () {
  const b1 = new Board();
  b1.set(
    coordFromAN("d4"),
    encodePieceSpace(PieceType.King, Color.Black, false, true),
  );
  b1.set(
    coordFromAN("f3"),
    encodePieceSpace(PieceType.King, Color.White, false, true),
  );
  asserts.assertEquals(kingInDanger(b1, Color.Black), false);
});
