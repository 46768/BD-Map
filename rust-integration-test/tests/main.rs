#[cfg(test)]
mod tests {
    use rust_a_star::a_star;
    use rust_a_star::AStarCoordinate;

    use rust_bitmap_tools::bitmap_line;

    use image::{ImageBuffer, Rgb};

    const SX: usize = 100;
    const SY: usize = 100;

    #[test]
    fn main() {
        let mut buffer: Box<[i32]> = vec![1; SX * SY].into_boxed_slice();
        let mut a_star_buffer: Vec<i32> = vec![SX as i32, SY as i32];

        //bitmap_line(&mut buffer, 30, 30, 45, 45, SX, 0);
        //bitmap_line(&mut buffer, 45, 45, 62, 23, SX, 0);
        //bitmap_line(&mut buffer, 62, 23, 67, 89, SX, 0);
        //bitmap_line(&mut buffer, 80, 20, 20, 80, SX, 0);

        for val in buffer.iter() {
            a_star_buffer.push(*val);
        }

        let a_star_start: AStarCoordinate = AStarCoordinate(0, 0);
        let a_star_end: AStarCoordinate = AStarCoordinate(99, 99);
        let a_star_result: Vec<AStarCoordinate> =
            a_star(&mut a_star_buffer, a_star_start, a_star_end, false);
        let a_star_waste = a_star(&mut a_star_buffer, a_star_start, a_star_end, true);

        for coord in a_star_waste {
            let buffer_idx: usize = (coord.0 as usize) + ((coord.1 as usize) * SX);
            buffer[buffer_idx] = 5;
        }

        for coord in a_star_result {
            println!("{}", coord);
            let buffer_idx: usize = (coord.0 as usize) + ((coord.1 as usize) * SX);
            if coord == a_star_start {
                buffer[buffer_idx] = 3;
                continue;
            }

            if coord == a_star_end {
                buffer[buffer_idx] = 4;
                continue;
            }

            buffer[buffer_idx] = 2;
        }

        let mut pixels = vec![0u8; SX * SY * 3];

        for idx in 0..SX * SY {
            let offset = idx * 3;
            match buffer[idx] {
                0 => {
                    pixels[offset] = 0 as u8;
                    pixels[offset + 1] = 0 as u8;
                    pixels[offset + 2] = 0 as u8;
                }
                1 => {
                    pixels[offset] = 255 as u8;
                    pixels[offset + 1] = 255 as u8;
                    pixels[offset + 2] = 255 as u8;
                }
                2 => {
                    pixels[offset] = 255 as u8;
                    pixels[offset + 1] = 255 as u8;
                    pixels[offset + 2] = 0 as u8;
                }
                3 => {
                    pixels[offset] = 255 as u8;
                    pixels[offset + 1] = 0 as u8;
                    pixels[offset + 2] = 255 as u8;
                }
                4 => {
                    pixels[offset] = 0 as u8;
                    pixels[offset + 1] = 255 as u8;
                    pixels[offset + 2] = 255 as u8;
                }
                5 => {
                    pixels[offset] = 255 as u8;
                    pixels[offset + 1] = 0 as u8;
                    pixels[offset + 2] = 0 as u8;
                }
                _ => {}
            }
        }

        let img = ImageBuffer::<Rgb<u8>, _>::from_raw(SX as u32, SY as u32, pixels)
            .expect("Failed to create image buffer");

        img.save("./png/result.png").expect("Failed to save image");

        assert!(true);
    }
}
