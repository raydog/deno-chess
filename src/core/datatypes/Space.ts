import { Color } from "./Color.ts";
import { PieceType } from "./PieceType.ts";

const _hashPiece = (c: Color, t: PieceType): number => c * 6 + t - 1;

const FEN_MAP = [
  "P",
  "B",
  "N",
  "R",
  "Q",
  "K",
  "p",
  "b",
  "n",
  "r",
  "q",
  "k",
];

const UNICODE_MAP = [
  "♙",
  "♗",
  "♘",
  "♖",
  "♕",
  "♔",
  "♟",
  "♝",
  "♞",
  "♜",
  "♛",
  "♚",
];

/**
 * Information on a space. Packed into a number for perf reasons.
 *
 * Format: (MSB) 000M CTTT (LSB)
 *
 * - T = type (0-empty, 1-pawn, 2-bishop, ... same as enum)
 * - C = color (0-white, 1-black)
 * - M = moved? (1 if this piece has moved during this game)
 *
 * @private
 */
export type Space = number;

export const SPACE_EMPTY = 0;

export function spaceGetType(sp: Space): PieceType {
  return sp & 0x7;
}

export function spaceGetColor(sp: Space): Color {
  return (sp >>> 3) & 0x1;
}

export function spaceHasMoved(sp: Space): boolean {
  return Boolean(sp & 0x10);
}

export function spaceMarkMoved(sp: Space): Space {
  return (sp === SPACE_EMPTY) ? sp : sp | 0x10;
}

export function spacePromote(sp: Space, t: PieceType): Space {
  return (sp === SPACE_EMPTY) ? sp : (sp & 0xf8) | (t & 0x7);
}

// Assumes the space has data. Just set to 0 if it's null:
export const encodePieceSpace = (
  t: PieceType,
  c: Color,
  moved = false,
): Space => {
  return t | (c << 3) | (Number(moved) << 4);
};

export function spaceGetFENString(sp: Space): string {
  // Technically not valid, as FEN collapses these, but w/e
  if (sp === SPACE_EMPTY) return " ";

  const hash = _hashPiece(spaceGetColor(sp), spaceGetType(sp));
  return FEN_MAP[hash];
}

export function spaceGetUnicodeString(sp: Space): string {
  if (sp === SPACE_EMPTY) return " ";

  const hash = _hashPiece(spaceGetColor(sp), spaceGetType(sp));
  return UNICODE_MAP[hash];
}
