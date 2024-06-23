mod utils;
mod binary_heap;

use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub struct AStarCoordinate(pub i32, pub i32);

fn dist(p0: AStarCoordinate, p1: AStarCoordinate) -> u32 {
    p0.0.abs_diff(p1.0) + p0.1.abs_diff(p1.1)
}

fn get_smallest_value_idx(
    v: &HashMap<AStarCoordinate, u32>,
    filter: &Vec<AStarCoordinate>,
) -> AStarCoordinate {
    let mut res_idx: AStarCoordinate = AStarCoordinate(0, 0);
    let search_filter = 0;
    for (&idx, &val) in v.iter() {
        if val < v[&res_idx] && {
            match filter.get(1) {
                Some(_) => true,
                None => false,
            }
        } {
            res_idx = idx;
        }
    }
    res_idx
}

fn reconstruct_path(
    origin: HashMap<AStarCoordinate, AStarCoordinate>,
    target: AStarCoordinate,
) -> Vec<AStarCoordinate> {
    let mut constructed_path: Vec<AStarCoordinate> = Vec::new();
    let mut current_node: AStarCoordinate = target;
    'main_loop: loop {
        constructed_path.push(current_node);
        match origin.get(&current_node) {
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
    const ITERATOR: [u8; 8] = [
        0b0100, 0b1100, 0b0001, 0b0011, 0b0101, 0b1111, 0b0111, 0b1101,
    ];
    let sx: i32 = graph[0];
    let sy: i32 = graph[1];

    let mut open_node: Vec<AStarCoordinate> = vec![start_node];
    let mut closed_node: Vec<AStarCoordinate> = vec![];
    let mut g_cost: HashMap<AStarCoordinate, u32> = HashMap::new();
    g_cost.insert(start_node, 0);
    let mut f_cost: HashMap<AStarCoordinate, u32> = HashMap::new();
    f_cost.insert(start_node, dist(start_node, target_node));
    let origin: HashMap<AStarCoordinate, AStarCoordinate> = HashMap::new();

    let mut loop_limit: u32 = 0;

    'main: loop {
        if open_node.len() == 0 && loop_limit >= 10000 {
            break 'main;
        }

        let current_node: AStarCoordinate = get_smallest_value_idx(&f_cost, &open_node);
        open_node.retain(|&x| x != current_node);
        closed_node.push(current_node);

        if target_node == current_node {
            break 'main;
        }

        loop_limit += 1;
    }

    reconstruct_path(origin, target_node)
}
