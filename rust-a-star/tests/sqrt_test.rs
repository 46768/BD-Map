#[cfg(test)]
mod tests {
    use rust_a_star::dist;
    use rust_a_star::AStarCoordinate;

    #[test]
    fn dist_test() {
        println!("Result Sqrt: {}", dist(AStarCoordinate(0, 0), AStarCoordinate(6, 8)));
        assert!(true)
    }
}
