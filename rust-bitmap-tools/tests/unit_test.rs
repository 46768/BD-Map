#[cfg(test)]
mod tests {
    use rust_bitmap_tools::bitmap_line;
    use image::{ImageBuffer, Luma};

    const RES: i32 = 50;
    const SX: usize = 10 * (RES as usize);
    const SY: usize = 10 * (RES as usize);

    const X0: i32 = 3 * RES;
    const Y0: i32 = 4 * RES;

    const X1: i32 = 7 * RES;
    const Y1: i32 = 5 * RES;

    const X2: i32 = 5 * RES;
    const Y2: i32 = 8 * RES;

    #[test]
    fn bitmap_line_test() {
        let mut buffer: [i32; SX * SY] = [1; SX * SY];

        bitmap_line(&mut buffer, X0, Y0, X1, Y1, SX, 0);
        bitmap_line(&mut buffer, X1, Y1, X2, Y2, SX, 0);
        bitmap_line(&mut buffer, X2, Y2, X0, Y0, SX, 0);
        let mut pixel = vec![0u8; SX * SY];
        for idx in 0..SX * SY {
            if buffer[idx] == 1 {
                pixel[idx] = 255u8;
            }
        }
        let img: ImageBuffer<Luma<u8>, _> =
            ImageBuffer::<Luma<u8>, _>::from_raw(SX as u32, SY as u32, pixel)
                .expect("Failed to create image buffer");
        img.save("./png/monochrome_line.png")
            .expect("Failed to save image");
        // for y in 0..SY {
        // for x in 0..SX {
        // print!("{}", if (y == (y0 as usize) && x == (x0 as usize) ) || (y == (y1 as usize) && x == (x1 as usize)) {buffer[x+(SX*y)] as i32} else {buffer[x+(SX*y)] as i32});
        // }
        // print!("\n")
        // }
        assert!(true);
    }
}
