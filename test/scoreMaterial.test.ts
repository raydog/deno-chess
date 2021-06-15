import { scoreMaterial } from "../src/autoplayers/utils/evaluation/scoreMaterial.ts";
import { ScoreSettings } from "../src/autoplayers/utils/evaluation/ScoreSettings.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../src/core/datatypes/PieceType.ts";
import { boardFromFEN } from "../src/core/logic/FEN/boardFromFEN.ts";
import { asserts } from "../testDeps.ts";

const settings: ScoreSettings = {
  Material: {
    [PIECETYPE_PAWN]: 100,
    [PIECETYPE_BISHOP]: 300,
    [PIECETYPE_KNIGHT]: 300,
    [PIECETYPE_ROOK]: 500,
    [PIECETYPE_QUEEN]: 900,
    [PIECETYPE_KING]: 20000,
  },

  Mobility: {
    MoveScore: 25,
  },

  PawnStructure: {
    IsolatedPawn: -50,
    DoubledPawn: -20,
    PastPawn: 80,
    PawnSupport: 20,
    PawnAdvancement: 20,
  },

  Random: {
    Range: 0,
    BookOdds: 1,
  },
};

Deno.test("Board Scoring > Material > White pawns", function () {
  const b = boardFromFEN("8/8/8/8/8/2P5/3PP3/8 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 300);
});

Deno.test("Board Scoring > Material > Black pawns", function () {
  const b = boardFromFEN("8/5pp1/8/1p6/8/8/8/8 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, -300);
});

Deno.test("Board Scoring > Material > White bishops", function () {
  const b = boardFromFEN("8/8/8/8/8/8/8/2B2B2 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 600);
});

Deno.test("Board Scoring > Material > Black bishops", function () {
  const b = boardFromFEN("2b2b2/8/8/8/8/8/8/8 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, -600);
});

Deno.test("Board Scoring > Material > White knights", function () {
  const b = boardFromFEN("3N4/8/8/8/8/8/8/1N4N1 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 900);
});

Deno.test("Board Scoring > Material > Black knights", function () {
  const b = boardFromFEN("8/8/2n2n2/8/8/8/8/8 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, -600);
});

Deno.test("Board Scoring > Material > White rooks", function () {
  const b = boardFromFEN("8/8/8/R7/8/8/8/8 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 500);
});

Deno.test("Board Scoring > Material > Black rooks", function () {
  const b = boardFromFEN("8/8/8/8/8/8/6r1/7r w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, -1000);
});

Deno.test("Board Scoring > Material > White queens", function () {
  const b = boardFromFEN("8/8/8/8/8/8/8/3Q4 w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 900);
});

Deno.test("Board Scoring > Material > Black queens", function () {
  const b = boardFromFEN("3q4/8/8/8/8/8/8/7q w - - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, -1800);
});

Deno.test("Board Scoring > Material > White starting", function () {
  const b = boardFromFEN("8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 23900);
});

Deno.test("Board Scoring > Material > Black starting", function () {
  const b = boardFromFEN("rnbqkbnr/pppppppp/8/8/8/8/8/8 w kq - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, -23900);
});

Deno.test("Board Scoring > Material > White starting", function () {
  const b = boardFromFEN("8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 23900);
});

Deno.test("Board Scoring > Material > Both starting", function () {
  const b = boardFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const score = scoreMaterial(b, settings);
  asserts.assertEquals(score, 0);
});
