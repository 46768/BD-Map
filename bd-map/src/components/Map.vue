<script setup lang="ts">
	import { ref, useTemplateRef, onMounted } from 'vue'
	import { graphData } from '../stores/graphData'
	import { translationTable } from '../stores/translationTable'
	const canvas = useTemplateRef('canvas-ref')
	const props = defineProps<{
		source: number,
		target: number,
		currentLoc: [number, number],
		currentLayer: number,
	}>()

	const translation = translationTable()
	const graph = graphData()
	const polygon = ref<number[][]>([])

	const canvasCtx = ref<CanvasRenderingContext2D | null>(null)

	const x = ref<number>(window.innerWidth/2)
	const y = ref<number>(window.innerHeight/2)
	const dragging = ref<boolean>(false)

	async function fetchData(file: string, callback: Function) {
		fetch(`/BD-Map/data/${file}`)
		.then(response => response.text())
		.then(text => {callback(text)})
		.catch(error => console.error(`Failed fetching ${file}: `, error))
	}

	function drawScreen(canvasCtx: CanvasRenderingContext2D, polygonData: number[][], currentLayer: number) {
		canvasCtx.canvas.height = window.innerHeight
		canvasCtx.canvas.width = window.innerWidth
		canvasCtx.fillStyle = "rgb(0, 204, 102)"
		canvasCtx.fillRect(0, 0, window.innerWidth, window.innerHeight)
		for (let polygonDat of polygonData) {
			canvasCtx.fillStyle = `rgb(${polygonDat[5]}, ${polygonDat[6]}, ${polygonDat[7]})`
			canvasCtx.fillRect(polygonDat[0]+x.value, polygonDat[1]+y.value, polygonDat[2], polygonDat[3])
		}
	}

	function mouseBtnHandler(evt: MouseEvent) {
		dragging.value = !dragging.value
	}
	
	function mouseMoveHandler(evt: MouseEvent) {
		if (dragging.value) {
			x.value += evt.movementX
			y.value += evt.movementY
			if (canvasCtx.value) drawScreen(canvasCtx.value, polygon.value, props.currentLayer)
		}
	}

	function adjustScreen() {
		if (canvasCtx.value) {
			drawScreen(canvasCtx.value, polygon.value, props.currentLayer)	
		}
	}

	onMounted(() => {
		window.addEventListener('resize', adjustScreen)
		if (canvas.value && canvas.value.getContext) {
			const ctx = canvas.value.getContext("2d")
			if (ctx) {
				canvasCtx.value = ctx
			}
		}

		fetchData("graph.csv", graph.defineGraph)
		fetchData("translation.csv", translation.defineAlias)
		fetchData("graphic.csv", (data: string) => {
			polygon.value = data.split('\n').map(dataBlock => dataBlock.split(',').map(val => parseInt(val)))
			if (canvasCtx.value) {
				drawScreen(canvasCtx.value, polygon.value, props.currentLayer)	
			}
		})
	})
</script>

<template>
	<canvas
		@mousedown="mouseBtnHandler"
		@mouseup="mouseBtnHandler"
		@mousemove="mouseMoveHandler"
		ref="canvas-ref"></canvas>
</template>
