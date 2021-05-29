import { Color } from "./Color.ts";

/**
 * The Game's current state.
 */
export const enum GameStatus {
  /**
   * Game is active, and it's White's turn to play.
   */
  WhiteTurn = Color.White,

  /**
   * Game is active, and it's Black's turn to play.
   */
  BlackTurn = Color.Black,

  /**
   * Game is over, and white won by checkmating black.
   */
  CheckmateWhite = 10,

  /**
   * Game is over, and black won by checkmating black.
   */
  CheckmateBlack,

  /**
   * Game is drawn, for some unknown reason. (Adjournment, death, ...)
   */
  Draw = 20,

  /**
   * Game is drawn, as there is a stalemate.
   */
  DrawStalemate,

  /**
   * Game is drawn, as the same move repeated 3 times.
   */
  DrawRepetition,

  /**
   * Game is drawn, as it's been 50 moves since the last capture or pawn move.
   */
  DrawFiftyMove,

  /**
   * Game is drawn, as there just isn't enough material on the board for a checkmate to be delivered.
   */
  DrawNoMaterial,
}
