import { boardRenderASCII } from "../src/core/logic/boardRenderASCII.ts";
import { buildChess960 } from "../src/core/logic/boardLayouts/buildChess960.ts";
import { asserts } from "../testDeps.ts";
import { spaceGetType, SPACE_EMPTY } from "../src/core/datatypes/Space.ts";
import { PIECETYPE_BISHOP, PIECETYPE_KING, PIECETYPE_PAWN, PIECETYPE_ROOK } from "../src/core/datatypes/PieceType.ts";

Deno.test("Build Chess960 > Build board matches spec", function () {
  // Do this 10 times, to increase the odds of us finding a Board that fails the spec:
  for (let i=0; i<10; i++) {
    const b = buildChess960();
    let bishopSpots = 0, rookNum =0;
    for (let file=0; file<8; file++) {
      asserts.assert(spaceGetType(b.get(0x10 | file)) === PIECETYPE_PAWN, "Non-pawn on white pawn row");
      asserts.assert(spaceGetType(b.get(0x60 | file)) === PIECETYPE_PAWN, "Non-pawn on black pawn row");

      const whiteIdx = 0x00 | file, blackIdx = 0x70 | file;
      asserts.assert(b.get(whiteIdx) !== SPACE_EMPTY, "Space on white back row is empty");
      asserts.assert(b.get(blackIdx) !== SPACE_EMPTY, "Space on black back row is empty");
      if (spaceGetType(b.get(whiteIdx)) === PIECETYPE_BISHOP) {
        bishopSpots |= 1 << (((whiteIdx >>> 4) ^ whiteIdx) & 1);
      }

      if (spaceGetType(b.get(whiteIdx)) === PIECETYPE_ROOK) {
        rookNum ++;
      }
      
      if (spaceGetType(b.get(whiteIdx)) === PIECETYPE_KING) {
        asserts.assert(rookNum === 1, `There were ${rookNum} rooks to the left of the King`);
      }
    }
    asserts.assert(bishopSpots === 3, "Didn't have bishops on opposite colors");
    asserts.assert(rookNum === 2, "Didn't have 1 rook to the right of the King");
  }
});

Deno.test("Build Chess960 > Create many boards", function () {
  // This makes sure I didn't have a math error that causes placeAt to overrun:
  for (let i=0; i<1000; i++) {
    buildChess960();
  }
});
