import { scoreMobility } from "../src/autoplayers/utils/evaluation/scoreMobility.ts";
import { ScoreSettings } from "../src/autoplayers/utils/evaluation/ScoreSettings.ts";
import { boardFromFEN } from "../src/core/logic/FEN/boardFromFEN.ts";
import { asserts } from "../testDeps.ts";

const settings: ScoreSettings = {
  Material: {
  },

  Mobility: {
    MoveScore: 10,
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

Deno.test("Board Scoring > Mobility > White starting", function () {
  const b = boardFromFEN("8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1");
  const score = scoreMobility(b, settings);
  asserts.assertEquals(score, 200);
});

Deno.test("Board Scoring > Mobility > Black starting", function () {
  const b = boardFromFEN("rnbqkbnr/pppppppp/8/8/8/8/8/8 w kq - 0 1");
  const score = scoreMobility(b, settings);
  asserts.assertEquals(score, -200);
});

Deno.test("Board Scoring > Mobility > Tarrasch Defense for White", function () {
  const b = boardFromFEN("8/8/8/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQ - 0 4");
  const score = scoreMobility(b, settings);
  asserts.assertEquals(score, 330);
});

Deno.test("Board Scoring > Mobility > Tarrasch Defense for White", function () {
  const b = boardFromFEN("rnbqkbnr/pp3ppp/4p3/2pp4/8/8/8/8 w kq - 0 4");
  const score = scoreMobility(b, settings);
  asserts.assertEquals(score, -330);
});

Deno.test("Board Scoring > Mobility > Tarrasch Defense with both", function () {
  const b = boardFromFEN("rnbqkbnr/pp3ppp/4p3/2pp4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4");
  const score = scoreMobility(b, settings);
  asserts.assertEquals(score, 0);
});
