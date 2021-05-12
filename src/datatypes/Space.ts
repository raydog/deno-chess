import { Color } from "./Color.ts";
import { PieceType } from "./PieceType.ts";


const _hashPiece = (c: Color, t: PieceType): number => c * 6 + t - 1;

const FEN_MAP = [
  "P", "B", "N", "R", "Q", "K",
  "p", "b", "n", "r", "q", "k",
];

const UNICODE_MAP = [
  "♙", "♗", "♘", "♖", "♕", "♔",
  "♟", "♝", "♞", "♜", "♛", "♚",
];


/**
 * Information on a space. Packed into a number for perf reasons.
 * 
 * Format: 00HL CTTT (LSB)
 * 
 * - T = type (0-empty, 1-pawn, 2-bishop, ...)
 * - C = color (0-white, 1-black)
 * - L = last move? (boolean, 1 if this piece moved during the last half-move)
 * - H = has moved? (boolean, 1 if this piece has moved during this game)
 * 
 * @private
 */
export type Space = number;

export const spaceIsEmpty = (sp: Space): boolean => (sp & 0x7) === 0;

export const spaceGetType = (sp: Space): PieceType => sp & 0x7;

export const spaceGetColor = (sp: Space): Color => (sp & 0x8) >>> 3;

export const spaceIsColor = (sp: Space, c: Color): boolean => sp !== 0 && ((sp & 0x8) >>> 3) === c;

export const spaceJustMoved = (sp: Space): boolean => Boolean(sp & 0x10);

export const spaceHasMoved = (sp: Space): boolean => Boolean(sp & 0x20);

export const encodePieceSpace = (t: PieceType, c: Color, l: boolean, h: boolean): Space => {
  return t | (c << 3) | (Number(l) << 4) | (Number(h) << 5);
};

export function spaceGetFENString(sp: Space): string {
  // Technically not valid, as FEN collapses these, but w/e
  if (spaceIsEmpty(sp)) { return " "; }

  const hash = _hashPiece(spaceGetColor(sp), spaceGetType(sp));
  return FEN_MAP[hash];
}



// /**
//  * Information on a single piece.
//  */
// export class Piece {
  
//   /**
//    * True if this piece was moved within the last move.
//    * 
//    * Used to detect when en passant is allowed.
//    */
//   justMoved = false;

//   /**
//    * The number of times this piece has bee moved.
//    * 
//    * Castling is only allowed if both the kind AND a rook have this number equal to 0.
//    */
//   moveNum = 0;

//   constructor(readonly type: PieceType, readonly color: Color) {}

//   toString(format: StringFormat = "FEN") {
//     switch (format) {
//       case "fen":
//       case "FEN":
//         return FEN_MAP[_HASH(this.color, this.type)];
      
//       case "unicode":
//         return UNICODE_MAP[_HASH(this.color, this.type)];
//     }
//   }
// }
