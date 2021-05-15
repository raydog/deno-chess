import { Space } from "./Space.ts";
import { assert } from "../logic/assert.ts";
import { Coord } from "./Coord.ts";
import { Color } from "./Color.ts";
import { Turn } from "./Turn.ts";

type StringFormat =
  | "FEN";

/**
 * Internal representation of a Board. Basically 64 integers, with a few extra bells-n-whistles.
 * This will be translated into a more public-friendly representation in the future.
 */
export class Board {

  // TODO: int8 array.

  #spaces: Space[] = Array(8 * 8).fill(0);

  #overlays: Space[][] = [];

  #turns: Turn[] = [];

  set(idx: Coord, space: Space) {
    assert(idx >= 0 && idx < 64, "Invalid set() coord");
    if (this.#overlays.length) {
      this.#overlays[this.#overlays.length-1][idx] = space;
    } else {
      this.#spaces[idx] = space;
    }
  }

  get(idx: Coord): Space {
    assert(idx >= 0 && idx < 64, "Invalid get() coord");
    for (let overlay=this.#overlays.length-1; overlay>=0; overlay--) {
      const spot = this.#overlays[overlay][idx];
      if (spot >= 0) { return spot; }
    }
    return this.#spaces[idx];
  }

  /**
   * Add a new overlay. This overlay will absorb set()'s, and get()'s take them into account. This allows us to easily
   * undo actions.
   */
  pushOverlay() {
    this.#overlays.push(Array(8 * 8).fill(-1));
  }

  /**
   * Remove the top-most overlay. This has the effect of reverting all changes since that overlay was pushed.
   */
  popOverlay() {
    this.#overlays.pop();
  }


  getTurnColor(): Color {
    if (!this.#turns.length) { return Color.White; }
    const cur = this.#turns[this.#turns.length-1];
    return cur.black ? Color.White : Color.Black;
  }

  getHalfmoveClock(): number {
    return 0; // TODO.
  }

  getFullmoveClock(): number {
    if (!this.#turns.length) { return 1; }
    const cur = this.#turns[this.#turns.length-1];
    return cur.black ? this.#turns.length + 1 : this.#turns.length;
  }

  // toString(): string {

  // }
}
