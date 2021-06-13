import { PieceType } from "../../../core/datatypes/PieceType.ts";

/**
 * Score numbers
 */
export type ScoreSettings = {
  General: {
    /**
     * A score, added when a move is a part of some opening book.
     *
     * (Openings can be rough for these evaluations, so encourage playing by the book.)
     */
    BookMove: number;
  };

  /**
   * A score for each type of piece on the board.
   *
   * (Discourages captures in general, or poorly balanced trades.)
   *
   * TODO: Maybe break this down by game phases?
   */
  Material: { [type in PieceType]: number };

  // How activated are the pieces?
  Mobility: {
    /**
     * A score added for every legal move a side can make.
     *
     * (To encourage pieces in more activated positions.)
     *
     * TODO: This really seems to cause the AI to over-use the queen. Maybe break this down by piece type?
     */
    MoveScore: number;
  };

  // How safe are the kings, generally?
  // KingSafety: {

  // },

  // How much control over the center?
  // ZoneControl: {

  // },

  // How well structured are our pawns?
  PawnStructure: {
    /**
     * A score (probably negative) for a pawn not having another pawn in a nearby file.
     *
     * (To discourage these isolated pawn islands.)
     */
    IsolatedPawn: number;

    /**
     * A score (probably negative) for a pawn being blocked by another pawn of the same color.
     *
     * (To discourage pawns being stacked that way, since they're tricky to move and defend.)
     */
    DoubledPawn: number;

    /**
     * A score for a pawn not having any enemy pawns in front of them.
     *
     * (To encourage past pawns, for possible promotion in endgame.)
     */
    PastPawn: number;

    /**
     * A score for when a pawn has another pawn defending it.
     *
     * (To encourage pawns to line up in defended patterns.)
     */
    PawnSupport: number;

    /**
     * A score for each rank BEHIND a pawn.
     *
     * (To encourage pawns to move up.)
     */
    PawnRanks: number;
  };

  // Are there pieces bearing down on the King?
  // KingTropism: {

  // },

  Random: {
    /**
     * A random number between +/- this will be added to board evaluations.
     *
     * (To simulate the effect of a less experienced player, or just to make games a little more spicy.)
     */
    Range: number;
  };
};
