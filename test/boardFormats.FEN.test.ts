import { createFullMove } from "../src/datatypes/Move.ts";
import { boardRenderFEN } from "../src/logic/boardFormats/boardRenderFEN.ts";
import { buildStandardBoard } from "../src/logic/boardLayouts/standard.ts";
import { performMove } from "../src/logic/performMove.ts";
import { asserts } from "../testDeps.ts";

// Note: These tests seem arbitrary, but they're the literal examples shown in the spec, so may as well

Deno.test("Board Formats > FEN > Starting position", function () {
  const b = buildStandardBoard();
  const fen = boardRenderFEN(b);
  asserts.assertEquals(fen, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
});

Deno.test("Board Formats > FEN > After 1. e4", function () {
  const b = buildStandardBoard();
  performMove(b, createFullMove(b.get(0x14), 0x14, 0x34, 0, 0, 0, 0, 0, 0, 0x24));
  const fen = boardRenderFEN(b);
  asserts.assertEquals(fen, "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
});

Deno.test("Board Formats > FEN > After 1... c5", function () {
  const b = buildStandardBoard();
  performMove(b, createFullMove(b.get(0x14), 0x14, 0x34, 0, 0, 0, 0, 0, 0, 0x24));
  performMove(b, createFullMove(b.get(0x62), 0x62, 0x42, 0, 0, 0, 0, 0, 0, 0x52));
  const fen = boardRenderFEN(b);
  asserts.assertEquals(fen, "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2");
});

Deno.test("Board Formats > FEN > After 2. Nf3", function () {
  const b = buildStandardBoard();
  performMove(b, createFullMove(b.get(0x14), 0x14, 0x34, 0, 0, 0, 0, 0, 0, 0x24));
  performMove(b, createFullMove(b.get(0x62), 0x62, 0x42, 0, 0, 0, 0, 0, 0, 0x52));
  performMove(b, createFullMove(b.get(0x06), 0x06, 0x25, 0, 0, 0, 0, 0, 0, 0));
  const fen = boardRenderFEN(b);
  asserts.assertEquals(fen, "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2");
});
