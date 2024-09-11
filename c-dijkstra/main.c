#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>

#define NODEC 2
#define NODENC 2
#define uintstd_s sizeof(uint16_t)

// [...nodend(s(nodenc)), ...noden(s(nodenc))][]
uint16_t* dijkstra(uint16_t* graph, uint16_t source, uint16_t target, uint16_t nodec, uint16_t nodenc) {
	printf("nodec: %d\nnodenc: %d\n", nodec, nodenc);
	uint16_t* p_cost = (uint16_t*)malloc(nodec*uintstd_s);
	uint16_t* path = (uint16_t*)malloc(nodec*uintstd_s);

	free(p_cost);
	return path;
}

int main(int argc, char *argv[]) {
	uint16_t testg[NODEC][NODENC] = {{1, 2}, {3, 4}};
	uint16_t* test = dijkstra(testg, 1, 2, NODEC, NODENC);
	free(test);
	printf("working!\n");
    return 0;
}
