<script setup lang="ts">
import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
import * as graphTools from '@/mod/algorithm/parserTools/graphTools';

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
const testPolygon4 = new Polygon(
    [
        [25, 100],
        [50, 100],
        [50, 200],
        [25, 200],
    ],
    [70, 70, 70, 1]
);
const testPolygon5 = new Polygon(
    [
        [125, 100],
        [150, 100],
        [150, 200],
        [125, 200],
    ],
    [70, 70, 70, 1]
);
const testPolygon6 = new Polygon(
    [
        [225, 100],
        [250, 100],
        [250, 200],
        [225, 200],
    ],
    [70, 70, 70, 1]
);
const testPolygon7 = new Polygon(
    [
        [0, 200],
        [0, 300],
        [300, 300],
        [300, 200],
    ],
	[70, 70, 70, 1]
);

const testRoom = new Room(7108, 1, testPolygon, 'testRoomID');
const testRoom2 = new Room(7107, 1, testPolygon2, 'testRoom2ID');
const testRoom3 = new Room(7109, 1, testPolygon3, 'testRoom3ID');
const testRoom4 = new Room(7101, 1, testPolygon4, 'testRoom4ID');
const testRoom5 = new Room(7102, 1, testPolygon5, 'testRoom5ID');
const testRoom6 = new Room(7103, 1, testPolygon6, 'testRoom6ID');
const testRoom7 = new Room(7104, 1, testPolygon7, 'testRoom7ID');

function getRooms() {
	return [testRoom, testRoom2, testRoom3, testRoom4, testRoom5, testRoom6, testRoom7];
}

function getGraph(): graphTools.GraphData {
	return graphTools.generateGraph(getRooms());
}

</script>

<template>
            <MapDisplay
                ref="display"
                :gps-coord="[0, 0]"
                :path-data="getGraph()"
                :room-data="getRooms()"
            />
</template>
