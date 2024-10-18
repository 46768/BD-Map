import type { Coord } from '@/mod/data/com/vertex';

function dist(source: Coord, target: Coord): number {
    const rise = target[1] - source[1];
    const run = target[0] - source[0];
    return Math.sqrt(rise * rise + run * run);
}

function hueristic(source: Coord, target: Coord): number {
    return dist(source, target);
}

function heapSwap(heap: number[], idx1: number, idx2: number) {
    if (idx1 === idx2) return;
    heap[idx1] = heap[idx1] ^ heap[idx2];
    heap[idx2] = heap[idx1] ^ heap[idx2];
    heap[idx1] = heap[idx1] ^ heap[idx2];
}

function heapInsert(heap: number[], fCost: number[], inserts: number) {
    heap.push(inserts);
    if (heap.length === 1) return;
    let childIdx = heap.length - 1;

    while (true) {
        const parentIdx = (childIdx - 1) >> 1;
        const childFCost = fCost[heap[childIdx]];
        const parentFCost = fCost[heap[parentIdx]];
        if (!(childFCost < parentFCost || childIdx !== 0)) break;
        heapSwap(heap, childIdx, parentIdx);
        childIdx = parentIdx;
    }
}

function heapExtract(heap: number[], fCost: number[]) {
    if (heap.length === 0) return 0;
    heapSwap(heap, 0, heap.length - 1);
    const extracted: number = heap.pop() as number;
    if (heap.length <= 1) return extracted;
    const heapSize = heap.length;
    let currentIdx = 0;

    while (true) {
        const childLeftIdx: number = currentIdx * 2 + 1;
        const childRightIdx: number = currentIdx * 2 + 2;
        if (childLeftIdx >= heapSize) break;
        const parentFCost: number = fCost[heap[currentIdx]];
        const childLFCost: number = fCost[heap[childLeftIdx]];
        const childRFCost: number = childRightIdx >= heapSize ? -1 : fCost[heap[childRightIdx]];

        if (childRightIdx >= heapSize && parentFCost < childLFCost) break;
        if (heapSize === 2 && parentFCost > childLFCost) {
            heapSwap(heap, currentIdx, childLeftIdx);
            break;
        } else if (heapSize === 2) {
            break;
        }
        if (parentFCost < childLFCost && parentFCost < childRFCost) break;
        if (childRFCost < childLFCost) {
            heapSwap(heap, currentIdx, childRightIdx);
            currentIdx = childRightIdx;
        } else {
            heapSwap(heap, currentIdx, childLeftIdx);
            currentIdx = childLeftIdx;
        }
    }

    return extracted;
}

function buildPath(path: number[], pathEnd: number) {
    const prunedPath: number[] = [pathEnd];
    let nextIdx: number = path[pathEnd];
    if (nextIdx === -1) return [];

    while (prunedPath[prunedPath.length - 1] !== nextIdx) {
        prunedPath.push(nextIdx);
        nextIdx = path[nextIdx];
    }

    prunedPath.reverse();
    return prunedPath;
}

export function aStar(nodes: Coord[], nebors: number[][], source: number, target: number) {
    const nodeCnt: number = nodes.length;
    const sourceNode: Coord = nodes[source];
    const targetNode: Coord = nodes[target];

    const path: number[] = new Array(nodeCnt).fill(-1);
    const gCost: number[] = new Array(nodeCnt).fill(999999);
    const fCost: number[] = new Array(nodeCnt).fill(999999);

    const queue: number[] = [];
    const queueSet: Set<number> = new Set<number>();

    path[source] = source;
    gCost[source] = 0;
    fCost[source] = hueristic(sourceNode, targetNode);
    queue.push(source);
    queueSet.add(source);

    while (queue.length > 0) {
        const currentIdx: number = heapExtract(queue, fCost);
        const currentNode: Coord = nodes[currentIdx];
        queueSet.delete(currentIdx);
        if (currentIdx === target) {
            return buildPath(path, target);
        }

        for (const neborIdx of nebors[currentIdx]) {
            const neborNode = nodes[neborIdx];
            const neborGCost = gCost[currentIdx] + dist(currentNode, neborNode);
            const neborFCost = neborGCost + hueristic(neborNode, targetNode);

            if (neborGCost < gCost[neborIdx]) {
                path[neborIdx] = currentIdx;
                gCost[neborIdx] = neborGCost;
                fCost[neborIdx] = neborFCost;
                if (!queueSet.has(neborIdx)) {
                    heapInsert(queue, fCost, neborIdx);
                    queueSet.add(neborIdx);
                }
            }
        }
    }

    return buildPath(path, target);
}
