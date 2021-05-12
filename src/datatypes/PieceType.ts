/**
 * What type of piece is this?
 */
export const enum PieceType {
  Pawn = 1, // << 1-indexed, so a "piece" with code 0 can be empty on the board
  Bishop,
  Knight,
  Rook,
  Queen,
  King,
}
