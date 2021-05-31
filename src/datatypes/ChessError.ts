/**
 * Generic Chess Error. All errors thrown will be a subclass of this one.
 */
export class ChessError extends Error {
}

/**
 * The game is over.
 */
export class ChessGameOver extends ChessError {
  constructor() {
    super("Game is over");
  }
}

/**
 * A Chess move was either formatted incorrectly, or was otherwise invalid.
 */
export class ChessBadMove extends ChessError {
  constructor(msg: string) {
    super("Bad move: " + msg);
  }
}

export class ChessNeedsPromotion extends ChessError {
  constructor() {
    super("Promotion piece is required for this move");
  }
}
