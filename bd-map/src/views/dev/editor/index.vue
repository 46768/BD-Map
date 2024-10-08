<script setup lang='ts'>
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import { Polygon } from '@/components/map/polygon.class/main'
	import { CSVReader } from './csvReader.class/main'
	import { vMouse } from '@/directives/vMouse'
	import { vClick } from '@/directives/vClick'
	import Map from '@/components/map/Map.vue'
	import PolygonConfigurator from './polygonConfigurator.component/PolygonConfigurator.vue'
	import type { Ref } from 'vue'
	import type { CanvasCoord } from '@/components/map/def'

	const csvInputEl = ref<HTMLInputElement>()
	const csvReader: CSVReader<Polygon[]> = new CSVReader((rawCSV: string[][]) => {
		const polygonData: Polygon[] = rawCSV.map(data => {
			const dat: string[] = data
			const polyID: string | undefined = dat.shift()
			const coordDatInter: number[] = dat.map(coord => parseFloat(coord))
			const coordDat: [number, number][] = []
			for (let idx = 0; idx < coordDatInter.length; idx+=2) {
				coordDat.push([coordDatInter[idx], coordDatInter[idx+1]])
			}

			if (!polyID) return Polygon.blank
			return new Polygon(polyID, 0, [70, 70, 70, 0.5], coordDat)
		})
		return polygonData
	})

	const mapRef = ref()

	const polygonData: Ref<Polygon[]> = ref<Polygon[]>([])
	const canvasOffset: Ref<CanvasCoord> = ref<CanvasCoord>({x: 0, y: 0})
	const mouseCoord: Ref<CanvasCoord> = ref<CanvasCoord>({x: 0, y: 0})

	const selectingPolygon: Ref<Polygon> = ref<Polygon>(Polygon.blank)
	const hoveringPolygon: Ref<Polygon> = ref<Polygon>(Polygon.blank)

	function handleUpdate() { if (mapRef.value) {mapRef.value.drawCanvas()} }
	function clearInput() { csvReader.clearInput(); polygonData.value = [] }
	function updateCanvasOffset(inpt: CanvasCoord) { canvasOffset.value = inpt }
	function handleClick() { selectingPolygon.value = hoveringPolygon.value }
	function handleFileInput() {
		csvReader.readFile()
		.then(data => {
			polygonData.value = data
		})
		.catch(err => console.error(err))
	}
	function updateMouseCoord(inpt: CanvasCoord) {
		mouseCoord.value = inpt
		hoveringPolygon.value = Polygon.blank
		for (let poly of polygonData.value) {
			poly.highlighted = false
		}
		selectingPolygon.value.highlighted = true
		for (let poly of polygonData.value) {
			if (poly.isOverlapping(mouseCoord.value.x-canvasOffset.value.x, mouseCoord.value.y-canvasOffset.value.y)) {
				poly.highlighted = true
				hoveringPolygon.value = poly
				break
			}
		}
		if (mapRef.value) {
			mapRef.value.drawCanvas()
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
	<Map dev ref="mapRef" class="z-0" :coord="{x: 0, y: 0, layer: 0}" :data="{graph:[], translation:[], graphic:polygonData}" 
		:get-coord="updateCanvasOffset" v-mouse="updateMouseCoord" v-click="handleClick"/>
	<PolygonConfigurator class="fixed top-10 right-2 z-10" :polygon="selectingPolygon" @update="handleUpdate"/>
	<!--UI-->
	<div class="z-20">
		<!--CSV Input-->
		<input class="fixed bottom-2 left-2" type="file" accept="text/csv" @input="handleFileInput" ref="csvInputEl"></input>
		<!--Input Clear-->
		<button class="fixed bottom-10 left-2" @click="clearInput">clear input</button>
		<button class="fixed bottom-[4.5rem] left-2" @click="console.log(polygonData)">get polygon data</button>
		<button class="fixed bottom-[6.5rem] left-2" @click="polygonData.forEach(p=>p.refresh())">refresh polygon data</button>
	</div>
</template>

<style>
	button {
		background: rgb(235, 235, 235);
		padding-left: 2px;
		padding-right: 2px;
	}
</style>
