import { mateScore, moveScore, scoreToString } from "../src/autoplayers/utils/gameScore.ts";
import { asserts } from "../testDeps.ts";

Deno.test("Game Score > White mate encoding", function () {
  asserts.assertEquals(scoreToString(mateScore(1)), "+M1");
  asserts.assertEquals(scoreToString(mateScore(2)), "+M2");
  asserts.assertEquals(scoreToString(mateScore(20)), "+M20");
  asserts.assertEquals(scoreToString(mateScore(200)), "+M200");
  asserts.assertEquals(scoreToString(mateScore(1000)), "+M1000");
  asserts.assertThrows(() => mateScore(NaN));
  asserts.assertThrows(() => mateScore(0));
  asserts.assertThrows(() => mateScore(1001));
});

Deno.test("Game Score > Black mate encoding", function () {
  asserts.assertEquals(scoreToString(mateScore(-1)), "-M1");
  asserts.assertEquals(scoreToString(mateScore(-2)), "-M2");
  asserts.assertEquals(scoreToString(mateScore(-20)), "-M20");
  asserts.assertEquals(scoreToString(mateScore(-200)), "-M200");
  asserts.assertEquals(scoreToString(mateScore(-1000)), "-M1000");
  asserts.assertThrows(() => mateScore(NaN));
  asserts.assertThrows(() => mateScore(0));
  asserts.assertThrows(() => mateScore(-1001));
});

Deno.test("Game Score > Standard score encoding", function () {
  asserts.assertEquals(scoreToString(moveScore(0)), "0");
  asserts.assertEquals(scoreToString(moveScore(20)), "20");
  asserts.assertEquals(scoreToString(moveScore(-5.25)), "-5.25");
  asserts.assertEquals(scoreToString(moveScore(100_000)), "100000");
  asserts.assertEquals(scoreToString(moveScore(-100_000)), "-100000");
  asserts.assertEquals(scoreToString(moveScore(4294967295)), "4294967295");
  asserts.assertEquals(scoreToString(moveScore(-4294967295)), "-4294967295");
  asserts.assertThrows(() => moveScore(NaN));
  asserts.assertThrows(() => moveScore(2**32));
  asserts.assertThrows(() => moveScore(-(2**32)));
});

Deno.test("Game Score > Score comparisons", function () {
  asserts.assert(mateScore(1) > mateScore(2));
  asserts.assert(mateScore(-2) > mateScore(-1));
  asserts.assert(mateScore(1) > moveScore(-4294967295));
  asserts.assert(mateScore(-999) < moveScore(-4294967295));
});
