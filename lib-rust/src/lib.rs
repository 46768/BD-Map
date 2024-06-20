mod utils;
struct AStarCoordinate {
    x: i32,
    y: i32,
}

fn dist (p0: AStarCoordinate, p1: AStarCoordinate) -> u32 {
    let x: f32 = (((p0.x - p1.x) * (p0.x - p1.x))+((p0.y - p1.y) * (p0.y - p1.y))) as f32;

    let x_half: f32 = x * 0.5;
    let i: u32 = x.to_bits();
    let mut y: f32 = f32::from_bits(0x5f3759df - (i >> 1)); //What the flip
    y *= 1.5 - (x_half * y * y);
    10 * (y * x) as u32
}

fn get_smallest_value_idx (v: Vec<u32>) -> usize {
    let mut res_idx: usize = 0;
    for (idx, val) in v.iter().enumerate() {
        if val < &v[res_idx] {
            res_idx = idx;
        }
    }
    res_idx
}

use std::f32::INFINITY;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, lib-rust!");
}