import { Color } from "./Color.ts";
import { Coord } from "./Coord.ts";
import { PieceType } from "./PieceType.ts";
import { Space, spaceGetColor, spaceGetType } from "./Space.ts";

/**
 * Moves are encoded as 32-bit numbers so they can be passed around with minimal allocations. They are generally broken
 * into 5 sections:
 * 
 * **Format:**
 * 
 * `[MSB]` `4444 3333 2222 2222 1111 1111 0000 0000` `[LSB]`
 * 
 * 0 is the WHO section.
 * 1 is the FROM coord.
 * 2 is the DEST coord.
 * 3 is the FLAG section, and the fields are densely packed based on special move conditions.
 * 4 is the ANNOTATE section, which is an optionally-populated section that gives extra board info.
 * 
 * **WHO Section:**
 * 
 * `[MSB] `---- TTTC` `[LSB]`
 * 
 * - C : Color (Same as enum)
 * - T : Type (Same as enum)
 *
 * **FLAG Section:**
 * 
 * `[MSB]` `PCAB` `[LSB]`
 * 
 * - P : Promotion? If 1, the promoted piece is stored in the special A + B fields.
 * - C : Capture? If 1, this piece captured something this move.
 * 
 * When P is 0:
 * 
 * - A0 B0 : Normal move
 * - A0 B1 : Mark En Passant (if C0 just a double open, else an EP capture)
 * - A1 B0 : Kingside castle
 * - A1 B1 : Queenside castle
 * 
 * When P is 1:
 * 
 * - A0 B0 : Knight
 * - A0 B1 : Bishop
 * - A1 B0 : Rook
 * - A1 B1 : Queen
 * 
 * **ANNOTATE Section:**
 * 
 * `[MSB]` `-MCA` `[LSB]`
 * 
 * - A : Annotated? Were the annotations generated and added for this field?
 * - C : Check? Did this move leave the enemy in check? (Adds + or # to the SAN.)
 * - M : Moves exist? Does the enemy have any moves left? (Makes the move checkmate or stalemate.)
 * 
 * @link https://www.chessprogramming.org/Encoding_Moves#From-To_Based
 * 
 * A move has 3 parts:
 */
export type Move = number;

export function moveGetColor(move: Move): Color {
  return move & 0x1;
}

export function moveGetType(move: Move): PieceType {
  return (move >>> 1) & 0x7;
}

export function moveGetFrom(move: Move): Coord {
  return (move >>> 8) & 0xff;
}

export function moveGetDest(move: Move): Coord {
  return (move >>> 16) & 0xff;
}

export function moveGetPromotion(move: Move): PieceType | 0 {
  const flags = (move >>> 24);
  const didPromote = flags & 0x8;
  return didPromote
    ? (flags & 0x3) + 2
    : 0;
}

export function moveGetCapture(move: Move): boolean {
  return ((move >>> 24) & 0x4) === 0x4;
}

export function moveGetEPCapture(move: Move): boolean {
  return ((move >>> 24) & 0x5) === 0x5;
}

// Return 0 if not a castle, 1 if kingside, 2 if queenside
export function moveGetCastle(move: Move): number {
  const flags = (move >>> 24);
  const promoteOrCapture = flags & 0xc;
  const maybeExtra = flags & 0x3;
  return (promoteOrCapture || maybeExtra <= 1)
    ? 0
    : maybeExtra - 1;
}

export function moveGetMarkEnPassant(move: Move): boolean {
  const flags = (move >>> 24);
  const promoteOrCapture = flags & 0xc;
  return promoteOrCapture
    ? false
    : (flags & 0x1) !== 0;
}

export function moveGetEnemyInCheck(move: Move): boolean | void {
  const annotate = move >>> 28;
  return (annotate & 0x1) ? Boolean(annotate & 0x2) : undefined;
}

export function moveGetEnemyHasMoves(move: Move): boolean | void {
  const annotate = move >>> 28;
  return (annotate & 0x1) ? Boolean(annotate & 0x4) : undefined;
}

export function encodeSimpleMove(what: Space, from: Coord, dest: Coord): Move {
  const color = spaceGetColor(what);
  const type = spaceGetType(what);
  return (color) | (type << 1) | (from << 8) | (dest << 16);
}

export function encodePawnLongOpen(what: Space, from: Coord, dest: Coord): Move {
  const color = spaceGetColor(what);
  const type = spaceGetType(what);
  const flags = 0x1;
  return (color) | (type << 1) | (from << 8) | (dest << 16) | (flags << 24);
}

export function encodeCapture(
  what: Space,
  from: Coord,
  dest: Coord,
  enPassant?: boolean,
  promote?: PieceType
): Move {
  const color = spaceGetColor(what);
  const type = spaceGetType(what);
  const capt = enPassant ? 0x5 : 0x4;
  const prom = promote ? ((promote - 2) & 0x3) | 0x8 : 0;
  const flags = capt | prom;
  return (color) | (type << 1) | (from << 8) | (dest << 16) | (flags << 24);
}

export function encodeCastle(
  what: Space,
  from: Coord,
  dest: Coord,
  kingside: boolean
): Move {
  const color = spaceGetColor(what);
  const type = spaceGetType(what);
  const flags = kingside ? 0x2 : 0x3;
  return (color) | (type << 1) | (from << 8) | (dest << 16) | (flags << 24);
}

export function encodePromote(
  what: Space,
  from: Coord,
  dest: Coord,
  promote: PieceType
): Move {
  const color = spaceGetColor(what);
  const type = spaceGetType(what);
  const flags = ((promote - 2) & 0x3) | 0x8;
  return (color) | (type << 1) | (from << 8) | (dest << 16) | (flags << 24);
}

export function moveAddAnnotations(move: Move, check: boolean, enemyHasMove: boolean): Move {
  const c = check ? 2 : 0;
  const m = enemyHasMove ? 4 : 0;
  const annotate = c & m & 1;
  return move | (annotate << 28);

}
