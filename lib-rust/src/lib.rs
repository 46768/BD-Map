mod utils;

use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
#[allow(dead_code)]
pub struct AStarCoordinate(pub i32, pub i32);

fn convert_tuple(t: AStarCoordinate) -> (i32, i32) {
    (t.0, t.1)
}

fn dist(p0: AStarCoordinate, p1: AStarCoordinate) -> u32 {
    let x: f32 = (((p0.0 - p1.0) * (p0.0 - p1.0)) + ((p0.1 - p1.1) * (p0.1 - p1.1))) as f32;

    let x_half: f32 = x * 0.5;
    let i: u32 = x.to_bits();
    let mut y: f32 = f32::from_bits(0x5f3759df - (i >> 1)); //What the flip
    y *= 1.5 - (x_half * y * y); //Newton's method 1st iteration
    10 * (y * x) as u32
}

fn get_smallest_value_idx(v: &Vec<u32>) -> usize {
    let mut res_idx: usize = 0;
    for (idx, val) in v.iter().enumerate() {
        if val < &v[res_idx] {
            res_idx = idx;
        }
    }
    res_idx
}

fn reconstruct_path(origin: HashMap<(i32, i32), AStarCoordinate>, target: AStarCoordinate) -> Vec<(i32, i32)> {
    let mut constructed_path: Vec<(i32, i32)> = Vec::new();
    let mut current_node: AStarCoordinate = target;
    'main_loop: loop {
        constructed_path.push(convert_tuple(current_node));
        match origin.get(&convert_tuple(current_node)) {
            None => break 'main_loop,
            Some(&set_value) => {
                current_node = set_value;
            }
        }
    }

    constructed_path.reverse();
    constructed_path
}

#[wasm_bindgen]
extern "C" {}

#[wasm_bindgen]
pub fn a_star(
    graph: Vec<i32>,
    start_node: AStarCoordinate,
    target_node: AStarCoordinate,
) -> Vec<AStarCoordinate> {
    let sx: i32 = {
        let mut res: i32 = -1;
        match graph.get(0) {
            Some(&x) => {
                res = x;
            }
            None => print!("Somethings Wrong With graph, graph[0] is None"),
        }
        res
    };
    let sy: i32 = {
        let mut res: i32 = -1;
        match graph.get(1) {
            Some(&y) => {
                res = y;
            }
            None => print!("Somethings Wrong With graph, graph[1] is None"),
        }
        res
    };

    let mut open_node: Vec<AStarCoordinate> = vec![start_node];
    let mut closed_node: Vec<AStarCoordinate> = vec![];
    let mut g_cost = HashMap::new();
    g_cost.insert(start_node, 0);

    vec![AStarCoordinate(1, 2)]
}
