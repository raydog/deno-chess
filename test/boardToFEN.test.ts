import { createFullMove } from "../src/core/datatypes/Move.ts";
import { boardToFEN } from "../src/core/logic/FEN/boardToFEN.ts";
import { buildStandardBoard } from "../src/core/logic/boardLayouts/buildStandardBoard.ts";
import { performMove } from "../src/core/logic/performMove.ts";
import { asserts } from "../testDeps.ts";

// Note: These tests seem arbitrary, but they're the literal examples shown in the spec, so may as well

Deno.test("FEN > Output > Starting position", function () {
  const b = buildStandardBoard();
  const fen = boardToFEN(b);
  asserts.assertEquals(
    fen,
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
});

Deno.test("FEN > Output > After 1. e4", function () {
  const b = buildStandardBoard();
  performMove(
    b,
    createFullMove(b.get(0x14), 0x14, 0x34, 0, 0, 0, 0, 0, 0, 0x24, b.getPriorState()),
  );
  const fen = boardToFEN(b);
  asserts.assertEquals(
    fen,
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  );
});

Deno.test("FEN > Output > After 1... c5", function () {
  const b = buildStandardBoard();
  performMove(
    b,
    createFullMove(b.get(0x14), 0x14, 0x34, 0, 0, 0, 0, 0, 0, 0x24, b.getPriorState()),
  );
  performMove(
    b,
    createFullMove(b.get(0x62), 0x62, 0x42, 0, 0, 0, 0, 0, 0, 0x52, b.getPriorState()),
  );
  const fen = boardToFEN(b);
  asserts.assertEquals(
    fen,
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
  );
});

Deno.test("FEN > Output > After 2. Nf3", function () {
  const b = buildStandardBoard();
  performMove(
    b,
    createFullMove(b.get(0x14), 0x14, 0x34, 0, 0, 0, 0, 0, 0, 0x24, b.getPriorState()),
  );
  performMove(
    b,
    createFullMove(b.get(0x62), 0x62, 0x42, 0, 0, 0, 0, 0, 0, 0x52, b.getPriorState()),
  );
  performMove(b, createFullMove(b.get(0x06), 0x06, 0x25, 0, 0, 0, 0, 0, 0, 0, b.getPriorState()));
  const fen = boardToFEN(b);
  asserts.assertEquals(
    fen,
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
  );
});
