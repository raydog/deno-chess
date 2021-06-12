import { Board } from "../datatypes/Board.ts";
import { Color, COLOR_WHITE } from "../datatypes/Color.ts";
import {
  Space,
  SPACE_EMPTY,
  spaceGetColor,
  spaceGetType,
  spaceHasMoved,
} from "../datatypes/Space.ts";
import { assert } from "./assert.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../datatypes/PieceType.ts";
import { Coord } from "../datatypes/Coord.ts";
import {
  createCastle,
  createFullMove,
  createSimpleCapture,
  createSimpleMove,
  Move,
} from "../datatypes/Move.ts";
import { performMove } from "./performMove.ts";
import { kingInDanger } from "./kingInDanger.ts";
import { castleMapGetFile } from "../datatypes/CastleMap.ts";

// Pre-compiled lists of moves, since most moves are similar:
const DIRS = [16, 1, -16, -1, 17, -15, -17, 15];
const KNIGHT = [31, 33, 14, 18, -18, -14, -33, -31];
const PAWN_CAPS = [-1, 1];

/**
 * Will extract all valid moves for the given player.
 *
 * @param b The current board state.
 * @param color The color of the current player.
 * @param fullMoves True if we want to scan for check etc as a result of this move.
 */
export function listAllValidMoves(
  b: Board,
  color: Color,
): Move[] {
  const out: Move[] = [];
  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      const idx = rank | file;
      const sp = b.get(idx);
      if (sp !== SPACE_EMPTY && spaceGetColor(sp) === color) {
        listValidMoves(b, idx, out);
      }
    }
  }
  return out;
}

/**
 * Will enumerate all moves for the piece on the given space on the given board. Space **must** contain a piece.
 *
 * Will check the board to see if castles or en passant are possible. Will also respect checks, so pieces can be pinned,
 * or moves will be restricted if king is currently in check.
 *
 * If a move would result in a promotion (a Pawn reached its final rank) the move will include a Promote property equal
 * to PIECETYPE_QUEEN. If a different piece is desired, just update the property before performing that move.
 */
export function listValidMoves(
  b: Board,
  idx: Coord,
  out: Move[] = [],
): Move[] {
  const sp = b.get(idx);

  assert(sp !== SPACE_EMPTY, "Listing moves of empty space");

  b.save();
  b.set(idx, SPACE_EMPTY);

  switch (spaceGetType(sp)) {
    // Slidey pieces:

    case PIECETYPE_BISHOP:
      _findMoves(b, sp, idx, DIRS, 4, 8, 8, out);
      break;

    case PIECETYPE_ROOK:
      _findMoves(b, sp, idx, DIRS, 0, 4, 8, out);
      break;

    case PIECETYPE_QUEEN:
      _findMoves(b, sp, idx, DIRS, 0, 8, 8, out);
      break;

    // Steppy pieces:

    case PIECETYPE_KNIGHT:
      _findMoves(b, sp, idx, KNIGHT, 0, 8, 1, out);
      break;

    case PIECETYPE_KING:
      _findMoves(b, sp, idx, DIRS, 0, 8, 1, out);
      _findKingCastles(b, sp, idx, out);
      break;

    case PIECETYPE_PAWN:
      _pawnMoves(b, sp, idx, out);
      break;
  }

  b.restore();

  return out;
}

// Util to extract find legit moves:
function _findMoves(
  b: Board,
  sp: Space,
  idx: number,
  dirs: number[],
  dirsLow: number,
  dirsHigh: number,
  maxDist: number,
  out: Move[],
) {
  const color = spaceGetColor(sp);
  const enemy = 1 - color;

  for (let dirIdx = dirsLow; dirIdx < dirsHigh; dirIdx++) {
    const step = dirs[dirIdx];
    for (
      let newIdx = idx + step, n = 0;
      (newIdx & 0x88) === 0 && n < maxDist;
      newIdx += step, n++
    ) {
      const newSp = b.get(newIdx);

      // If empty, we could either stop here or continue:
      if (newSp === SPACE_EMPTY) {
        _tryPushMove(b, out, createSimpleMove(sp, idx, newIdx));
        continue;
      }

      // If an enemy, then we can capture. But no matter what, we can't keep going in this direction:
      if (spaceGetColor(newSp) === enemy) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, newIdx, newSp, newIdx),
        );
      }

      break;
    }
  }
}

function _findKingCastles(b: Board, sp: Space, idx: number, out: Move[]) {
  // Special-case, if King, and king hasn't moved yet, check the same rank for Rooks that haven't moved, and then maybe
  // try castling:
  if (spaceHasMoved(sp)) return;

  const color = spaceGetColor(sp);
  const castles = b.current.castles;
  const kRank = castleMapGetFile(castles, color, true);
  const qRank = castleMapGetFile(castles, color, false);
  const rank = idx & 0xf0;

  if ((kRank & 0x8) === 0) {
    const kingDest = rank | 6;
    const rookFrom = rank | kRank;
    const rookDest = rank | 5;
    _tryCastle(
      b,
      out,
      createCastle(sp, idx, kingDest, b.get(rookFrom), rookFrom, rookDest),
    );
  }

  if ((qRank & 0x8) === 0) {
    const kingDest = rank | 2;
    const rookFrom = rank | qRank;
    const rookDest = rank | 3;
    _tryCastle(
      b,
      out,
      createCastle(sp, idx, kingDest, b.get(rookFrom), rookFrom, rookDest),
    );
  }
}

// Pawns are odd, so handle them separately:
function _pawnMoves(
  b: Board,
  sp: Space,
  idx: number,
  out: Move[],
) {
  const color = spaceGetColor(sp);
  const enemy = 1 - color;

  const dir = color === COLOR_WHITE ? 1 : -1;

  const oneUp = idx + 16 * dir;
  const twoUp = idx + 32 * dir;

  // !?! Should have promoted...
  if (oneUp & 0x88) return out;

  // One up being ok, but two up being bad means oneUp is the last rank:
  const promote = (twoUp & 0x88) ? PIECETYPE_QUEEN : 0;

  // Try to move one up:
  if (b.get(oneUp) === SPACE_EMPTY) {
    _tryPushMove(
      b,
      out,
      createFullMove(sp, idx, oneUp, 0, 0, 0, 0, 0, promote, 0),
    );

    // If we haven't moved before, we can attempt 2 up:
    if (
      !spaceHasMoved(sp) && (twoUp & 0x88) === 0 &&
      b.get(twoUp) === SPACE_EMPTY
    ) {
      _tryPushMove(
        b,
        out,
        createFullMove(sp, idx, twoUp, 0, 0, 0, 0, 0, 0, oneUp),
      );
    }
  }

  // Captures to the left and right. This includes en passants:
  const ep = b.current.ep;

  for (const step of PAWN_CAPS) {
    const coord = oneUp + step;
    if (coord & 0x88) continue;

    const spot = b.get(coord);
    if (coord === ep) {
      const epCoord = idx + step;
      const epSpot = b.get(epCoord);
      _tryPushMove(
        b,
        out,
        createFullMove(sp, idx, coord, epSpot, epCoord, 0, 0, 0, promote, 0),
      );
    } else if (spot !== SPACE_EMPTY && spaceGetColor(spot) === enemy) {
      _tryPushMove(
        b,
        out,
        createFullMove(sp, idx, coord, spot, coord, 0, 0, 0, promote, 0),
      );
    }
  }

  return out;
}

// Will push the candidate move to the output array IF it doesn't expose your king to check. Also will populate
// a few extra details if asked. (Since we've already done the move...)
function _tryPushMove(b: Board, out: Move[], move: Move) {
  const color = spaceGetColor(move.what);

  b.save();

  performMove(b, move);
  if (!kingInDanger(b, color)) {
    out.push(move);
  }

  b.restore();
}

// Will attempt a castle maneuver. Will do the normal checks: Nothing in the way, and nothing checking king en route:
function _tryCastle(b: Board, out: Move[], move: Move) {
  const color = spaceGetColor(move.what);

  // Every spot in the travel must be empty, apart from the King and Rook:
  const min = Math.min(
    move.castleRookFrom,
    move.castleRookDest,
    move.from,
    move.dest,
  );
  const max = Math.max(
    move.castleRookFrom,
    move.castleRookDest,
    move.from,
    move.dest,
  );
  for (let idx = min; idx <= max; idx++) {
    if (idx === move.from || idx === move.castleRookFrom) {
      continue;
    }
    const sp = b.get(idx);
    if (sp !== SPACE_EMPTY) {
      return;
    }
  }

  // No spot in the King's travel can be under attack.
  b.save();

  // Blank both the rook and king:
  b.set(move.from, SPACE_EMPTY);
  b.set(move.castleRookFrom, SPACE_EMPTY);

  // Note: kingInDanger actually supports duplicate kings, so create Kings wherever we want to check:
  const kingLow = Math.min(move.from, move.dest);
  const kingHigh = Math.max(move.from, move.dest);
  for (let idx = kingLow; idx <= kingHigh; idx++) {
    b.set(idx, move.what);
  }

  const hasDanger = kingInDanger(b, color);
  b.restore();

  if (hasDanger) return;

  _tryPushMove(b, out, move);
}
