pub mod binary_heap;
mod utils;

use binary_heap::BinaryHeap;
use std::collections::HashMap;
use std::collections::HashSet;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub struct AStarCoordinate(pub i32, pub i32);

#[inline]
fn derive_normal(i: i32, deriver: i32) -> i32 {
    (i & deriver) >> 2 * if ((i & deriver) >> 3) == 0 { 1 } else { -1 }
}

fn dist(p0: AStarCoordinate, p1: AStarCoordinate) -> i32 {
    p0.0.abs_diff(p1.0) as i32 + p0.1.abs_diff(p1.1) as i32
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
    const ITERATOR: [i32; 8] = [
        0b0100, 0b1100, 0b0001, 0b0011, 0b0101, 0b1111, 0b0111, 0b1101,
    ];
    const NORMAL: [i32; 2] = [1, -1];
    const UNDEFINED: (AStarCoordinate, i32) = (AStarCoordinate(0, 0), 2147483647);

    fn bubble_up_fn(l_idx: (AStarCoordinate, i32), p_idx: (AStarCoordinate, i32)) -> bool {
        l_idx.1 < p_idx.1
    }

    fn bubble_down_fn(
        c_idx: (AStarCoordinate, i32),
        c1_idx: Option<&(AStarCoordinate, i32)>,
        c2_idx: Option<&(AStarCoordinate, i32)>,
    ) -> (bool, bool) {
        let c1_val = match c1_idx {
            Some(&val) => val,
            None => UNDEFINED,
        };
        let c2_val = match c2_idx {
            Some(&val) => val,
            None => UNDEFINED,
        };

        (
            c_idx.1 > c1_val.1 || c_idx.1 > c2_val.1,
            if c1_val.1 > c2_val.1 { true } else { false },
        )
    }

    fn handle_option(inp: Option<(AStarCoordinate, i32)>) -> (AStarCoordinate, i32) {
        match inp {
            Some(val) => val,
            None => UNDEFINED,
        }
    }

    let sx: i32 = graph[0];
    let sy: i32 = graph[1];

    let mut closed_node: HashSet<AStarCoordinate> = HashSet::new();
    let mut g_cost: HashMap<AStarCoordinate, i32> = HashMap::new();
    g_cost.insert(start_node, 0);
    let mut f_cost: BinaryHeap<(AStarCoordinate, i32)> = BinaryHeap::new();
    f_cost.insert((start_node, dist(start_node, target_node)), &bubble_up_fn);
    let origin: HashMap<AStarCoordinate, AStarCoordinate> = HashMap::new();

    let mut loop_limit: i32 = 0;

    'main: loop {
        if f_cost.get_size() == 0 && loop_limit >= 10000 {
            break 'main;
        }

        let extracted_val: (AStarCoordinate, i32) = handle_option(f_cost.extract(&bubble_down_fn));
        let current_node: AStarCoordinate = extracted_val.0;
        closed_node.insert(current_node);

        if target_node == current_node {
            break 'main;
        }

        'neighbor_search: for &neighbor in ITERATOR.iter() {
            let n_x: i32 = current_node.0
                + ((neighbor & 0b0100) >> 2 * NORMAL[((neighbor & 0b1000) >> 3) as usize]);
            let n_y: i32 = current_node.1
                + ((neighbor & 0b0001) * NORMAL[((neighbor & 0b0010) >> 1) as usize]);
            let neighbor_coord: AStarCoordinate = AStarCoordinate(n_x, n_y);
            let graph_idx: i32 = graph[(2 + n_x + (n_y * sx)) as usize];
            if closed_node.contains(&neighbor_coord)
                || n_x >= sx
                || n_y >= sy
                || n_x < 0
                || n_y < 0
                || graph_idx == 0
            {
                continue 'neighbor_search;
            }
            let neighbor_g_cost: i32 = match g_cost.get(&neighbor_coord) {
                Some(&current_g_cost) => current_g_cost + dist(neighbor_coord, target_node),
                None => dist(start_node, neighbor_coord) + dist(neighbor_coord, target_node),
            };

            let neighbor_g_cost_in_array = match g_cost.get(&neighbor_coord) {
                Some(&g_cost) => g_cost,
                None => 2147483647,
            }

            if neighbor_g_cost < neighbor_g_cost_in_array {
                origin.insert(neighbor_coord, current_node);
                g_cost.insert(neighbor_coord, neighbor_g_cost);
                f_cost.insert((neighbor_coord, neighbor_g_cost), &bubble_up_fn);
            }
        }

        loop_limit += 1;
    }

    reconstruct_path(origin, target_node)
}
