<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Room } from '@/mod/data/room/room';

import type { Coord, Color } from '@/mod/data/com/vertex';

const { roomSrc } = defineProps<{
    roomSrc: Room;
}>();
const emit = defineEmits(['update']);

const roomCode = computed<number>({
    get: () => roomSrc.roomCode,
    set: (newCode) => {
        roomSrc.updateCode(newCode);
        emit('update');
    },
});
const floor = computed<number>({
    get: () => roomSrc.floor,
    set: (newFloor) => {
        roomSrc.updateFloor(newFloor);
        emit('update');
    },
});
const aliases = ref<string[]>(roomSrc.alias);
const polyVertices = ref<Coord[]>(roomSrc.polygon.vertices);
const polyColor = ref<Color>(roomSrc.polygon.color);

function addAlias(alias: string) {
    console.log('new alias');
    roomSrc.addAlias(alias);
    aliases.value = [...roomSrc.alias];
    emit('update');
}
function removeAlias(aliasIdx: number) {
    console.log('remove alias');
    roomSrc.removeAlias(aliasIdx);
    aliases.value = [...roomSrc.alias];
    emit('update');
}
function addVertex(coord: Coord) {
    console.log('new vertex');
    roomSrc.polygon.addVertex(coord);
    polyVertices.value = roomSrc.polygon.vertices;
    console.log(polyVertices.value);
    emit('update');
}
function removeVertex(vertexIdx: number) {
    console.log('called remove vertex');
    roomSrc.polygon.removeVertex(vertexIdx);
    polyVertices.value = roomSrc.polygon.vertices;
    emit('update');
}

watch(
    () => roomSrc.id,
    () => {
        const newPoly = roomSrc.polygon;
        roomCode.value = roomSrc.roomCode;
        floor.value = roomSrc.floor;
        polyVertices.value = newPoly.vertices;
        polyColor.value = newPoly.color;
    }
);

watch(
    aliases,
    () => {
        console.log('alias changed');
        roomSrc.updateAlias(aliases.value);
        emit('update');
    },
    { deep: true }
);
watch(
    polyVertices,
    () => {
        console.log('vertices changed');
        roomSrc.polygon.updateVertices(polyVertices.value);
        emit('update');
    },
    { deep: true }
);
watch(
    polyColor,
    () => {
        console.log('color changed');
        emit('update');
    },
    { deep: true }
);
</script>

<template>
    <div
        class="p-1 max-w-[24rem] fixed top-10 right-2 bg-white"
        :class="roomCode === -1 ? 'hidden' : 'visible'"
    >
        <!--Room Code-->
        <div class="block">
            <p class="inline-block w-1/5">Code:</p>
            <input class="inline-block w-4/5" type="number" v-model="roomCode" />
        </div>

        <!--Room Floor-->
        <div class="block">
            <p class="inline-block w-1/5">Floor:</p>
            <input class="inline-block w-4/5" type="number" v-model="floor" />
        </div>

        <!--Polygon Color-->
        <div class="block">
            <p class="inline-block w-2/12">Color:</p>
            <p class="inline-block w-[1rem]">r</p>
            <input
                class="inline-block w-[3rem]"
                type="number"
                min="0"
                max="255"
                v-model="polyColor[0]"
            />
            <p class="inline-block w-[1rem]">g</p>
            <input
                class="inline-block w-[3rem]"
                type="number"
                min="0"
                max="255"
                v-model="polyColor[1]"
            />
            <p class="inline-block w-[1rem]">b</p>
            <input
                class="inline-block w-[3rem]"
                type="number"
                min="0"
                max="255"
                v-model="polyColor[2]"
            />
            <p class="inline-block w-[1rem]">a</p>
            <input
                class="inline-block w-[3rem]"
                type="number"
                min="0"
                max="1"
                step="0.1"
                v-model="polyColor[3]"
            />
        </div>

        <!--Polygon Vertices-->
        <div class="block">
            <p class="block">Vertices</p>
            <div class="h-[8rem] overflow-y-scroll">
                <template v-for="idx in polyVertices.length" :key="`${idx}vertex`">
                    <div class="inline-block">
                        <p class="inline-block w-1/6">{{ idx }}</p>
                        <button class="inline-block w-1/6" @click="removeVertex(idx - 1)">-</button>
                        <p class="inline-block w-1/6">x</p>
                        <input
                            class="inline-block w-1/6"
                            type="number"
                            v-model="polyVertices[idx - 1][0]"
                        />
                        <p class="inline-block w-1/6">y</p>
                        <input
                            class="inline-block w-1/6"
                            type="number"
                            v-model="polyVertices[idx - 1][1]"
                        />
                    </div>
                </template>
            </div>
            <button class="block pr-2 pl-2" @click="addVertex([0, 0])">+</button>
        </div>

        <!--Room Aliases-->
        <div class="block">
            <p class="block">Aliases</p>
            <div class="h-[8rem] overflow-y-scroll">
                <template v-for="idx in aliases.length" :key="`${idx}alias`">
                    <div class="inline-block">
                        <button class="inline-block w-1/6" @click="removeAlias(idx - 1)">-</button>
                        <input class="inline-block w-5/6" type="text" v-model="aliases[idx - 1]" />
                    </div>
                </template>
            </div>
            <button class="block pr-2 pl-2" @click="addAlias('')">+</button>
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
    background: rgb(185, 185, 185);
}
</style>
