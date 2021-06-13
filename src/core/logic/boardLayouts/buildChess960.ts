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

const PAWN_ROW = Array(8).fill(PIECETYPE_PAWN);

/**
 * Create a new Chess board, in the standard starting position.
 *
 * @returns A new board.
 */
export function buildChess960(): Board {
  
  const template: PieceType[] = Array(8).fill(0);

  // Bishops must be on alternate colors:
  template[randInt(4)*2] = PIECETYPE_BISHOP;
  template[randInt(4)*2+1] = PIECETYPE_BISHOP;

  // Queens and knights go wherever:
  placeAt(template, randInt(6), PIECETYPE_KNIGHT);
  placeAt(template, randInt(5), PIECETYPE_KNIGHT);
  placeAt(template, randInt(4), PIECETYPE_QUEEN);
  
  // King needs to be in-between rooks, so just fill the rest with R K R:
  const qRook = placeAt(template, 0, PIECETYPE_ROOK);
  const _king = placeAt(template, 0, PIECETYPE_KING);
  const kRook = placeAt(template, 0, PIECETYPE_ROOK);

  // Build the result:
  const out = new Board();
  
  setRow(out, COLOR_WHITE, 0x00, template);
  setRow(out, COLOR_WHITE, 0x10, PAWN_ROW);

  setRow(out, COLOR_BLACK, 0x60, PAWN_ROW);
  setRow(out, COLOR_BLACK, 0x70, template);

  out.current.castles = buildCastleMap(
    0x00 | qRook,
    0x00 | kRook,
    0x70 | qRook,
    0x70 | kRook,
  );
  out.putBoardHash(hashBoard(out));

  return out;
}

function setRow(b: Board, color: Color, start: Coord, pieces: PieceType[]) {
  for (let i = 0; i < 8; i++) {
    b.set(start | i, encodePieceSpace(pieces[i], color, false));
  }
}

// Return an int in [0, max):
function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

// Util: Places a PieceType at the Nth empty (0) space:
function placeAt(arr: PieceType[], num: number, type: PieceType): number {
  for (let i=0; i<8; i++) {
    if (arr[i] === 0 && num-- === 0) {
      arr[i] = type;
      return i;
    }
  }
  // Else, there weren't enough zeros:
  throw new Error("Chess960: Not enough spaces??");
}
