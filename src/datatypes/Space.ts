import { Color } from "./Color.ts";
import { PieceType } from "./PieceType.ts";

const _hashPiece = (c: Color, t: PieceType): number => c * 6 + t - 1;

const FEN_MAP = [
  "P",
  "N",
  "B",
  "R",
  "Q",
  "K",
  "p",
  "n",
  "b",
  "r",
  "q",
  "k",
];

const UNICODE_MAP = [
  "♙",
  "♘",
  "♗",
  "♖",
  "♕",
  "♔",
  "♟",
  "♞",
  "♝",
  "♜",
  "♛",
  "♚",
];

/**
 * Information on a space. Packed into a number for perf reasons.
 * 
 * The board will store up to 32 bits per space for us. It's split up like:
 * 
 * (MSB) 4444 4444 3333 3333 2222 2222 1111 1111 (LSB)
 *                                     PIECE DATA
 *
 * Format: (MSB) 0PMC TTTD (LSB)
 *
 * - D = data? (0 = null, 1 = this space has data)
 * - T = type (0-empty, 1-pawn, 2-bishop, ... same as enum)
 * - C = color (0-white, 1-black)
 * - M = moved? (1 if this piece has moved during this game)
 * - P = en passant? (1 if this is a pawn that *just* double-stepped)
 *
 * @private
 */
export type Space = number;

export const SPACE_NULL = 0;
export const SPACE_EMPTY = 1;

export function spaceHasData(sp: Space): boolean {
  return sp !== SPACE_NULL;
}

export function spaceIsEmpty(sp: Space): boolean {
  return sp === SPACE_EMPTY;
}

export function spaceGetType(sp: Space): PieceType {
  return (sp >>> 1) & 0x7;
}

export function spaceGetColor(sp: Space): Color {
  return (sp >>> 4) & 0x1;
}

export function spaceHasMoved(sp: Space): boolean {
  return Boolean(sp & 0x20);
}

export function spaceEnPassant(sp: Space): boolean {
  return Boolean(sp & 0x40);
}

export function spaceMarkMoved(sp: Space): Space {
  return (sp === SPACE_NULL || sp === SPACE_EMPTY) ? sp : sp | 0x20;
}

export function spaceSetEnPassant(sp: Space, passant: boolean): Space {
  return (sp === SPACE_NULL || sp === SPACE_EMPTY)
    ? sp
    : (sp & 0xbf) | (passant ? 0x40 : 0);
}

export function spacePromote(sp: Space, t: PieceType): Space {
  return (sp === SPACE_NULL || sp === SPACE_EMPTY)
    ? sp
    : (sp & 0xf1) | (t << 1);
}

// Assumes the space has data. Just set to 0 if it's null:
export const encodePieceSpace = (
  t: PieceType,
  c: Color,
  moved = false,
  passant = false,
): Space => {
  return 1 | (t << 1) | (c << 4) | (Number(moved) << 5) |
    (Number(passant) << 6);
};

export function spaceGetFENString(sp: Space): string {
  // Technically not valid, as FEN collapses these, but w/e
  if (!spaceHasData(sp) || spaceIsEmpty(sp)) return " ";

  const hash = _hashPiece(spaceGetColor(sp), spaceGetType(sp));
  return FEN_MAP[hash];
}

export function spaceGetUnicodeString(sp: Space): string {
  if (!spaceHasData(sp) || spaceIsEmpty(sp)) return " ";

  const hash = _hashPiece(spaceGetColor(sp), spaceGetType(sp));
  return UNICODE_MAP[hash];
}
