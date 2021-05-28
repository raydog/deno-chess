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
};

export function createSimpleMove(what: Space, from: Coord, dest: Coord): Move {
  return {
    what,
    from,
    dest,
    capture: 0,
    captureCoord: 0,
    castleRook: 0,
    castleRookFrom: 0,
    castleRookDest: 0,
    promote: 0,
    markEnPassant: 0,
  };
}

export function createSimpleCapture(
  what: Space,
  from: Coord,
  dest: Coord,
  capture: Space,
  captureCoord: Coord,
): Move {
  return {
    what,
    from,
    dest,
    capture,
    captureCoord,
    castleRook: 0,
    castleRookFrom: 0,
    castleRookDest: 0,
    promote: 0,
    markEnPassant: 0,
  };
}

export function createCastle(
  what: Space,
  from: Coord,
  dest: Coord,
  castleRook: Space,
  castleRookFrom: Coord,
  castleRookDest: Coord,
): Move {
  return {
    what,
    from,
    dest,
    capture: 0,
    captureCoord: 0,
    castleRook,
    castleRookFrom,
    castleRookDest,
    promote: 0,
    markEnPassant: 0,
  };
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
  };
}
