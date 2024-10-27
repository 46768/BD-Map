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
const tags = ref<string[]>(Array.from(roomSrc.tag));
const polyVertices = ref<Coord[]>(roomSrc.polygon.vertices);
const polyColor = ref<Color>(roomSrc.polygon.color);

const tagBuffer = ref<string>("");

function addAlias(alias: string) {
    roomSrc.addAlias(alias);
    aliases.value = [...roomSrc.alias];
    emit('update');
}
function removeAlias(aliasIdx: number) {
    roomSrc.removeAlias(aliasIdx);
    aliases.value = [...roomSrc.alias];
    emit('update');
}
function addVertex(coord: Coord) {
    roomSrc.polygon.addVertex(coord);
    polyVertices.value = roomSrc.polygon.vertices;
    emit('update');
}
function removeVertex(vertexIdx: number) {
    roomSrc.polygon.removeVertex(vertexIdx);
    polyVertices.value = roomSrc.polygon.vertices;
    emit('update');
}
function addTag() {
	roomSrc.addTag(tagBuffer.value);
	tags.value = Array.from(roomSrc.tag);
	emit('update');
}
function removeTag(tag: string) {
	roomSrc.removeTag(tag);
	tags.value = Array.from(roomSrc.tag);
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
		tags.value = Array.from(roomSrc.tag);
    }
);

watch(
    aliases,
    () => {
        roomSrc.updateAlias(aliases.value);
        emit('update');
    },
    { deep: true }
);
watch(
    polyVertices,
    () => {
        roomSrc.polygon.updateVertices(polyVertices.value);
        emit('update');
    },
    { deep: true }
);
watch(
    polyColor,
    () => {
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
            <input class="inline-block w-4/5" type="number" step="0.5" v-model="floor" />
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
        <!--Room Tags-->
        <div class="block">
            <p class="block">Tags</p>
            <div class="h-[8rem] overflow-y-scroll">
                <template v-for="idx in tags.length" :key="`${idx}tags`">
                    <div class="inline-block w-full">
                        <button class="inline-block w-1/6" @click="removeTag(tags[idx-1])">-</button>
						<p class="inline-block w-5/6">{{tags[idx-1]}}</p>
                    </div>
                </template>
            </div>
			<div>
				<button class="inline-block pr-2 pl-2" @click="addTag()">+</button>
				<input class="inline-block" type="text" v-model="tagBuffer" />
			</div>
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
