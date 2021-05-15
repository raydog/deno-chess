import { Coord } from "./Coord.ts";
import { PieceType } from "./PieceType.ts";


/**
 * Info on a capture.
 */
type CaptureData = {
  /**
   * The piece type (P, R, B, ...) that was captured.
   */
  what: PieceType;

  /**
   * Where the piece was captured. This may differ from `move.to` with en passants.
   */
  where: Coord;
};

/**
 * Information on a castle.
 */
type CastleData = {
  /**
   * Where the rook that was involved in this castle started.
   */
  rookFrom: Coord;

  /**
   * Where the rook that was involved in this castle ended.
   */
  rookTo: Coord;
};

/**
 * Documents a move during this game. Was validated prior to creation.
 */
export class Move {

  /**
   * The piece type (Pawn, Rook, ...) that moved.
   */
  readonly what: PieceType;

  /**
   * The starting square for the piece.
   */
  readonly from: Coord;

  /**
   * The ending squre for the piece.
   */
  readonly to: Coord;

  /**
   * If this was a capture, documents WHAT was captured.
   */
  readonly capture: CaptureData | null;

  /**
   * The piece type (Q, K, ...) that a pawn promoted to, if this is a promotion.
   */
  readonly promotion: PieceType | null;

  /**
   * If this was a castle, information on that castle.
   */
  readonly castle: CastleData | null;

  // Internal constructor:
  constructor(
    what: PieceType,
    from: Coord,
    to: Coord,
    capture: CaptureData | null,
    promotion: PieceType | null,
    castle: CastleData | null,
  ) {
    this.what = what;
    this.from = from;
    this.to = to;
    this.capture = capture;
    this.promotion = promotion;
    this.castle = castle;
  }
}
