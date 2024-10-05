<script setup lang='ts'>
	import { watch, ref, computed } from 'vue'
	import { Polygon } from '@/components/map/polygon.class/main'

	const props = defineProps<{
		polygon: Polygon
	}>()

	const emit = defineEmits<{
		update: [e?: any]
	}>()

	const id = computed({
		get() {
			return props.polygon.id
		},

		set(newID: string) {
			props.polygon.id = newID
			console.log("new name")
			emit('update')
		}
	})

	const layer = computed({
		get() {
			return props.polygon.layer
		},
		set(newLayer: number) {
			props.polygon.layer = newLayer
			console.log("new layer")
			emit('update')
		}
	})

	const color = ref(props.polygon.color)
	watch(color, (newColor) => {
		props.polygon.color = newColor
		console.log("new color")
		emit('update')
	})
	const vertices = ref(props.polygon.vertices)
	watch(vertices, (newVertices) => {
		props.polygon.vertices = newVertices
		console.log("new vertices")
		emit('update')
	})
</script>

<template>
	<div class="w-[24rem] bg-white" :class="id === 'blank' ? 'hidden' : 'visible'">
		<!--Polygon ID-->
		<div class="mb-1">
			<p class="inline">Polygon ID</p>
			<input class="inline w-[16rem]" type="text" v-model="id"></input>
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
				<template v-for="idx in vertices.length>>1">
					<div class="inline-block">
						<p class="inline-block w-[6rem] mr-2">{{idx}}</p>
						<p class="inline w-[2rem]">x</p>
						<input class="inline w-[7rem]" type="number" v-model="vertices[(idx<<1)-2]"></input>
						<p class="inline w-[2rem]">y</p>
						<input class="inline w-[7rem]" type="number" v-model="vertices[(idx<<1)-1]"></input>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<style>
	p {
		background: rgb(235, 235, 235);
		padding: 2px;
	}
</style>
