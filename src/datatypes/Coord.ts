import { assert } from "../logic/assert.ts";

// Helpful constants. Only really used for the helpers:
const AN_RE = /^[a-h][1-8]$/i;
const FILES = "abcdefgh";
const RANKS = "12345678";

/**
 * An index into the board array. Kept as a tight integer for perf reasons. Parse this to get at ranks and files.
 */
export type Coord = number;

/**
 * Parse a packed coord into file and rank numbers.
 *
 * @param idx
 * @returns
 */
export const parseCoord = (
  idx: Coord,
): [file: number, rank: number] => [idx & 0x7, idx >>> 4];

/**
 * Pack file and rank numbers into a coord.
 *
 * @param file
 * @param rank
 * @returns
 */
export const buildCoord = (file: number, rank: number): number =>
  ((rank & 0x7) << 4) | (file & 0x7);

/**
 * Given an index, will return the next one.
 *
 * @param idx
 * @returns
 */
export const nextCoord = (idx: Coord) => idx + ((idx & 0x7) === 7 ? 9 : 1);

/**
 * Helper: Produce a packed coord from a chess coordinate in Algebraic Notation.
 *
 * @param an
 * @returns
 */
export const coordFromAN = (an: string): Coord => {
  assert(AN_RE.test(an), "Invalid coord");
  const lower = an.toLowerCase();
  const file = lower.charCodeAt(0) - 97;
  const rank = lower.charCodeAt(1) - 49;
  return buildCoord(file, rank);
};

/**
 * Helper: Produce a chess coordinate in Algebraic Notation from our internal (packed) coord.
 *
 * @param idx
 * @returns
 */
export const coordToAN = (idx: Coord): string => {
  const [file, rank] = parseCoord(idx);
  return FILES[file] + RANKS[rank];
};
