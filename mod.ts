import { renderBoardForConsole } from "./src/logic/renderBoard.ts";
import { startGame } from "./src/logic/startGame.ts";

const board = startGame();
console.log(renderBoardForConsole(board));
