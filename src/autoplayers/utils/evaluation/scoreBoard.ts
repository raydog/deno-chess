import { Board } from "../../../core/datatypes/Board.ts";
import { COLOR_BLACK, COLOR_WHITE } from "../../../core/datatypes/Color.ts";
import { Coord } from "../../../core/datatypes/Coord.ts";
import { Move } from "../../../core/datatypes/Move.ts";
import {
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
} from "../../../core/datatypes/PieceType.ts";
import {
  SPACE_EMPTY,
  spaceGetColor,
  spaceGetType,
} from "../../../core/datatypes/Space.ts";
import { listAllValidMoves } from "../../../core/logic/listValidMoves.ts";
import { ScoreSettings } from "./ScoreSettings.ts";

// ZONES on the board, for quick lookup. Formatted as 0x88 so we can index with the same coordinate as the board:

// deno-fmt-ignore
const ZONES = [
  0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
  0b0100, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
  0b0100, 0b0000, 0b0010, 0b0010, 0b0010, 0b0010, 0b0000, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
  0b0100, 0b0000, 0b0010, 0b0001, 0b0001, 0b0010, 0b0000, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
  0b0100, 0b0000, 0b0010, 0b0001, 0b0001, 0b0010, 0b0000, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
  0b0100, 0b0000, 0b0010, 0b0010, 0b0010, 0b0010, 0b0000, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
  0b0100, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
  0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0b0100, 0, 0, 0, 0, 0, 0, 0, 0,
]

const FOCAL_CENTER = 1;
const OUTER_CENTER = 2;
const EDGE = 4;

/**
 * Returns a score for the given board.
 *
 * Based heavily on the ideas in this document:
 * [Little Chess Evaluation Compendium](http://www.winboardengines.de/doc/LittleChessEvaluationCompendium-2010-04-07.pdf)
 * as it's a fantastic resource. Many of the concepts are too complex for THIS simple of an evaluation engine, but some
 * were implemented...
 *
 * @param board
 * @param settings
 * @returns
 */
export function scoreBoard(
  board: Board,
  {
    PhaseOverride,
    Material,
    Mobility,
    PawnCenter,
    PawnCenterAttack,
    MinorCenter,
    QueenCenter,
    PieceCenterAttack,
    PieceOuterCenter,
    KingEndgameEdge,
    KingEndgameOuterCenter,
    KingEndgameCenter,
  }: ScoreSettings,
): number {
  const phase = PhaseOverride ?? _gamePhase(board);
  let net = 0;

  const whiteMoves = listAllValidMoves(board, COLOR_WHITE);
  const blackMoves = listAllValidMoves(board, COLOR_BLACK);

  const moveMap: { [c in Coord]: Move[] } = {};
  for (const move of whiteMoves) {
    moveMap[move.from] ??= [];
    moveMap[move.from].push(move);
  }
  for (const move of blackMoves) {
    moveMap[move.from] ??= [];
    moveMap[move.from].push(move);
  }

  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      const idx = rank | file;
      const spot = board.get(idx);

      if (spot === SPACE_EMPTY) continue;

      const type = spaceGetType(spot);
      const color = spaceGetColor(spot);
      const side = (color === COLOR_WHITE) ? 1 : -1;
      const moves = moveMap[idx] || [];

      // Raw material:
      net += side * Material[type];

      // General mobility (all phases)
      const mobilityMoves = (type === PIECETYPE_PAWN && moves.some((move) =>
          move.markEnPassant
        ))
        ? moves.length - 1
        : moves.length;

      net += side * mobilityMoves * Mobility[type];

      // Opening and midgame. Phase out in endgame:
      if (phase < 2) {
        const weight = Math.min(1, 2 - phase);

        // Presence in outer center
        if (ZONES[idx] & OUTER_CENTER) {
          net += side * weight * PieceOuterCenter;
        }

        if (type === PIECETYPE_PAWN) {
          // Presence in center:
          if (ZONES[idx] & FOCAL_CENTER) {
            const weight = 1 - phase;
            net += side * weight * PawnCenter;
          }

          // Center attacks:
          const pawnDir = (color === COLOR_WHITE) ? 0x10 : -0x10;
          const pawnRank = (idx + pawnDir) & 0x80, pawnFile = idx & 0x08;
          if (
            pawnRank >= 0x30 && pawnRank <= 0x40 &&
            pawnFile >= 2 && pawnFile <= 5
          ) {
            net += side * weight * PawnCenterAttack;
          }
        } else {
          // Presence in center
          if (ZONES[idx] & FOCAL_CENTER) {
            if (type === PIECETYPE_BISHOP || PIECETYPE_KNIGHT) {
              net += side * weight * MinorCenter;
            } else if (type === PIECETYPE_QUEEN) {
              net += side * weight * QueenCenter;
            }
          }

          for (const move of moves) {
            if (ZONES[move.dest] & FOCAL_CENTER) {
              // Center attacks
              net += side * weight * PieceCenterAttack;
            }
          }
        }
      } else {
        // Endgame
        const weight = Math.max(0, phase - 1);

        // King position:
        if (type === PIECETYPE_KING) {
          const zone = ZONES[idx];
          if (zone & EDGE) {
            net += side * weight * KingEndgameEdge;
          } else if (zone & OUTER_CENTER) {
            net += side * weight * KingEndgameOuterCenter;
          } else if (zone & FOCAL_CENTER) {
            net += side * weight * KingEndgameCenter;
          }
        }
      }
    }
  }

  return net;
}

const PHASE_MAP = [2, 2, 1.5, 1, 1, 1, 1, 0.5, 0];

// Game phase is defined by the minimum number of non-pawn pieces on the board for either side.
// Returns a number between 0 and 2 inclusive. (0 is opening, 1 is midgame, 2 is endgame, and floating points indicate
// a progression between phases for tapered evals...)
function _gamePhase(board: Board): number {
  let white = 0, black = 0;

  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      const idx = rank | file;
      const spot = board.get(idx);

      if (spot === SPACE_EMPTY) {
        continue;
      }

      const type = spaceGetType(spot);
      if (type === PIECETYPE_PAWN) {
        continue;
      }

      if (spaceGetColor(spot) === COLOR_WHITE) {
        white++;
      } else {
        black++;
      }
    }
  }

  const min = Math.min(white, black);
  if (min >= 8) return 0;
  if (min <= 1) return 2;
  return PHASE_MAP[min];
}
