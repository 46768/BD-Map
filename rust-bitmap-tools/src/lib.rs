mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {}

pub fn bitmap_line(
    buffer: &mut [bool],
    x0: i32,
    y0: i32,
    x1: i32,
    y1: i32,
    sx: usize,
    bit_set: bool,
) {
    let dx = x0.abs_diff(x1) as i32;
    let dy = 0-((y0.abs_diff(y1)) as i32);
    let cx = if x0 < x1 {1} else {-1};
    let cy = if y0 < y1 {1} else {-1};
    let mut error = dx + dy;

    let mut x = x0;
    let mut y = y0;
    println!("x0: {} y0: {} x1: {} y1: {}", x0, y0, x1, y1);

    'main: loop {
        println!("x: {} y: {}", x, y);
        println!("x0==x1: {} y0==y1: {}", x==x1, y==y1);
        buffer[(x as usize) + ((y as usize) * sx)] = bit_set;
        if x == x1 && y == y1 {break 'main;}
        let e2 = 2* error;
        if e2 >= dy {
            if x0 == x1 {break 'main;}
            error = error + dy;
            x = x + cx;
        }
        if e2 <= dx {
            if y0 == y1 {break 'main;}
            error = error + dx;
            y = y + cy;
        }
    }
}

pub fn bitmap_fill(buffer: &mut [bool], sx: usize, sy: usize) {
    let mut draw_queue: Vec<usize> = Vec::new();
    let mut buffer_queue: Vec<usize> = Vec::new();
    let mut encountered: u32 = 0;

    let mut detected: bool  = false;
    let mut prev_detect: usize = 0;
    let mut current_detect: usize = 0;
    for idx in 0..sx*sy {
        if buffer[idx] {
            encountered = (encountered+1).min(2);
            prev_detect = current_detect;
            current_detect = idx;
            detected = !detected;
            
            println!("prev_y: {} current_y: {}", (prev_detect%sx), (current_detect%sx));
            if encountered%2 == 0 {
                println!("appending to main_queues");
                draw_queue.append(&mut buffer_queue);
            }
            continue;
        }

        if detected {
            println!("inserting into buffer_queue");
            buffer_queue.push(idx);
            println!("buffer_queue len: {}", buffer_queue.len())
        }
    }

    println!("main_queue len: {}", draw_queue.len());

    for draw_idx in draw_queue.iter() {
        buffer[*draw_idx] = true;
    }
}
