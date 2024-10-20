<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import { blankPath, generatePath } from '@/mod/algorithm/parserTools/pathTools';
import { vMouseMove, vMouseClick } from '@/attrib/mouse/attrib';
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
import type { MapDisplayElement } from '@/mod/display/map/def';
import type { Coord } from '@/mod/data/com/vertex';
import type { PathData } from '@/mod/algorithm/parserTools/pathTools';

import { parseCSV } from './fileHandler/csvHandler';
import { testData } from './testData';
import RoomEditor from './roomEditor/RoomEditor.vue';

// Element refs
const display: Ref<MapDisplayElement | undefined> = ref<MapDisplayElement>();
const csvInput: Ref<HTMLInputElement | undefined> = ref<HTMLInputElement>();

// Variables / Refs
const fileReader: FileReader = new FileReader();
const csvData: Ref<Room[]> = ref([]);
const pathData: Ref<PathData> = ref(blankPath);
const canvasOffset: Ref<Coord> = ref([0, 0]);
const hoveringRoom: Ref<Room> = ref(Room.blank);
const selectingRoom: Ref<Room> = ref(Room.blank);
const pathfindData: Ref<[number, number] | undefined> = ref();
const pathfindHold: Ref<[number, number]> = ref([0, 0]);

// Functions
function callRender() {
    if (display.value) {
        display.value.callRender();
    }
}
function handleUpdate() {
    selectingRoom.value.polygon.refresh();
    callRender();
}
function getHoveringPolygon(hoverPoint: Coord) {
    const [pointX, pointY]: Coord = hoverPoint;
    const [offsetX, offsetY]: Coord = canvasOffset.value;
    for (let room of csvData.value) {
        room.polygon.highlighted = false;
    }
    selectingRoom.value.polygon.highlighted = true;

    hoveringRoom.value = Room.blank;
    for (let room of csvData.value) {
        const poly: Polygon = room.polygon;
        const point: Coord = [pointX - offsetX, pointY - offsetY];
        if (poly.isPointInPolygon(point)) {
            hoveringRoom.value = room;
            poly.highlighted = true;
            break;
        }
    }
    callRender();
}
function generatePathData() {
    pathData.value = generatePath(csvData.value);
    console.log(pathData.value);
}

// Event listeners
fileReader.addEventListener('load', () => {
    if (typeof fileReader.result !== 'string') {
        console.warn('file reader can only read string, use fileReader.readAsText');
        return;
    }
    const fileData: string = fileReader.result;

    csvData.value = parseCSV(fileData);
    callRender();
});

// Watchers
watch(csvInput, (newInputEl) => {
    if (!newInputEl) return;
    newInputEl.addEventListener('change', () => {
        if (!newInputEl.files) {
            console.warn('csv input not a file input');
            return;
        }
        const files = newInputEl.files;
        fileReader.readAsText(files[0]);
    });
});
</script>

<template>
    <div>
        <div
            class="fixed top-0 left-0"
            v-mouse-move="getHoveringPolygon"
            v-mouse-click="
                () => {
                    selectingRoom = hoveringRoom;
                }
            "
        >
            <MapDisplay
                ref="display"
                :gps-coord="[0, 0]"
                :path-data="pathData"
                :room-data="csvData"
                :pathfinding-data="pathfindData"
                :get-offset="(offset) => (canvasOffset = offset)"
            />
        </div>

        <div>
            <RoomEditor :room-src="selectingRoom" @update="handleUpdate" />
            <input
                class="fixed bottom-[2rem] left-2"
                ref="csvInput"
                type="file"
                accept="text/csv"
            />
            <button class="fixed bottom-[4rem] left-2" @click="console.log(csvData)">
                dump data
            </button>
            <button class="fixed bottom-[6rem] left-2" @click="console.log(csvData)">
                export data
            </button>
            <button class="fixed bottom-[8rem] left-2" @click="generatePathData">generate path</button>
            <div class="fixed bottom-[10rem] left-2">
                <button class="inline" @click="() => (pathfindData = pathfindHold)">
                    pathfind
                </button>
                <input class="inline w-[4rem]" type="number" v-model="pathfindHold[0]" />
                <input class="inline w-[4rem]" type="number" v-model="pathfindHold[1]" />
            </div>
            <button class="fixed bottom-[12rem] left-2" @click="() => (csvData = testData)">
                use test data
            </button>
        </div>
    </div>
</template>

<style scoped>
p {
    background: rgb(235, 235, 235);
}
button {
    background: rgb(215, 215, 215);
}
input {
    background: rgb(205, 205, 205);
}
</style>
