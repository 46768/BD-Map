pub struct MinBinaryHeap<T> (Vec<T>);

impl<T: Copy>MinBinaryHeap<T> {
    pub fn new () -> Self {
        MinBinaryHeap (Vec::new())
    }

    #[doc = "bubble_up_fn should return true if element should swap and false otherwise, first arg=current_val, sec_arg=parent_arg"]
    pub fn insert (&mut self, val: T, bubble_up_fn: &dyn Fn(T, T) -> bool) {
        let array: &mut Vec<T> = &mut self.0;
        array.push(val);
        let new_idx: i32 = (array.len()-1) as i32;
        let mut l_idx: i32 = new_idx;
        loop {
            let p_idx: i32 = (l_idx-1)/2;
            let l_val: T = array[l_idx as usize];
            let p_val: T = array[p_idx as usize];
            if bubble_up_fn(l_val, p_val) {
                array.swap(l_idx as usize, p_idx as usize);
                l_idx = p_idx;
            } else {
                break;
            }
        }
    }

    #[doc = "bubble_down_fn should return true if element should swap and false otherwise and a second bool to indicate which children
    false being the left, true being the right, first arg=current_val, sec_arg=child_arg1
    thrd_arg=child_arg2
    "]
    pub fn extract (&mut self, bubble_down_fn: &dyn Fn(T, Option<&T>, Option<&T>) -> (bool, bool)) -> Option<T> {
        let array: &mut Vec<T> = &mut self.0;
        let array_last: usize = array.len()-1;
        array.swap(0, array_last);
        let ret: Option<T> = array.pop();
        let mut root: usize = 0;
        loop {
            let child1: usize = (2*root)+1;
            let child2: usize = (2*root)+2;
            if child1 >= array_last+1 {break;};
            let (swap_bool, direction_bool) = bubble_down_fn(array[root], array.get(child1), array.get(child2));
            if swap_bool {
                if direction_bool {
                    array.swap(root, child2);
                    root = child2;
                } else {
                    array.swap(root, child1);
                    root = child1;
                }
            } else {
                break;
            }
        }

        ret
    }

    pub fn get_min (&self) -> T {
        self.0[0]
    }

    pub fn get_size (&self) -> usize {
        self.0.len()
    }
}