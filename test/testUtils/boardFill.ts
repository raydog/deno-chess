import { Board } from "../../src/datatypes/Board.ts";
import { Space } from "../../src/datatypes/Space.ts";

export function boardFill(b: Board, space: Space) {
  for (let i = 0; i < 64; i++) {
    b.set(i, space);
  }
}
