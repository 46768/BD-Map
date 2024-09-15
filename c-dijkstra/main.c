#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define NODEC 6
#define NODENC 2
#define uintstd_t uint16_t
#define uintstd_s sizeof(uintstd_t)
#define uintstd_l 65535
#define bool_s sizeof(bool)

bool validate_path(uintstd_t* path) {
	return true;
}

//graph structure
//[...node_neighbor_dist(size=node_neighbor_count),
//...node_neighbor(size=node_neighbor_count)]
//each dist correspond to each neighbor
uintstd_t* dijkstra(uintstd_t* graph, uintstd_t source, uintstd_t target, uintstd_t nodec, uintstd_t nodenc) {
	bool* visited = (bool*)malloc(nodec*bool_s);
	uintstd_t* dist = (uintstd_t*)malloc(nodec*uintstd_s);
	uintstd_t* path = (uintstd_t*)malloc(nodec*uintstd_s);

	memset(dist, uintstd_l, nodec*uintstd_s);
	memset(path, uintstd_l, nodec*uintstd_s);
	memset(visited, false, nodec*bool_s);
	dist[source] = 0;

	uintstd_t current_node = source;

	while (current_node != target) {
		uintstd_t min_dist = uintstd_l;
		uintstd_t next_node = current_node;
		uintstd_t graph_offset = current_node*2*nodenc;
		for (int i = 0; i < nodenc; i++) {
			uintstd_t node_dist = dist[current_node] + graph[graph_offset + i];
			uintstd_t node = graph[graph_offset + i + nodenc]; 
			if (node == uintstd_l || visited[node]) continue;
			if (node_dist <= dist[node]) {
				dist[node] = node_dist;
				path[node] = current_node;
			}
			if (node_dist < min_dist) {
				min_dist = node_dist;
				next_node = node;
			}
		}
		if (next_node == current_node) break;
		visited[current_node] = true;
		current_node = next_node;
	}

	free(dist);
	free(visited);

	return path;
}

int main(int argc, char *argv[]) {
	uintstd_t test_graph[NODEC][2*NODENC] = {
		{1, 2, 1, 2},
		{1, 2, 2, 3},
		{1, 2, 3, 4},
		{5, 2, 4, 5},
		{1, 2, 5, 0},
		{3, 2, 0, 1},
	};
	uintstd_t* test_path = dijkstra(test_graph, 0, 5, NODEC, NODENC);
	for (int i = 0; i < NODEC*uintstd_s; i++) {
		printf("%d: %d\n", i, test_path[i]);
	}
	free(test_path);
	printf("working!\n");
    return 0;
}
