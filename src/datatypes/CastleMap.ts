import { Color, COLOR_WHITE } from "./Color.ts";
import { Coord } from "./Coord.ts";

/**
 * A quick numeric type to keep track of Castle eligibility.
 *
 * `[MSB]` dddd cccc bbbb aaaa `[LSB]`
 *
 * - a: White kingside
 * - b: White queenside
 * - c: Black kingside
 * - d: Black queenside
 *
 * Each nibble is the file of that specific rook, and if that rook is not eligible, the file will fail the 0x8 test.
 */
export type CastleMap = number;

/**
 * Will construct a new castle map object. Assumes that all rooks are eligible for castling.
 *
 * @param whiteQRook
 * @param whiteKRook
 * @param blackQRook
 * @param blackKRook
 * @returns
 */
export function buildCastleMap(
  whiteQRook: Coord,
  whiteKRook: Coord,
  blackQRook: Coord,
  blackKRook: Coord,
): CastleMap {
  return (whiteKRook & 0xf) | (whiteQRook & 0xf) << 4 |
    (blackKRook & 0xf) << 8 | (blackQRook & 0xf) << 12;
}

/**
 * Will make sure both rook eligibilities for a particular side are removed. Used when a king moves.
 *
 * @param map
 * @param color
 * @returns
 */
export function castleMapKingMoved(map: CastleMap, color: Color): CastleMap {
  return (color === COLOR_WHITE)
    ? (map & 0xff00) | 0x0088
    : (map & 0x00ff) | 0x8800;
}

/**
 * Will take a rook, and will remove it from the map. Called when a rook moves for the first time.
 *
 * @param map
 * @param coord
 */
export function castleMapRookMoved(map: CastleMap, coord: Coord): CastleMap {
  const kbase = coord < 0x40 ? 0 : 8;
  const qbase = kbase + 4;
  const file = coord & 0x0f;

  // Kingside:
  if (((map >>> kbase) & 0xf) === file) {
    const withHole = map & (~(0xf << kbase));
    const newKSide = 0x8 << kbase;
    return withHole | newKSide;
  }

  // Queenside
  if (((map >>> qbase) & 0xf) === file) {
    const withHole = map & (~(0xf << qbase));
    const newQSide = 0x8 << qbase;
    return withHole | newQSide;
  }

  // No match?
  return map;
}

/**
 * Returns info on the color + side asked for. If the rook is NOT elibible, the file will fail the 0x8 test.
 */
export function castleMapGetFile(
  map: CastleMap,
  color: Color,
  kingSide: boolean,
): CastleMap {
  const offset = (color << 3) + (kingSide ? 0 : 4);
  return (map >>> offset) & 0xf;
}
