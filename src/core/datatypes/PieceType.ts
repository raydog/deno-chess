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

const PIECETYPE_LETTERS: { [type in PieceType]: string } = {
  [PIECETYPE_PAWN]: "P",
  [PIECETYPE_BISHOP]: "B",
  [PIECETYPE_KNIGHT]: "N",
  [PIECETYPE_ROOK]: "R",
  [PIECETYPE_QUEEN]: "Q",
  [PIECETYPE_KING]: "K",
};

export function pieceTypeLetter(type: PieceType): string {
  return PIECETYPE_LETTERS[type];
}
