<script setup lang='ts'>
	import { watch, ref } from 'vue'
	import { Polygon } from '@/components/map/polygon.class/main'

	const props = defineProps<{
		polygon: Polygon
	}>()

	const emit = defineEmits<{
		update: [e?: any]
	}>()

	const id = ref<string>(props.polygon.id)
	const roomCode = ref<number>(props.polygon.roomCode)
	const layer = ref<number>(props.polygon.layer)
	const color = ref<number[]>(props.polygon.color)
	const vertices = ref<[number, number][]>(props.polygon.vertices)
	const aliases = ref<string[]>(props.polygon.alias)

	watch(() => props.polygon.id, () => {
		const newPoly = props.polygon
		id.value = newPoly.id
		roomCode.value = newPoly.roomCode
		layer.value = newPoly.layer
		color.value = newPoly.color
		vertices.value = newPoly.vertices
		aliases.value = newPoly.alias
	})
	watch(id, (newID) => {
		props.polygon.id = newID
		emit('update')
	})
	watch(roomCode, (newRoomcode) => {
		props.polygon.roomCode = newRoomcode
		emit('update')
	})
	watch(layer, (newLayer) => {
		props.polygon.layer = newLayer
		emit('update')
	})
	watch(color, (newColor) => {
		props.polygon.color = newColor
		emit('update')
	}, {deep: true})
	watch(vertices, (newVertices) => {
		props.polygon.vertices = newVertices
		emit('update')
	}, {deep: true})
	watch(aliases, (newAliases) => {
		props.polygon.alias = newAliases
		emit('update')
	}, {deep: true})

	function prune() {
		props.polygon.pruneVertices()
		vertices.value = props.polygon.vertices
		emit('update')
	}
	function addVertex() {
		props.polygon.addVertex([0, 0])
		vertices.value = props.polygon.vertices
		emit('update')
	}
	function removeVertex(idx: number) {
		props.polygon.removeVertex(idx)
		vertices.value = props.polygon.vertices
		emit('update')
	}
	function addAlias(alias: string) {
		props.polygon.addAlias(alias)
		aliases.value = props.polygon.alias
		emit('update')
	}
	function removeAlias(alias: string) {
		props.polygon.removeAlias(alias)
		aliases.value = props.polygon.alias
		emit('update')
	}
</script>

<template>
	<div class="w-[24rem] bg-white" :class="id === 'blank' ? 'hidden' : 'visible'">
		<!--Polygon ID-->
		<div class="mb-4 mt-2">
			<p class="inline">Polygon ID</p>
			<input class="inline w-[16rem]" type="text" v-model="id"></input>
		</div>
		<!--Polygon Roomcode-->
		<div class="mb-1">
			<p class="inline">Polygon Roomcode</p>
			<input class="inline w-[13rem]" type="number" v-model="roomCode"></input>
		</div>
		<!--Polygon Layer-->
		<div class="mb-1">
			<p class="inline">Polygon Layer</p>
			<input class="inline w-[13rem]" type="number" min="0" v-model="layer"></input>
		</div>
		<!--Polygon RGBA-->
		<div class="mb-1">
			<p class="inline">Polygon Color</p>
			<template v-for="(_, idx) of color">
				<div class="inline">
					<p class="inline">{{['R', 'G', 'B', 'A'][idx]}}</p>
					<input class="inline w-[3rem]" type="number" v-model="color[idx]"
				min="0" :max="idx===3 ? 1 : 255" :step="idx===3 ? 0.1 : 1"></input>
				</div>
			</template>
		</div>
		<!--Polygon Vertices-->
		<div class="mb-1">
			<p class="block">Polygon Vertices</p>
			<div class="block w-[24rem] h-[12rem] overflow-y-scroll">
				<template v-for="idx in vertices.length">
					<!--Vertex Config-->
					<div class="inline-block">
						<button class="inline-block w-[2rem] mr-2" @click="removeVertex(idx-1)">-</button>
						<p class="inline-block w-[4rem] mr-2">{{idx}}</p>
						<p class="inline w-[2rem]">x</p>
						<input class="inline w-[7rem]" type="number" v-model="vertices[idx-1][0]"></input>
						<p class="inline w-[2rem]">y</p>
						<input class="inline w-[7rem]" type="number" v-model="vertices[idx-1][1]"></input>
					</div>
				</template>
				<button class="block w-[2rem]" @click="addVertex">+</button>
			</div>
		</div>
		<!--Polygon Aliases-->
		<div>
			<p class="block">Polygon Aliases</p>
			<div class="block w-[24rem] h-[12rem] overflow-y-scroll">
				<template v-for="idx in aliases.length">
					<!--Alias Block-->
					<div class="inline-block">
						<button class="inline-block w-[2rem] mr-2" @click="removeAlias(aliases[idx-1])">-</button>
						<input type="text" class="inline-block w-[20rem]" v-model="aliases[idx-1]"></input>
					</div>
				</template>
				<button class="block w-[2rem]" @click="addAlias('')">+</button>
			</div>
		</div>
		<!--Vertex Pruning-->
		<button class="inline-block m-2" @click="prune">prune vertices</button>
	</div>
</template>

<style>
	p {
		background: rgb(235, 235, 235);
		padding: 2px;
	}
</style>
