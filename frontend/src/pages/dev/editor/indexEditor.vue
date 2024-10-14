<script setup lang="ts">
import { ref, watch } from 'vue';
import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
import RoomEditor from './roomEditor/RoomEditor.vue';
import { vMouseMove, vMouseClick } from '@/attrib/mouse/attrib';

import type { Ref } from 'vue';
import type { MapDisplayElement } from '@/mod/display/map/def';
import type { Coord } from '@/mod/data/com/vertex';

// Element refs
const display: Ref<MapDisplayElement | undefined> = ref<MapDisplayElement>();
const csvInput: Ref<HTMLInputElement | undefined> = ref<HTMLInputElement>();

// Variables / Refs
const fileReader: FileReader = new FileReader();
const csvData: Ref<Room[]> = ref([]);
const canvasOffset: Ref<Coord> = ref([0, 0]);
const hoveringRoom: Ref<Room> = ref(Room.blank);
const selectingRoom: Ref<Room> = ref(Room.blank);

// Functions
function callRender() {
    if (display.value) {
        display.value.callRender();
    }
}

function handleUpdate() {
	selectingRoom.value.polygon.refresh()
	callRender()
}

function getHoveringPolygon(hoverPoint: Coord) {
    const [pointX, pointY]: Coord = hoverPoint;
    const [offsetX, offsetY]: Coord = canvasOffset.value;
    for (let room of csvData.value) {
        room.polygon.highlighted =false;
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

function getCanvasOffset(offset: Coord) {
    canvasOffset.value = offset;
}

// Event listeners
fileReader.addEventListener('load', () => {
    if (typeof fileReader.result !== 'string') {
        console.warn('file reader can only read string, use fileReader.readAsText');
        return;
    }
    const fileData: string = fileReader.result;

    const nestedArrayData: string[][] = fileData.split('\n').map((line) => line.split(','));
    // Remove the last line due to trailing \n
    nestedArrayData.pop();

    const roomDataArray: Room[] = [];

    for (let dataLine of nestedArrayData) {
        const id: string = dataLine[0];
        const vertices: Coord[] = [];
        for (let idx = 1; idx < dataLine.length; idx += 2) {
            vertices.push([parseFloat(dataLine[idx]), parseFloat(dataLine[idx + 1])]);
        }
        const roomPolygon: Polygon = new Polygon(vertices, [70, 70, 70, 0.4]);
        const roomData: Room = new Room(0, 0, roomPolygon, id);
        roomDataArray.push(roomData);
    }

    csvData.value = roomDataArray;
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
                :path-data="[]"
                :room-data="csvData"
                :get-offset="getCanvasOffset"
            />
        </div>

        <div>
            <RoomEditor :room-src="selectingRoom" @update="handleUpdate" />
            <input class="fixed bottom-[2rem] left-2" ref="csvInput" type="file" accept="text/csv"/>
            <button class="fixed bottom-[4rem] left-2" @click="console.log(csvData)">
                dump data
            </button>
            <button class="fixed bottom-[6rem] left-2" @click="console.log(csvData)">
                export data
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
</style>
