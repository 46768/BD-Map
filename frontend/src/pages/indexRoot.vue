<script setup lang="ts">
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
import { Room } from '@/mod/data/room/room';

const room: Room = Room.blank;

function test() {
    return [room];
}
</script>

<template>
    <MapDisplay :gps-coord="[0, 0]" :path-data="[]" :room-data="test()" />
</template>

<style></style>
