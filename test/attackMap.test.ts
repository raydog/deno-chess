import { Board } from "../src/core/datatypes/Board.ts";
import { COLOR_BLACK, COLOR_WHITE } from "../src/core/datatypes/Color.ts";
import {
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import { encodePieceSpace, SPACE_EMPTY } from "../src/core/datatypes/Space.ts";
import { attackMapDebug } from "../src/core/logic/attackMap.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Attack Map > Single Pawn", function () {
  const b = new Board();
  b.set(0x15, encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE));
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   1,0   0,0   1,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0  [0,0]  0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
    ],
  );
});

Deno.test("Attack Map > Multi Pawn", function () {
  const b = new Board();
  b.set(0x15, encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE));
  b.set(0x13, encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE));
  b.set(0x46, encodePieceSpace(PIECETYPE_PAWN, COLOR_WHITE));
  b.set(0x60, encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK));
  b.set(0x62, encodePieceSpace(PIECETYPE_PAWN, COLOR_BLACK));
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      "[0,0]  0,0  [0,0]  0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,2   0,0   0,1   0,0   1,0   0,0   1,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0  [0,0]  0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   1,0   0,0   2,0   0,0   1,0   0,0 ",
      " 0,0   0,0   0,0  [0,0]  0,0  [0,0]  0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
    ],
  );
});

Deno.test("Attack Map > Single Knight", function () {
  const b = new Board();
  b.set(0x34, encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE));
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   1,0   0,0   1,0   0,0   0,0 ",
      " 0,0   0,0   1,0   0,0   0,0   0,0   1,0   0,0 ",
      " 0,0   0,0   0,0   0,0  [0,0]  0,0   0,0   0,0 ",
      " 0,0   0,0   1,0   0,0   0,0   0,0   1,0   0,0 ",
      " 0,0   0,0   0,0   1,0   0,0   1,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
    ],
  );
});

Deno.test("Attack Map > Multi Knight", function () {
  const b = new Board();
  b.set(0x34, encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE));
  b.set(0x21, encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE));
  b.set(0x42, encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE));
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   1,0   0,0   1,0   0,0   0,0   0,0   0,0 ",
      " 1,0   0,0   0,0   1,0   1,0   1,0   0,0   0,0 ",
      " 1,0   0,0  [2,0]  0,0   0,0   0,0   1,0   0,0 ",
      " 1,0   0,0   0,0   1,0  [1,0]  0,0   0,0   0,0 ",
      " 0,0  [1,0]  1,0   1,0   0,0   0,0   1,0   0,0 ",
      " 0,0   0,0   0,0   2,0   0,0   1,0   0,0   0,0 ",
      " 1,0   0,0   1,0   0,0   0,0   0,0   0,0   0,0 ",
    ],
  );
});

Deno.test("Attack Map > Knight removal", function () {
  const b = new Board();
  b.set(0x34, encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE));
  b.set(0x21, encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE));
  b.set(0x42, encodePieceSpace(PIECETYPE_KNIGHT, COLOR_WHITE));
  b.set(0x42, SPACE_EMPTY);
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   1,0   0,0   1,0   0,0   0,0 ",
      " 1,0   0,0   2,0   0,0   0,0   0,0   1,0   0,0 ",
      " 0,0   0,0   0,0   1,0  [0,0]  0,0   0,0   0,0 ",
      " 0,0  [0,0]  1,0   0,0   0,0   0,0   1,0   0,0 ",
      " 0,0   0,0   0,0   2,0   0,0   1,0   0,0   0,0 ",
      " 1,0   0,0   1,0   0,0   0,0   0,0   0,0   0,0 ",
    ],
  );
});

Deno.test("Attack Map > Single Rook", function () {
  const b = new Board();
  b.set(0x34, encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE));
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,0   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 1,0   1,0   1,0   1,0  [0,0]  1,0   1,0   1,0 ",
      " 0,0   0,0   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,0   0,0   0,0   1,0   0,0   0,0   0,0 ",
    ],
  );
});

Deno.test("Attack Map > Blocking Rooks", function () {
  const b = new Board();
  b.set(0x34, encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE));
  b.set(0x31, encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK));
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,1   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,1  [1,0]  1,1   1,1  [0,1]  1,0   1,0   1,0 ",
      " 0,0   0,1   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   1,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   1,0   0,0   0,0   0,0 ",
    ],
  );
});

Deno.test("Attack Map > Removing Rooks", function () {
  const b = new Board();
  b.set(0x34, encodePieceSpace(PIECETYPE_ROOK, COLOR_WHITE));
  b.set(0x31, encodePieceSpace(PIECETYPE_ROOK, COLOR_BLACK));
  b.set(0x34, SPACE_EMPTY);
  asserts.assertEquals(
    attackMapDebug(b).split("\n"),
    [
      " 0,0   0,1   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,1  [0,0]  0,1   0,1   0,1   0,1   0,1   0,1 ",
      " 0,0   0,1   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   0,0   0,0   0,0   0,0 ",
      " 0,0   0,1   0,0   0,0   0,0   0,0   0,0   0,0 ",
    ],
  );
});
