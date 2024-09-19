<script setup lang="ts">
	import { ref, useTemplateRef, onMounted, defineProps } from 'vue'
	import { graphData } from '../stores/graphData'
	import { translationTable } from '../stores/translationTable'
	const canvas = useTemplateRef('canvas-ref')
	const props = defineProps({
		source: Number,
		target: Number,
		currentLoc: [Number, Number],
		currentLayer: Number,
	})

	const translation = translationTable()
	const graph = graphData()
	const polygon = ref<number[][]>([])

	function drawScreen(canvasCtx: CanvasRenderingContext2D, polygonData: number[][], currentLayer: number) {
		for (let polygonDat of polygonData.filter(dat => dat[8] == currentLayer)) {
			canvasCtx.beginPath()
			canvasCtx.strokeStyle = `rgb(${polygonDat[9]}, ${polygonDat[10]}, ${polygonDat[11]})`
			canvasCtx.moveTo(polygonDat[0], polygonDat[1])
			canvasCtx.lineTo(polygonDat[2], polygonDat[3])
			canvasCtx.lineTo(polygonDat[4], polygonDat[5])
			canvasCtx.lineTo(polygonDat[6], polygonDat[7])
		}
	}

	onMounted(() => {
		fetch('/data/graph.csv')
		.then(response => response.text())
		.then(data => {graph.defineGraph(data)})
		.catch(error => {console.error("error fetching graph.csv: ", error)})

		fetch('/data/translation.csv')
		.then(response => response.text())
		.then(data => {translation.defineAlias(data)})
		.catch(error => {console.error("error fetching translation.csv: ", error)})

		fetch('/data/graphic.csv')
		.then(response => response.text())
		.then(data => {
			polygon.value = data.split('\n').map(dataBlock => dataBlock.split(',').map(val => parseInt(val)))
		})
		.catch(error => {console.error("error fetching graphic.csv: ", error)})

		if (canvas.value && canvas.value.getContext) {
			const ctx = canvas.value.getContext("2d")
			if (ctx) {
				drawScreen(ctx, polygon.value, props.currentLayer as number)			
			}
		}
	})
</script>

<template>
	<canvas ref="canvas-ref" />
</template>
