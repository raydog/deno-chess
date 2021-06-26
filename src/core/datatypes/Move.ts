import { PriorState } from "./Board.ts";
import { Coord } from "./Coord.ts";
import { PieceType } from "./PieceType.ts";
import { Space } from "./Space.ts";

export type Move = {
  // These exist for all move types:
  what: Space;
  from: Coord;
  dest: Coord;

  // These exist for captures. (Capture coord may differ from dest with en passant)
  capture: Space;
  captureCoord: Coord;

  // These exist for castles.
  castleRook: Space;
  castleRookFrom: Coord;
  castleRookDest: Coord;

  // This exists when a pawn promotes to something:
  promote: PieceType | 0;

  // Mark this space as being available for En Passants:
  // Aside, while 0 is a valid coord, it is never possible to get an En Passant there, so 0 is used as the "empty"
  // state.
  markEnPassant: Coord;

  // Prior state. Used when unmaking a move:
  prior: PriorState
};


export function createSimpleMove(what: Space, from: Coord, dest: Coord, prior: PriorState): Move {
  return createFullMove(what, from, dest, 0, 0, 0, 0, 0, 0, 0, prior);
}

export function createSimpleCapture(
  what: Space,
  from: Coord,
  dest: Coord,
  capture: Space,
  captureCoord: Coord,
  prior: PriorState,
): Move {
  return createFullMove(what, from, dest, capture, captureCoord, 0, 0, 0, 0, 0, prior);
}

export function createCastle(
  what: Space,
  from: Coord,
  dest: Coord,
  castleRook: Space,
  castleRookFrom: Coord,
  castleRookDest: Coord,
  prior: PriorState,
): Move {
  return createFullMove(
    what,
    from,
    dest,
    0,
    0,
    castleRook,
    castleRookFrom,
    castleRookDest,
    0,
    0,
    prior,
  );
}

export function createFullMove(
  what: Space,
  from: Coord,
  dest: Coord,
  capture: Space,
  captureCoord: Coord,
  castleRook: Space,
  castleRookFrom: Coord,
  castleRookDest: Coord,
  promote: PieceType,
  markEnPassant: Coord,
  prior: PriorState,
) {
  return {
    what,
    from,
    dest,
    capture,
    captureCoord,
    castleRook,
    castleRookFrom,
    castleRookDest,
    promote,
    markEnPassant,
    prior
  };
}

export function moveToPromotion(move: Move, promote: PieceType): Move {
  return { ...move, promote };
}
