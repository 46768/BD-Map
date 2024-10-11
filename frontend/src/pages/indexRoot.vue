<script setup lang="ts">
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';

const poly: Polygon = new Polygon(
    [
        [0, 0],
        [0, 100],
        [100, 200],
        [100, 0],
    ],
    [0, 255, 0, 0.4]
);
poly.highlighted(true);
const room: Room = new Room(7108, 1, poly);

function test() {
    return [room];
}
</script>

<template>
    <MapDisplay :gps-coord="[0, 0]" :path-data="[]" :room-data="test()" />
</template>

<style></style>
