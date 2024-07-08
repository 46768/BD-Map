/* tslint:disable */
/* eslint-disable */
/**
* @param {Int32Array} graph
* @param {AStarCoordinate} start_node
* @param {AStarCoordinate} target_node
* @returns {(AStarCoordinate)[]}
*/
export function a_star(graph: Int32Array, start_node: AStarCoordinate, target_node: AStarCoordinate): (AStarCoordinate)[];
/**
*/
export class AStarCoordinate {
  free(): void;
/**
* @param {number} f0
* @param {number} f1
*/
  constructor(f0: number, f1: number);
/**
*/
  0: number;
/**
*/
  1: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_astarcoordinate_free: (a: number) => void;
  readonly __wbg_get_astarcoordinate_0: (a: number) => number;
  readonly __wbg_set_astarcoordinate_0: (a: number, b: number) => void;
  readonly __wbg_get_astarcoordinate_1: (a: number) => number;
  readonly __wbg_set_astarcoordinate_1: (a: number, b: number) => void;
  readonly astarcoordinate_new: (a: number, b: number) => number;
  readonly a_star: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
