<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Renderer } from './renderer/mod';
import { Room } from '@/mod/data/room/room';
import { vMouseDrag } from '@/attrib/mouse/attrib';
import { generateDivider } from './utils';
import { generatePathObjects } from './pathfinder/mod';

import type { Coord } from '@/mod/data/com/vertex';
import type { LineData } from './renderer/def';
import type { PathData } from '@/mod/algorithm/parserTools/pathTools';

// header macros
const props = defineProps<{
    gpsCoord: Coord;
    currentFloor: number;
    pathData: PathData;
    roomData: Room[];
    pathfindingData?: [number, number];
    getOffset?: (coord: Coord) => any;
}>();

// refs and variables
const renderer = ref<Renderer>();
const canvasRef = ref<HTMLCanvasElement>();
const roomList: Set<string> = new Set();
const lineGap: number = 32;

// functions
function callRender() {
    if (!renderer.value) return;
    renderer.value.render();
}

// watchers
watch(canvasRef, (newCanvas) => {
    const ctx: CanvasRenderingContext2D | null | undefined = newCanvas?.getContext('2d');
    if (!ctx) {
        console.error('no canvas context');
        return;
    }
    renderer.value = new Renderer(ctx);
    callRender();
});

watch(renderer, (newRenderer) => {
    if (newRenderer) {
        roomList.clear();
        const dividerLines = generateDivider(lineGap);
        const [nodes, neighbors]: PathData = props.pathData;
        newRenderer.backgroundColor([0, 204, 102, 1]);
        for (let line of dividerLines) {
            const [start, end, color, thickness, options]: LineData = line;
            newRenderer.createLine(start, end, color, thickness, options);
        }
        for (let room of props.roomData) {
            if (!roomList.has(room.id)) {
                newRenderer.createPolygon(room.polygon, room.polygon.color, {
                    zLayer: 2,
                    tag: 'polygon',
                    floor: room.floor,
                });
                roomList.add(room.id);
            }
        }
        for (let node of nodes) {
            newRenderer.createDot(node, 5, [255, 0, 0, 1], { zLayer: 3, tag: 'node point' });
        }
        for (let idx = 0; idx < nodes.length; idx++) {
            const nodeCrd: Coord = nodes[idx];
            for (let nbrIdx of neighbors[idx]) {
                const nbrCrd: Coord = nodes[nbrIdx];
                newRenderer.createLine(nodeCrd, nbrCrd, [255, 0, 0, 1], 2, {
                    zLayer: 3,
                    tag: 'nebor path',
                });
            }
        }
        callRender();
    }
});
watch(
    () => props.roomData,
    (newRoomData) => {
        if (!renderer.value) return;
        renderer.value.clearTag('polygon');
        for (let room of newRoomData) {
            if (!roomList.has(room.id)) {
                renderer.value.createPolygon(room.polygon, room.polygon.color, {
                    zLayer: 2,
                    tag: 'polygon',
                    floor: () => room.floor,
                });
                roomList.add(room.id);
            }
        }
        callRender();
    }
);
watch(
    () => props.pathData,
    (newPathData) => {
        if (!renderer.value) return;
        renderer.value.clearTag('node point');
        renderer.value.clearTag('nebor path');
        const [nodes, neighbors]: PathData = newPathData;
        for (let node of nodes) {
            renderer.value.createDot(node, 5, [255, 0, 0, 1], { zLayer: 3, tag: 'node point' });
        }
        for (let idx = 0; idx < nodes.length; idx++) {
            const nodeCrd: Coord = nodes[idx];
            for (let nbrIdx of neighbors[idx]) {
                const nbrCrd: Coord = nodes[nbrIdx];
                renderer.value.createLine(nodeCrd, nbrCrd, [255, 0, 0, 1], 2, {
                    zLayer: 3,
                    tag: 'nebor path',
                });
            }
        }
        callRender();
    }
);
watch(
    () => props.pathfindingData,
    (newData) => {
        if (!renderer.value) return;
        renderer.value.clearTag('pathfind-obj');
        if (!newData) return;
        const [source, target] = newData;
        const [lines, points] = generatePathObjects(props.pathData, source, target);
        for (let point of points) {
            renderer.value.createDot(...point);
        }
        for (let line of lines) {
            renderer.value.createLine(...line);
        }
        callRender();
    },
    { deep: true }
);
watch(
    () => props.currentFloor,
    (newFloor) => {
        if (renderer.value) {
            renderer.value.floor = newFloor;
            callRender();
        }
    }
);

// event listeners
function changeOffset(newOffset: Coord) {
    if (!renderer.value) return;
    renderer.value.offset = newOffset;
    if (props.getOffset) {
        props.getOffset(newOffset);
    }
    callRender();
}

function onResize() {
    if (!renderer.value) return;
    renderer.value.size = [window.innerWidth, window.innerHeight];
    callRender();
}
window.addEventListener('resize', onResize);

// footer macros
defineExpose({
    callRender,
});

onMounted(() => {
    callRender();
    if (renderer.value) {
        renderer.value.backgroundColor([0, 204, 102, 1]);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
});
</script>

<template>
    <div class="fixed top-0 left-0 w-screen h-screen">
        <p>should not see this</p>
        <canvas
            class="fixed top-0 left-0 w-screen h-screen"
            ref="canvasRef"
            v-mouse-drag="changeOffset"
        />
    </div>
</template>
