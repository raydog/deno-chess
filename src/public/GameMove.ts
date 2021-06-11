import { Move } from "../core/datatypes/Move.ts";

/**
 * A single game move.
 */
export interface GameMove {
  /**
   * The turn number. Incremented after each black move.
   */
  num: number;

  /**
   * Who made the move.
   */
  side: "white" | "black";

  /**
   * The departure square, in algebraic notation.
   */
  from: string;

  /**
   * The destination square, in algebraic notation.
   */
  dest: string;

  /**
   * The move, in Standard Algebraic Notation.
   */
  san: string;
}

export type GameMoveInternal = GameMove & { move: Move };
