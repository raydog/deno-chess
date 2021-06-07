/**
 * The Game's current state.
 */
// export const enum GameStatus {
//   /**
//    * Game is active.
//    */
//   Active = 0,

//   /**
//    * Game is over, and it was a checkmate.
//    */
//   Checkmate = 10,

//   /**
//    * Game is drawn, for some unknown reason. (Adjournment, death, ...)
//    */
//   Draw = 20,

//   /**
//    * Game is drawn, as there is a stalemate.
//    */
//   DrawStalemate,

//   /**
//    * Game is drawn, as the same move repeated 3 times.
//    */
//   DrawRepetition,

//   /**
//    * Game is drawn, as it's been 50 moves since the last capture or pawn move.
//    */
//   DrawFiftyMove,

//   /**
//    * Game is drawn, as there just isn't enough material on the board for a checkmate to be delivered.
//    */
//   DrawNoMaterial,
// }

export const GAMESTATUS_ACTIVE = 0;
export const GAMESTATUS_CHECKMATE = 10;
export const GAMESTATUS_RESIGNED = 11;
export const GAMESTATUS_DRAW = 20;
export const GAMESTATUS_DRAW_STALEMATE = 21;
export const GAMESTATUS_DRAW_REPETITION = 22;
export const GAMESTATUS_DRAW_FIFTYMOVES = 23;
export const GAMESTATUS_DRAW_NOMATERIAL = 24;

export type GameStatus =
  | typeof GAMESTATUS_ACTIVE
  | typeof GAMESTATUS_CHECKMATE
  | typeof GAMESTATUS_RESIGNED
  | typeof GAMESTATUS_DRAW
  | typeof GAMESTATUS_DRAW_STALEMATE
  | typeof GAMESTATUS_DRAW_REPETITION
  | typeof GAMESTATUS_DRAW_FIFTYMOVES
  | typeof GAMESTATUS_DRAW_NOMATERIAL;
