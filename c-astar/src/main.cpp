#include <iostream>
#include <vector>
#include <cmath>
#include <deque>
#include <utility>
#include <unordered_set>

// assumes source and target are int[2]
inline float hueristic(std::vector<int> source, std::vector<int> target) {
	int rise = target[1] - source[1];
	int run = target[0] - source[0];
	return sqrt(rise*rise + run*run);
}

void insertHeap(std::vector<float> f_cost, std::deque<int>& node_queue, float val) {
	node_queue.push_back(val);
	if (node_queue.size() == 1) return;
	int child_idx = node_queue.size() - 1;
	int parent_idx = (child_idx-1)/2;
	float child_f_cost = f_cost[node_queue[child_idx]];
	float parent_f_cost = f_cost[node_queue[parent_idx]];

	while (child_f_cost < parent_f_cost || child_idx != 0) {
		std::swap(child_f_cost, parent_f_cost);
		child_idx = parent_idx;
		parent_idx = (child_idx-1)/2;
		child_f_cost = f_cost[node_queue[child_idx]];
		parent_f_cost = f_cost[node_queue[parent_idx]];
	}
}

int extractNodeIndex(std::vector<float> f_cost, std::deque<int>& node_queue) {
	if (node_queue.size() == 0) return 0;
	int extracted = node_queue.front();
	node_queue.pop_front();

	if (node_queue.size() <= 1) return extracted;

	// constants
	const int QUEUE_SIZE = node_queue.size();

	// variables
	int current_idx = 0;

	while (1) {
		// variables
		int child_l_idx = current_idx*2 + 1;
		int child_r_idx = current_idx*2 + 2;
		if (child_l_idx >= QUEUE_SIZE) break;

		float parent_f_cost = f_cost[node_queue[current_idx]];
		float child_r_f_cost = child_r_idx >= node_queue.size() ? -1 : f_cost[node_queue[child_r_idx]];
		float child_l_f_cost = f_cost[node_queue[child_l_idx]];

		// loop breaker
		if (child_r_idx >= QUEUE_SIZE && parent_f_cost < child_l_f_cost) break;
		if (QUEUE_SIZE == 2 && parent_f_cost > child_l_f_cost) {
			std::swap(parent_f_cost, child_l_f_cost);
			break;
		} else if (QUEUE_SIZE == 2) {
			break;
		}
		if (parent_f_cost < child_l_f_cost && parent_f_cost < child_r_f_cost) break;

		if (child_r_f_cost < child_l_f_cost) {
			std::swap(parent_f_cost, child_r_f_cost);
			current_idx = child_r_idx;
		} else {
			std::swap(parent_f_cost, child_l_f_cost);
			current_idx = child_l_idx;
		}
	}
	
	return extracted;
}

std::vector<int> build_path(std::vector<int> path, int path_end) {
	std::vector<int> pruned_path;
	int next_idx = path[path_end];
	pruned_path.push_back(path_end);

	while (pruned_path.back() != next_idx) {
		pruned_path.push_back(next_idx);
		next_idx = path[next_idx];
	}
	const int PATH_SIZE = pruned_path.size();
	for (int i = 0; i < PATH_SIZE/2; i++) {
		std::swap(pruned_path[i], pruned_path[PATH_SIZE-i-1]);	
	}

	return pruned_path;
}

// nodes[i] -> neighbors[i]
std::vector<int> a_star(std::vector<std::vector<int>> nodes, std::vector<std::vector<int>> neighbors, int source, int target) {
	// constants
	const int NODE_CNT = nodes.size();
	const std::vector<int> TARGET_NODE = nodes[target];

	//printf("node cnt: %d\n", NODE_CNT);

	// variables declaration
	std::vector<int> parents(NODE_CNT, -1);
	std::vector<float> g_cost(NODE_CNT, 999999);
	std::vector<float> f_cost(NODE_CNT, 999999);

	// binary min heap
	std::deque<int> open_node;
	std::unordered_set<int> open_node_set;
	std::vector<bool> closed_node(NODE_CNT, false);

	// variable initializations
	open_node.push_back(source);
	open_node_set.insert(source);
	parents[source] = source;
	g_cost[source] = 0;
	f_cost[source] = g_cost[source] + hueristic(nodes[source], TARGET_NODE);

	while (!open_node.empty()) {
		int current_node = extractNodeIndex(f_cost, open_node);
		open_node_set.erase(current_node);

		closed_node[current_node] = true;
		if (target == current_node) {
			return build_path(parents, target);
		}

		std::vector<int> nebor = neighbors[current_node];
		for (std::vector<int>::iterator it = nebor.begin(); it != nebor.end(); it++) {
			int node_idx = *it;
			std::vector<int> node = nodes[node_idx];
			if (closed_node[node_idx]) continue;

			parents[node_idx] = current_node;
			
			// cost calculations
			float nebor_g_cost = g_cost[current_node] + sqrt(node[0]*node[0] + node[1]*node[1]);
			float nebor_f_cost = nebor_g_cost + hueristic(node, TARGET_NODE);

			// cost assignment
			if (nebor_g_cost < g_cost[node_idx]) {
				g_cost[node_idx] = nebor_g_cost;
				f_cost[node_idx] = nebor_f_cost;
				if (open_node_set.find(node_idx) == open_node_set.end()) {
					insertHeap(f_cost, open_node, node_idx);
				}
			}
		}
	}
	
	return build_path(parents, target);
}

int main() {
	int rows = 10;
	int cols = 10;
	std::cout << "Hello World!\n";
	std::vector<std::vector<int>> nodes;
	std::vector<std::vector<int>> neighbors;

	auto getNodeIndex = [cols](int x, int y) -> int {
		return x*cols + y;
	};

	for (int x = 0; x < rows; x++) {
		for (int y = 0; y < rows; y++) {
			nodes.push_back({x, y});
			std::vector<int> nodeNeighbors;
			if (x > 0) nodeNeighbors.push_back(getNodeIndex(x - 1, y));
            if (x < rows - 1) nodeNeighbors.push_back(getNodeIndex(x + 1, y));
            if (y > 0) nodeNeighbors.push_back(getNodeIndex(x, y - 1));
            if (y < cols - 1) nodeNeighbors.push_back(getNodeIndex(x, y + 1));
			neighbors.push_back(nodeNeighbors);
		}
	}

	for (int test = 1; test < nodes.size(); test++) {
		int source = 0;
		int target = test;

		std::vector<int> result = a_star(nodes, neighbors, source, target);
		int result_cnt = result.size();

		for (int i = 0; i < result_cnt; i++) {
			std::cout << i << " " << result[i] << std::endl;
		}
	}
}
