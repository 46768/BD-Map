#[cfg(test)]
mod tests {
    use lib_rust::binary_heap::MinBinaryHeap;

    #[test]
    fn insert_heap() {
        let mut heap: MinBinaryHeap<i32> = MinBinaryHeap::new();
        fn bubble_up_fn(l_idx: i32, p_idx: i32) -> bool {
            l_idx < p_idx
        }
        heap.insert(16, &bubble_up_fn);
        heap.insert(17, &bubble_up_fn);
        heap.insert(12, &bubble_up_fn);
        heap.insert(15, &bubble_up_fn);

        assert_eq!(heap.get_min(), 12)
    }

    #[test]
    fn extract_heap() {
        let mut heap: MinBinaryHeap<i32> = MinBinaryHeap::new();
        fn bubble_up_fn(l_idx: i32, p_idx: i32) -> bool {
            l_idx < p_idx
        }
        fn bubble_down_fn(c_idx: i32, c1_idx: Option<&i32>, c2_idx: Option<&i32>) -> (bool, bool) {
            let c1_val = match c1_idx {
                Some(&val) => val,
                None => 2147483647,
            };
            let c2_val = match c2_idx {
                Some(&val) => val,
                None => 2147483647,
            };

            (c_idx > c1_val || c_idx > c2_val, if c1_val > c2_val {true} else {false})
        }
        heap.insert(16, &bubble_up_fn);
        heap.insert(17, &bubble_up_fn);
        heap.insert(12, &bubble_up_fn);
        heap.insert(15, &bubble_up_fn);

        assert_eq!(heap.extract(&bubble_down_fn), Some(12));
        assert_eq!(heap.get_min(), 15)
    }
}
