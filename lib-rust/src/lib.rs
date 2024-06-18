mod utils;
struct AStarCoordinate {
    x: i32,
    y: i32,
}

fn dist (p0: AStarCoordinate, p1: AStarCoordinate) {
    let x: f32 = (((p0.x - p1.x) * (p0.x - p1.x))+((p0.y - p1.y) * (p0.y - p1.y)));

    let x_half: f32 = (dx2+dy2) * 0.5;
    let i: u32 = x.to_bits();
    let mut y: f32 = f32::from_bits(0x5f3759df - (i >> 1)); //What the flip
    y *= 1.5 - (x_half * y * y);
    10 * y * x
}

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, lib-rust!");
}