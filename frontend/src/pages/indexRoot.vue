<script setup lang="ts">
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
import { Room } from '@/mod/data/room/room';
import { blankPath } from '@/mod/algorithm/parserTools/pathTools';

const room: Room = Room.blank;

function test() {
    return [room];
}
function tp() {
    return blankPath;
}
</script>

<template>
    <MapDisplay 
	:gps-coord="[0, 0]" 
	:current-floor="1" 
	:path-data="tp()" 
	:room-data="test()" 
	:global-offset="[0, 0]"/>
</template>

<style></style>
