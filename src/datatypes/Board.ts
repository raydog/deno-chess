import { Space, SPACE_EMPTY, } from "./Space.ts";
import { assert } from "../logic/assert.ts";
import { Coord } from "./Coord.ts";
import { Color } from "./Color.ts";
import { Turn } from "./Turn.ts";

/**
 * Internal representation of a Board. Basically 64 integers, with a few extra bells-n-whistles.
 * This will be translated into a more public-friendly representation in the future.
 */
export class Board {

  #layerIdx = 0;
  #layers: Uint32Array[] = [new Uint32Array(8 * 8).fill(SPACE_EMPTY)];

  // TODO: Maybe in game?
  #turns: Turn[] = [];

  set(idx: Coord, space: Space) {
    assert(idx >= 0 && idx < 64, "Invalid set() coord");
    this.#layers[this.#layerIdx][idx] = space;
  }

  get(idx: Coord): Space {
    assert(idx >= 0 && idx < 64, "Invalid get() coord");
    return this.#layers[this.#layerIdx][idx];
  }

  /**
   * Add a new overlay. This overlay will absorb set()'s, and get()'s take them into account. This allows us to easily
   * undo actions.
   */
  save() {
    this.#layerIdx++;
    if (this.#layerIdx === this.#layers.length) {
      this.#layers.push(new Uint32Array(8 * 8));
    }
    this.#layers[this.#layerIdx].set(this.#layers[this.#layerIdx - 1]);
  }

  /**
   * Remove the top-most overlay. This has the effect of reverting all changes since that overlay was pushed.
   */
  restore() {
    if (this.#layerIdx > 0) {
      this.#layerIdx--;
    }
  }

  getTurnColor(): Color {
    if (!this.#turns.length) return Color.White;
    const cur = this.#turns[this.#turns.length - 1];
    return cur.black ? Color.White : Color.Black;
  }

  getHalfmoveClock(): number {
    return 0; // TODO.
  }

  getFullmoveClock(): number {
    if (!this.#turns.length) return 1;
    const cur = this.#turns[this.#turns.length - 1];
    return cur.black ? this.#turns.length + 1 : this.#turns.length;
  }

  // toString(): string {

  // }
}
