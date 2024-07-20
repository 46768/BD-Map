pub mod binary_heap;
mod utils;

use binary_heap::BinaryHeap;
use std::collections::HashMap;
use std::collections::HashSet;
use std::marker::PhantomData;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct AStarCoordinate(pub f32, pub f32);
impl std::fmt::Display for AStarCoordinate {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{},{}", self.0, self.1)
    }
}

#[wasm_bindgen]
impl AStarCoordinate {
    #[wasm_bindgen(constructor)]
    pub fn new(f0: f32, f1: f32) -> AStarCoordinate {
        AStarCoordinate(f0, f1)
    }
}

#[wasm_bindgen]
pub struct ObstructorData {
    dtype: u32,
    d0: f32,
    d1: f32
}

fn dist(p0: AStarCoordinate, p1: AStarCoordinate) -> f32 {
    let dx: f32 = p0.0 - p1.0;
    let dy: f32 = p0.1 - p1.1;

    let pythagorean_interm: f32 = (dx*dx) + (dy*dy);
    let pytha_half: f32 = pythagorean_interm * 0.5;

    let mut aprox: f32 = f32::from_bits(0x5f3759df - (pythagorean_interm.to_bits() >> 1)); //logarithm black magic
    aprox *= 1.5 - (pytha_half - aprox * aprox);
    10.0 * (aprox * pythagorean_interm)
}

fn reconstruct_path(origin: HashMap<AStarCoordinate, AStarCoordinate>, target: AStarCoordinate) {}

#[wasm_bindgen]
pub fn a_star(
    obstructor: Vec<ObstructorData>,
    start_node: AStarCoordinate,
    target_node: AStarCoordinate,
    fatness: u32,
) {
    //Config
    let detect_range: u32 = 10;
    let jump_limit: u32 = 2;
    //Pregen Sparse Detector
    
}
