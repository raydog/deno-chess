import { PieceType } from "../../../core/datatypes/PieceType.ts";

/**
 * Score numbers
 */
export type ScoreSettings = {
  /**
   * Override the current phase. Used for testing.
   */
  PhaseOverride?: number;

  /**
   * Material values of the pieces.
   */
  Material: { [type in PieceType]: number };

  /**
   * Value of a pawn being physically in the 2x2 center of the board.
   */
  PawnCenter: number;

  /**
   * Value of a pawn being able to attack inside the 2x2 center of the board.
   */
  PawnCenterAttack: number;

  /**
   * Value of a minor piece (bishop / knight) being inside the 2x2 center of the board.
   */
  MinorCenter: number;

  /**
   * Value of the queen being in the 2x2 center of the board.
   */
  QueenCenter: number;

  /**
   * Value of a non-pawn piece being able to attack the center 2x2 board.
   */
  PieceCenterAttack: number;

  /**
   * Value of a piece being in the hollow 4x4 square around the center.
   */
  PieceOuterCenter: number;

  /**
   * Value of a non-pawn piece's mobility. (Each legal move)
   */
  PieceMobility: number;

  /**
   * Value of a pawn's mobility.
   */
  PawnMobility: number;

  /**
   * Value (probably negative) of a king being on the outside edge of the board during endgame.
   */
  KingEndgameEdge: number;

  /**
   * Value of a king being in the outer center during endgame.
   */
  KingEndgameOuterCenter: number;

  /**
   * Value of a king being in the center during endgame.
   */
  KingEndgameCenter: number;
};
