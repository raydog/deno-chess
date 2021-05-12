import { Move } from "./Move.ts";

export class Turn {
  white: Move | null = null;
  black: Move | null = null;

  constructor (readonly num: number) {}
}
