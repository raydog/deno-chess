import { Board } from "../../datatypes/Board.ts";
import { buildCastleMap } from "../../datatypes/CastleMap.ts";
import { Color, COLOR_BLACK, COLOR_WHITE } from "../../datatypes/Color.ts";
import { Coord } from "../../datatypes/Coord.ts";
import {
  PieceType,
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../../datatypes/PieceType.ts";
import { encodePieceSpace } from "../../datatypes/Space.ts";
import { hashBoard } from "../hashBoard.ts";

const BACK_ROW = [
  PIECETYPE_ROOK,
  PIECETYPE_KNIGHT,
  PIECETYPE_BISHOP,
  PIECETYPE_QUEEN,
  PIECETYPE_KING,
  PIECETYPE_BISHOP,
  PIECETYPE_KNIGHT,
  PIECETYPE_ROOK,
];
const PAWN_ROW = Array(8).fill(PIECETYPE_PAWN);

/**
 * Create a new Chess board, in the standard starting position.
 *
 * @returns A new board.
 */
export function buildStandardBoard(): Board {
  const out = new Board();

  _setRow(out, COLOR_WHITE, 0x00, BACK_ROW);
  _setRow(out, COLOR_WHITE, 0x10, PAWN_ROW);

  _setRow(out, COLOR_BLACK, 0x60, PAWN_ROW);
  _setRow(out, COLOR_BLACK, 0x70, BACK_ROW);

  out.current.castles = buildCastleMap(0x00, 0x07, 0x70, 0x77);
  out.putBoardHash(hashBoard(out));

  return out;
}

function _setRow(b: Board, color: Color, start: Coord, pieces: PieceType[]) {
  for (let i = 0; i < 8; i++) {
    b.set(start + i, encodePieceSpace(pieces[i], color, false));
  }
}
