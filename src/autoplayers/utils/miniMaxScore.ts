// Scores are categorized into buckets:
export const MOVE = 0;
export const MATE  = 10;

export type MiniMaxScore = { type: typeof MOVE | typeof MATE, score: number };

export function mateScore(score: number): MiniMaxScore {
  return { type: MATE, score };
}

export function moveScore(score: number): MiniMaxScore {
  return { type: MOVE, score };
}

/**
 * Compare 2 scores.
 * 
 * 0 means a and b are equivalent.
 * + means white prefers b.
 * - means white prefers a.
 * 
 * @param a 
 * @param b 
 */
export function scoreCompare(a: MiniMaxScore, b: MiniMaxScore): number {
  // -M1 ... -M999 | -999 ... -1 | 0 | 1 ... 999 | +M999 ... +M1

  // Common case: Both normal moves
  if (a.type === MOVE && b.type === MOVE) {
    // This region is continuous, so simple subtraction solves it:
    return b.score - a.score;
  }

  // a is a mate, but b is normal. The preference is dependent on whether who's mate it is
  if (a.type === MATE && b.type === MOVE) {
    return (a.score < 0) ? 1 : -1;
  }

  // b is a mate, but b is normal. Same deal as with the last conditional:
  if (a.type === MOVE && b.type === MATE) {
    return (b.score < 0) ? -1 : 1;
  }

  // Else, both are mates.
  if (a.type === MATE && b.type === MATE) {
    // If they differ in sign, then pick the one that's positive:
    if ((a.score < 0) !== (b.score < 0)) {
      return (a.score < 0) ? 1 : -1;

    // If both are black checkmates, pick the one that is further away. Else, both are white checkmates in which we
    // want the sooner checkmate. Either way, the math works out the same.
    } else {
      return a.score - b.score;
    }
  }

  // !?!
  return 0;
}

export function scoreToString({ type, score }: MiniMaxScore): string {
  if (type === MATE) {
    return score < 0 ? "-M" + -score : "+M" + score;
  }
  return String(score);
}
