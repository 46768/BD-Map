pub struct MinBinaryHeap<T> (Vec<T>);

impl<T> MinBinaryHeap<T> {
    pub fn new () -> Self {
        MinBinaryHeap (Vec::new())
    }

    #[doc = "bubble_up_fn should return true if element should swap and false otherwise"]
    pub fn insert (&mut self, val: T, bubble_up_fn: &dyn Fn(Option<&T>, Option<&T>) -> bool) {
        let array = &mut self.0;
        array.push(val);
        let new_idx: i32 = array.len() as i32;
        let mut l_idx: i32 = new_idx;
        let mut p_idx: i32 = (l_idx-1)>>1;
        loop {
            if bubble_up_fn(array.get(l_idx as usize), array.get(p_idx as usize)) {
                array.swap(l_idx as usize, p_idx as usize);
                l_idx = p_idx;
                p_idx = (l_idx-1)>>1;
            } else {
                break;
            }
        }
    }

    pub fn extract (&self, bubble_down_fn: &dyn Fn(T, T) -> bool) {
        
    }
}