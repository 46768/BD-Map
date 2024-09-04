mod binary_heap;
mod utils;

use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
#[derive(Copy, Clone)]
struct AStarCoord (pub f32, pub f32);

#[wasm_bindgen]
struct AStarNode (pub AStarCoord, pub Vec<AStarCoord>);

fn hueristic(start: AStarCoord, end: AStarCoord) {}

pub fn a_star(graph: Vec<AStarNode>) {}
