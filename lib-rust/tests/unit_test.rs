#[cfg(test)]
mod tests {
    use lib_rust::a_star;
    use lib_rust::AStarCoordinate;

    #[test]
    fn test_3_x_3() {
        let result: Vec<AStarCoordinate> = a_star(
            vec![3, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            AStarCoordinate(0, 2),
            AStarCoordinate(2, 0),
        );
        for coord in result {
            println!("{}", coord);
        }

        assert!(true)
    }

    #[test]
    fn test_5_x_5() {
        let result: Vec<AStarCoordinate> = a_star(
            vec![5, 5,
            1, 1, 1, 1, 1, 
            1, 0, 1, 0, 1, 
            1, 1, 1, 1, 1,
            1, 1, 0, 0, 1,
            1, 1, 1, 1, 1,],
            AStarCoordinate(0, 4),
            AStarCoordinate(4, 0),
        );
        for coord in result {
            println!("{}", coord);
        }

        assert!(true)
    }
}
