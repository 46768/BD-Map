<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Renderer } from './renderer/mod';
import { Room } from '@/mod/data/room/room';
import { vMouseDrag } from '@/attrib/mouse/attrib';

import type { Coord, Color } from '@/mod/data/com/vertex';
import type { LineData } from './renderer/def';
import type { GraphData } from '@/mod/algorithm/parserTools/graphTools';

// header macros
const props = defineProps<{
    gpsCoord: Coord;
    pathData: GraphData;
    roomData: Room[];
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

function generateDivider(lineGap: number) {
    const lineData: LineData[] = [];
    const dividerColor: Color = [20, 20, 20, 0.2];
    const dividerThickness: number = 1;

    for (let x = 0; x < window.outerWidth + lineGap; x += lineGap) {
        lineData.push([
            [x, -lineGap],
            [x, window.outerHeight + lineGap],
            dividerColor,
            dividerThickness,
            { zLayer: 0, repeating: lineGap },
        ]);
    }
    for (let y = 0; y < window.outerHeight + lineGap; y += lineGap) {
        lineData.push([
            [-lineGap, y],
            [window.outerWidth + lineGap, y],
            dividerColor,
            dividerThickness,
            { zLayer: 0, repeating: lineGap },
        ]);
    }

    return lineData;
}

function changeOffset(newOffset: Coord) {
    if (!renderer.value) return;
    renderer.value.updateOffset(newOffset);
    if (props.getOffset) {
        props.getOffset(newOffset);
    }
    callRender();
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
        const dividerLines = generateDivider(lineGap);
		const [nodes, neighbors]: GraphData = props.pathData;
        newRenderer.backgroundColor([0, 204, 102, 1]);
        for (let line of dividerLines) {
            const [start, end, color, thickness, options]: LineData = line;
            newRenderer.createLine(start, end, color, thickness, options);
        }
        newRenderer.createDot([0, 0], 32, [255, 0, 0, 0.5], { zLayer: 1 });
        for (let room of props.roomData) {
            if (!roomList.has(room.id)) {
                newRenderer.createPolygon(room.polygon, room.polygon.color, {
                    zLayer: 2,
                });
                roomList.add(room.id);
            }
        }
		for (let node of nodes) {
			newRenderer.createDot(node, 5, [255, 0, 0, 1], {zLayer: 3})
		}
		for (let idx = 0; idx < nodes.length; idx++) {
			const nodeCrd: Coord = nodes[idx];
			for (let nbrIdx of neighbors[idx]) {
				const nbrCrd: Coord = nodes[nbrIdx];
				newRenderer.createLine(nodeCrd, nbrCrd, [255, 0, 0, 1], 2, {zLayer:3})
			}
		}
        callRender();
    }
});

watch(
    () => props.roomData,
    (newRoomData) => {
        if (!renderer.value) return;
        for (let room of newRoomData) {
            if (!roomList.has(room.id)) {
                renderer.value.createPolygon(room.polygon, room.polygon.color, {
                    zLayer: 2,
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
		const [nodes, neighbors]: GraphData = newPathData;
		for (let node of nodes) {
			renderer.value.createDot(node, 5, [255, 0, 0, 1], {zLayer: 1})
		}
        callRender();
    }
);

// event listeners
function onResize() {
    if (!renderer.value) return;
    renderer.value.updateSize([window.innerWidth, window.innerHeight]);
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
