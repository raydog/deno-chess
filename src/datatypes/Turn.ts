import { Move } from "./Move.ts";

export class Turn {
  
  white: Move;
  black: Move | null = null;

  constructor (readonly num: number, white: Move) {
    this.white = white;
  }
}
