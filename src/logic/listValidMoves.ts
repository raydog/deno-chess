import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import {
  Space,
  spaceEnPassant,
  spaceGetColor,
  spaceGetType,
  spaceHasData,
  spaceHasMoved,
  spaceIsEmpty,
} from "../datatypes/Space.ts";
import { assert } from "./assert.ts";
import { PieceType } from "../datatypes/PieceType.ts";
import { buildCoord, Coord, parseCoord } from "../datatypes/Coord.ts";
import {
  createFullMove,
  createSimpleCapture,
  createSimpleMove,
  Move,
} from "../datatypes/Move.ts";
import { performMove } from "./performMove.ts";
import { kingInDanger } from "./kingInDanger.ts";
import { debugBoard } from "../../test/testUtils/debugBoard.ts";

type Step = [x: number, y: number];

// Pre-compiled lists of moves, since most moves are similar:
const BISHOP_DIRS: Step[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ROOK_DIRS: Step[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const QUEEN_DIRS: Step[] = [...ROOK_DIRS, ...BISHOP_DIRS];
const KING_DIRS: Step[] = [...QUEEN_DIRS];
const KNIGHT_DIRS: Step[] = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [-1, 2],
  [1, -2],
  [-1, -2],
];

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
  fullMoves = false,
): Move[] {
  const out: Move[] = [];
  for (let idx = 0; idx < 64; idx++) {
    const sp = b.get(idx);
    if (spaceHasData(sp) && !spaceIsEmpty(sp) && spaceGetColor(sp) === color) {
      out.push(...listValidMoves(b, idx, fullMoves));
    }
  }
  return out;
}

/**
 * Will enumerate all moves for the piece on the given space on the given board. Space **must** contain a piece.
 *
 * Will check the board to see if castles or en passant are possible. Will also respect checks, so pieces can be pinned,
 * or moves will be restricted if king is currently in check.
 */
export function listValidMoves(
  b: Board,
  idx: Coord,
  fullMoves = false,
): Move[] {
  const sp = b.get(idx);

  assert(spaceHasData(sp), "Listing moves of null space");
  assert(!spaceIsEmpty(sp), "Listing moves of empty space");

  switch (spaceGetType(sp)) {
    // Slidey pieces:
    case PieceType.Bishop:
      return _findMoves(b, sp, idx, BISHOP_DIRS, 8, fullMoves);
    case PieceType.Rook:
      return _findMoves(b, sp, idx, ROOK_DIRS, 8, fullMoves);
    case PieceType.Queen:
      return _findMoves(b, sp, idx, QUEEN_DIRS, 8, fullMoves);

    // Steppy pieces:

    case PieceType.Knight:
      return _findMoves(b, sp, idx, KNIGHT_DIRS, 1, fullMoves);
    case PieceType.King:
      return _findMoves(b, sp, idx, KING_DIRS, 1, fullMoves);

    // Other:

    case PieceType.Pawn:
      return _pawnMoves(b, sp, idx, fullMoves);
  }
}

// Util to extract find legit moves:
function _findMoves(
  b: Board,
  sp: Space,
  idx: number,
  dirs: Step[],
  maxDist: number,
  fullMoves: boolean,
): Move[] {
  const out: Move[] = [];

  const [file, rank] = parseCoord(idx);
  const color = spaceGetColor(sp);

  for (const [dx, dy] of dirs) {
    for (let dist = 1; dist <= maxDist; dist++) {
      // Offset the correct amount, and reject early if out of bounds:
      const x = file + dx * dist, y = rank + dy * dist;
      if (x < 0 || x >= 8 || y < 0 || y >= 8) break;

      // Reconvert to index, both for both board access and for possible output:
      const newIdx = buildCoord(x, y);
      const newSp = b.get(newIdx);

      const spotEmpty = spaceIsEmpty(newSp);
      const spotColor = spaceGetColor(newSp);

      // If empty, we could either stop here or continue:
      if (spotEmpty) {
        _tryPushMove(b, out, createSimpleMove(sp, idx, newIdx), fullMoves);
        continue;
      }

      // If an enemy, then we can capture. But no matter what, we can't keep going in this direction:
      if (spotColor === 1 - color) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, newIdx, newSp, newIdx),
          fullMoves,
        );
      }

      break;
    }
  }

  return out;
}

// Pawns are odd, so handle them separately:
function _pawnMoves(
  b: Board,
  sp: Space,
  idx: number,
  fullMoves: boolean,
): Move[] {
  const ourColor = spaceGetColor(sp);
  const otherColor = 1 - ourColor;

  const dir = ourColor === Color.White ? 1 : -1;
  const out: Move[] = [];

  const [file, rank] = parseCoord(idx);

  // Note: While reaching our boundary would mean promotion, and so pawns don't normally need bound-checking on the
  // ranks, we do so anyways because enh.
  if (rank >= 7 || rank <= 0) return out;

  const oneUp = idx + dir * 8;
  const twoUp = idx + dir * 16;

  // Try to move one up:
  if (oneUp >= 0 && oneUp < 64) {
    if (spaceIsEmpty(b.get(oneUp))) {
      _tryPushMove(b, out, createSimpleMove(sp, idx, oneUp), fullMoves);
    }
  }

  // If we haven't moved before, we can attempt 2 up:
  if (twoUp >= 0 && twoUp < 64) {
    if (
      !spaceHasMoved(sp) && spaceIsEmpty(b.get(oneUp)) &&
      spaceIsEmpty(b.get(twoUp))
    ) {
      _tryPushMove(
        b,
        out,
        createFullMove(sp, idx, twoUp, 0, 0, 0, 0, 0, 0, true),
        fullMoves,
      );
    }
  }

  // Captures to the left and right. This includes en passants:
  if (file > 0) {
    const coord = buildCoord(file - 1, rank + dir);
    const spot = b.get(coord);
    if (spaceIsEmpty(spot)) {
      const adjCoord = buildCoord(file - 1, rank);
      const adjSpot = b.get(adjCoord);
      if (
        !spaceIsEmpty(adjSpot) && spaceEnPassant(adjSpot) &&
        spaceGetColor(adjSpot) === otherColor
      ) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, coord, adjSpot, adjCoord),
          fullMoves,
        );
      }
    } else {
      if (spaceGetColor(spot) === otherColor) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, coord, spot, coord),
          fullMoves,
        );
      }
    }
  }

  if (file < 7) {
    const coord = buildCoord(file + 1, rank + dir);
    const spot = b.get(coord);
    if (spaceIsEmpty(spot)) {
      const adjCoord = buildCoord(file + 1, rank);
      const adjSpot = b.get(adjCoord);
      if (
        !spaceIsEmpty(adjSpot) && spaceEnPassant(adjSpot) &&
        spaceGetColor(adjSpot) === otherColor
      ) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, coord, adjSpot, adjCoord),
          fullMoves,
        );
      }
    } else {
      if (spaceGetColor(spot) === otherColor) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, coord, spot, coord),
          fullMoves,
        );
      }
    }
  }

  return out;
}

function _tryPushMove(b: Board, out: Move[], move: Move, fullMoves: boolean) {
  const color = spaceGetColor(move.what);

  b.pushOverlay();

  performMove(b, move);
  if (!kingInDanger(b, color)) {
    // This is a valid move, so spend the time to see if this move delivers check:
    if (fullMoves) {
      const enemy: Color = 1 - color;
      move.check = kingInDanger(b, enemy);
      // TODO: Fork this into a version that DOESN'T allocate an array of objects, and can short-circuit a bool:
      move.enemyHasMove = listAllValidMoves(b, enemy, false).length > 0;
    }
    out.push(move);
  }

  // console.log("\n\n%s\n%s", JSON.stringify(move), debugBoard(b, []));

  b.popOverlay();
}
