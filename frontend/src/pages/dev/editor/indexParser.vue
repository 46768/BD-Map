<script setup lang="ts">
import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import MapDisplay from '@/mod/display/map/MapDisplay.vue';

const testPolygon = new Polygon(
    [
        [0, 0],
        [0, 100],
        [100, 100],
        [100, 0],
    ],
    [70, 70, 70, 1]
);
const testPolygon2 = new Polygon(
    [
        [100, 0],
        [100, 100],
        [200, 100],
        [200, 0],
    ],
    [70, 70, 70, 1]
);
const testPolygon3 = new Polygon(
    [
        [200, 0],
        [200, 100],
        [300, 100],
        [300, 0],
    ],
    [70, 70, 70, 1]
);

const testRoom = new Room(7108, 1, testPolygon, 'testRoomID');
const testRoom2 = new Room(7107, 1, testPolygon2, 'testRoom2ID');
const testRoom3 = new Room(7109, 1, testPolygon3, 'testRoom3ID');

function getRooms() {
	return [testRoom, testRoom2, testRoom3];
}

</script>

<template>
            <MapDisplay
                ref="display"
                :gps-coord="[0, 0]"
                :path-data="[]"
                :room-data="getRooms()"
            />
</template>
