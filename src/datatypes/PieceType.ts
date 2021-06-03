/**
 * What type of piece is this?
 */

// export const enum PieceType {
//   Pawn = 1, // << 1-indexed, so a "piece" with code 0 can be empty on the board
//   Bishop,
//   Knight,
//   Rook,
//   Queen,
//   King,
// }

export type PieceType = number;
export const PIECETYPE_PAWN = 1;
export const PIECETYPE_BISHOP = 2;
export const PIECETYPE_KNIGHT = 3;
export const PIECETYPE_ROOK = 4;
export const PIECETYPE_QUEEN = 5;
export const PIECETYPE_KING = 6;
