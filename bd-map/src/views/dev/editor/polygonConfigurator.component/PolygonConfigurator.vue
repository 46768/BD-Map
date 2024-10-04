<script setup lang='ts'>
	import { computed } from 'vue'
	import { Polygon } from '@/components/map/polygon.class/main'

	const model = defineModel<Polygon>({ required: true })

	const id = computed({
		get() {
			return model.value.id
		},

		set(newID: string) {
			model.value.id = newID
			console.log("new name")
		}
	})

	const layer = computed({
		get() {
			return model.value.layer
		},
		set(newLayer: number) {
			model.value.layer = newLayer
			console.log("new layer")
		}
	})

	const color = computed({
		get() {
			return model.value.color
		},
		set(newColor: number[]) {
			console.log("new color")
		}
	})

	const vertices = computed({
		get() {
			return model.value.vertices
		},
		set(newVertices: number[]) {
			console.log("new vertices")
		}
	})
</script>

<template>
	<div class="w-[24rem] bg-white">
		<!--Polygon ID-->
		<div class="mb-1">
			<p class="inline">Polygon ID</p>
			<input class="inline w-[16rem]" type="text" v-model="id"></input>
		</div>
		<!--Polygon Layer-->
		<div class="mb-1">
			<p class="inline">Polygon Layer</p>
			<input class="inline w-[13rem]" type="number" v-model="layer"></input>
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
