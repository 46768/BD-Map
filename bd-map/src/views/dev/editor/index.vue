<script setup lang='ts'>
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import { Polygon } from '@/components/map/polygon.class/main'
	import { CSVReader } from './csvReader.class/main'
	import { vMouse } from '@/directives/vMouse'
	import Map from '@/components/map/Map.vue'
	import PolygonConfigurator from './polygonConfigurator.component/PolygonConfigurator.vue'
	import type { Ref } from 'vue'
	import type { CanvasCoord } from '@/components/map/def'

	const csvInputEl = ref<HTMLInputElement>()
	const csvReader: CSVReader<Polygon[]> = new CSVReader((rawCSV: string[][]) => {
		const polygonData: Polygon[] = rawCSV.map(data => {
			const dat: string[] = data
			const polyID: string | undefined = dat.shift()
			const coordDat: number[] = dat.map(coord => parseFloat(coord))

			if (!polyID) return new Polygon("invalid", -1, [0,0,0,0], [0,0])
			return new Polygon(polyID, 0, [70, 70, 70, 0.5], coordDat)
		})
		return polygonData
	})

	const polygonData: Ref<Polygon[]> = ref<Polygon[]>([])
	const canvasOffset: Ref<CanvasCoord> = ref<CanvasCoord>({x: 0, y: 0})
	const mouseCoord: Ref<CanvasCoord> = ref<CanvasCoord>({x: 0, y: 0})
	const selectingPolygon: Ref<Polygon> = ref<Polygon>(Polygon.blank)

	function handleUpdate() {
	}

	function handleFileInput() {
		csvReader.readFile()
		.then(data => {
			polygonData.value = data
		})
		.catch(err => console.error(err))
	}

	function clearInput() { csvReader.clearInput() }
	function updateCanvasOffset(inpt: CanvasCoord) { canvasOffset.value = inpt }
	function updateMouseCoord(inpt: CanvasCoord) {
		mouseCoord.value = inpt
		for (let i = 0; i < polygonData.value.length; i++) {
			const poly = polygonData.value[i]
			poly.highlighted = false
			if (poly.isOverlapping(mouseCoord.value.x-canvasOffset.value.x, mouseCoord.value.y-canvasOffset.value.y)) {
				poly.highlighted = true
				break
			}
		}
	}

	onMounted(() => {
		if (csvInputEl.value) {
			csvReader.attachElement(csvInputEl.value)
		} else {
			console.error("CSV Input Have No Reference")
		}
	})

	onBeforeUnmount(() => {
		csvReader.detach()
	})
</script>

<template>
	<Map class="z-0" :coord="{x: 0, y: 0, layer: 0}" :data="{graph:[], translation:[], graphic:polygonData}" 
		:get-coord="updateCanvasOffset" v-mouse="updateMouseCoord"/>
	<PolygonConfigurator class="fixed top-10 right-2 z-10" :polygon="selectingPolygon" @update="handleUpdate"/>
	<!--UI-->
	<div class="z-20">
		<!--CSV Input-->
		<input class="fixed bottom-2 left-2" type="file" accept="text/csv" @input="handleFileInput" ref="csvInputEl"></input>
		<!--Input Clear-->
		<button class="fixed bottom-10 left-2" @click="clearInput">clear input</button>
	</div>
</template>

<style>
	button {
		background: rgb(235, 235, 235);
		padding-left: 2px;
		padding-right: 2px;
	}
</style>
