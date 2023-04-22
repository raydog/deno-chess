// Scores are categorized into buckets:
export const MOVE = 0;
export const MATE = 10;

/**
 * Logically, GameScores are organized like this:
 *
 * |           | Black checkmate |  Black advantage   | Tie | White advantage  | White checkmate |
 * |-----------|-----------------|--------------------|-----|------------------|-----------------|
 * | Logically | -M1 .... -M1000 | -2^32 ... -1       |  0  | 1 ... 2^32       | +M1000 ... +M1  |
 *
 * Basically, there is a line (currently drawn at +/- 2**32) that separates standard move scores and checkmate scores.
 * Also note that checkmates are reversed, since we prefer a mate in 3 moves over a mate in 20.
 */
export type GameScore = number;

// A non-checkmate score can be this value, at max. The reason why is because values OVER this number are actually
// encoded Checkmates.
const SCORE_MAX = 2 ** 32;

// We will never find a checkmate MORE moves out than this. Yes, this number is VERY optimistic, but I'd rather that we
// not have to worry about our limits on this:
const CHECKMATE_MAX = 1000;

// { type: typeof MOVE | typeof MATE; score: number };

export function mateScore(score: number): GameScore {
  // Note M0 doesn't make any sense, since these scores represent moves. M0 implies that the board is already mated, and
  // so there isn't a move to score...
  if (
    isNaN(score) || score > CHECKMATE_MAX || score < -CHECKMATE_MAX ||
    score === 0
  ) {
    throw new Error("Out of range checkmate score: " + score);
  }
  return (score > 0)
    ? SCORE_MAX + CHECKMATE_MAX - score
    : -SCORE_MAX - CHECKMATE_MAX - score;
}

export function moveScore(score: number): GameScore {
  if (isNaN(score) || score >= SCORE_MAX || score <= -SCORE_MAX) {
    throw new Error("Out of range move score: " + score);
  }
  return score;
}

export function scoreToString(score: GameScore): string {
  if (score >= SCORE_MAX) {
    // White checkmate
    return "+M" + (SCORE_MAX + CHECKMATE_MAX - score);
  }
  if (score <= -SCORE_MAX) {
    // Black checkmate
    return "-M" + (score + SCORE_MAX + CHECKMATE_MAX);
  }

  // Else, standard move
  return (score / 100).toFixed(2);
}
