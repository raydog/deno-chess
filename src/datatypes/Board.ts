import { Space, SPACE_EMPTY } from "./Space.ts";
import { assert } from "../logic/assert.ts";
import { Coord } from "./Coord.ts";
import { Color } from "./Color.ts";

type Layer = {
  board: Uint32Array,
  clock: number,
  moveNum: number,
};

/**
 * Internal representation of a Board. Basically 64 integers, with a few extra bells-n-whistles.
 * This will be translated into a more public-friendly representation in the future.
 */
export class Board {
  
  #layerIdx = 0;
  #layers: Layer[] = [newLayer()];
  #current: Layer = this.#layers[0];

  /**
   * Set a single space in the board.
   * 
   * @param idx 
   * @param space 
   */
  set(idx: Coord, space: Space) {
    assert(idx >= 0 && idx < 64, "Invalid set() coord");
    this.#current.board[idx] = space;
  }

  /**
   * Get the value of a single space in the board.
   * 
   * @param idx 
   * @returns 
   */
  get(idx: Coord): Space {
    assert(idx >= 0 && idx < 64, "Invalid get() coord");
    return this.#current.board[idx];
  }

  /**
   * Increments the half-move clock.
   */
  incrClock() {
    this.#current.clock++;
  }

  /**
   * Reset the half-move clock.
   */
  resetClock() {
    this.#current.clock = 0;
  }

  /**
   * Increment the current move number.
   */
  incrMoveNum() {
    this.#current.moveNum++;
  }

  /**
   * Return the half-move clock.
   * 
   * @returns 
   */
  getClock(): number {
    return this.#current.clock;
  }

  /**
   * Return the current move number.
   * 
   * @returns 
   */
  getMoveNum(): number {
    return this.#current.moveNum;
  }

  /**
   * Add a new overlay. This overlay will absorb set()'s, and get()'s take them into account. This allows us to easily
   * undo actions.
   */
  save() {
    const idx = ++this.#layerIdx;
    if (idx === this.#layers.length) {
      this.#layers.push(newLayer());
    }
    this.#current = this.#layers[idx];
    copyLayer(this.#layers[idx-1], this.#current);
  }

  /**
   * Remove the top-most overlay. This has the effect of reverting all changes since that overlay was pushed.
   */
  restore() {
    if (this.#layerIdx > 0) {
      const idx = --this.#layerIdx;
      this.#current = this.#layers[idx];
    }
  }
}

function newLayer(): Layer {
  return {
    board: new Uint32Array(8 * 8).fill(SPACE_EMPTY),
    clock: 0,
    moveNum: 1,
  };
}

function copyLayer(src: Layer, dest: Layer) {
  dest.board.set(src.board);
  dest.clock = src.clock;
  dest.moveNum = src.moveNum;
}
