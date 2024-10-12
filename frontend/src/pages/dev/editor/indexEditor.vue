<script setup lang="ts">
import { ref } from 'vue';
import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
import RoomEditor from './roomEditor/RoomEditor.vue';

import type { MapDisplayElement } from '@/mod/display/map/def';

const display = ref<MapDisplayElement>();
const poly: Polygon = new Polygon(
    [
        [0, 0],
        [0, 100],
        [100, 200],
        [100, 0],
    ],
    [0, 255, 0, 0.4]
);
const room: Room = new Room(7108, 1, poly);

function callRender() {
    if (display.value) {
        display.value.callRender();
    }
}
</script>

<template>
    <div>
        <MapDisplay ref="display" :gps-coord="[0, 0]" :path-data="[]" :room-data="[room]" />
        <RoomEditor :room-src="room" @update="callRender" />
    </div>
</template>

<style></style>
