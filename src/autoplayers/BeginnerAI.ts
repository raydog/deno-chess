import { Board } from "../datatypes/Board.ts";
import { ChessGame } from "../datatypes/ChessGame.ts";
import { Color, COLOR_BLACK, COLOR_WHITE } from "../datatypes/Color.ts";
import { coordToAN } from "../datatypes/Coord.ts";
import { GAMESTATUS_CHECKMATE } from "../datatypes/GameStatus.ts";
import { Move } from "../datatypes/Move.ts";
import { PieceType, PIECETYPE_BISHOP, PIECETYPE_KING, PIECETYPE_KNIGHT, PIECETYPE_PAWN, PIECETYPE_QUEEN, PIECETYPE_ROOK } from "../datatypes/PieceType.ts";
import { spaceGetColor, spaceGetType } from "../datatypes/Space.ts";
import { spaceIsEmpty } from "../datatypes/Space.ts";
import { boardRenderASCII } from "../logic/boardRenderASCII.ts";
import { boardFromFEN } from "../logic/FEN/boardFromFEN.ts";
import { listAllValidMoves } from "../logic/listValidMoves.ts";
import { checkMoveResults } from "../logic/moveResults.ts";
import { performMove } from "../logic/performMove.ts";
import { mateScore, MiniMaxScore, moveScore, scoreCompare, scoreToString } from "./utils/miniMaxScore.ts";

type TurnColor = "white" | "black";

function _parseTurnColor(color: TurnColor): Color {
  return (color === "white") ? COLOR_WHITE : COLOR_BLACK;
}

export class BeginnerAI {
  
  // Game is what we use to interface with the user's game.
  #game: ChessGame;

  // These are scratch spaces for our work:
  #color: Color;
  #board: Board = new Board();

  constructor(game: ChessGame, color: Color) {
    this.#game = game;
    this.#color = color;
  }

  static NewForGame(game: ChessGame, color: TurnColor): BeginnerAI {
    return new BeginnerAI(game, _parseTurnColor(color));
  }

  takeTurn() {
    const board = this.#board;
    const status = this.#game.getStatus();
    if (status.state !== "active") {
      console.warn("Game over");
      return;
    }

    const turn = _parseTurnColor(status.turn);
    if (turn !== this.#color) {
      console.warn("Not my turn...");
      return;
    }

    // TODO: Faster.
    const fen = this.#game.toFENString();
    boardFromFEN(fen, board);

    // console.log(boardRenderASCII(board, false));
    const start = Date.now();

    const best = (turn === COLOR_WHITE)
      ? descendWhite(board, 2)
      : descendBlack(board, 2);
    
    if (!best.bestMoves) { throw new Error("Need move list"); }
    
    const move = best.bestMoves[Math.floor(Math.random() * best.bestMoves.length)];
    
    console.log(
      "Best (%s) Num Moves (%d) in %d ms: %s",
      scoreToString(best.score),
      best.bestMoves.length,
      Date.now() - start,
      coordToAN(move.from) + coordToAN(move.dest),
    );

    this.#game.move(coordToAN(move.from) + coordToAN(move.dest), "Q");
  }
}


type MinMaxResult = { score: MiniMaxScore, bestMoves?: Move[] };



// White tries to maximize the score:
function descendWhite(board: Board, maxDepth: number, curDepth = 0): MinMaxResult {

  const res = checkMoveResults(board, COLOR_BLACK);
  if (res.newGameStatus === GAMESTATUS_CHECKMATE) {
    return { score: mateScore(-curDepth) };
  }

  if (curDepth >= maxDepth) { return { score: moveScore(rateBoard(board)) }; }

  let best: MiniMaxScore = mateScore(-1);
  let bestMoves: Move[] = [];

  for (const move of listAllValidMoves(board, COLOR_WHITE)) {
    board.save();

    performMove(board, move);
    
    const { score } = descendBlack(board, maxDepth, curDepth + 1);
    const compare = scoreCompare(best, score);

    if (compare > 0) {
      best = score;
      bestMoves = [move];

    } else if (compare === 0) {
      bestMoves.push(move);
    }

    board.restore();
  }

  return curDepth ? { score: best, } : { score: best, bestMoves };
}

// Black tries to minimize the score:
function descendBlack(board: Board, maxDepth: number, curDepth = 0): MinMaxResult {

  const res = checkMoveResults(board, COLOR_WHITE);
  if (res.newGameStatus === GAMESTATUS_CHECKMATE) {
    return { score: mateScore(curDepth) };
  }

  if (curDepth >= maxDepth) { return { score: moveScore(rateBoard(board)) }; }

  let best = mateScore(1);
  let bestMoves: Move[] = [];

  for (const move of listAllValidMoves(board, COLOR_BLACK)) {
    board.save();

    performMove(board, move);

    const { score } = descendWhite(board, maxDepth, curDepth + 1);
    const compare = scoreCompare(best, score);

    if (compare < 0) {
      best = score;
      bestMoves = [move];

    } else if (compare === 0) {
      bestMoves.push(move);
    }

    board.restore();
  }

  return curDepth ? { score: best, } : { score: best, bestMoves };
}

// Rate a board. + benefits white. - benefits black.
function rateBoard(board: Board): number {
  const material = _countMaterial(board);
  const mobility = _countMobility(board);

  return material + 0.25 * mobility;
}

function _countMaterial(board: Board) {
  let net = 0;

  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      
      const idx = rank | file;
      const spot = board.get(idx);

      if (spaceIsEmpty(spot)) { continue; }

      const value = _pieceValue(spaceGetType(spot));
      if (spaceGetColor(spot) === COLOR_WHITE) {
        net += value;
      } else {
        net -= value;
      }

    }
  }

  return net;
}

function _countMobility(board: Board) {
  return listAllValidMoves(board, COLOR_WHITE).length - listAllValidMoves(board, COLOR_BLACK).length;
}

function _pieceValue(type: PieceType): number {
  switch (type) {
    case PIECETYPE_PAWN: return 1;
    case PIECETYPE_KNIGHT: return 3;
    case PIECETYPE_BISHOP: return 3;
    case PIECETYPE_ROOK: return 5;
    case PIECETYPE_QUEEN: return 9;
    case PIECETYPE_KING: return 200;
    default: return 0;
  }
}