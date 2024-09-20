<script setup lang="ts">
	import { ref, useTemplateRef, onMounted, watch } from 'vue'
	import { graphData } from '../stores/graphData'
	import { translationTable } from '../stores/translationTable'
	const canvas = useTemplateRef('canvas-ref')
	const props = defineProps<{
		source: number,
		target: number,
		currentLoc: [number, number],
		currentLayer: number,
		translationCSV: string,
		graphCSV: string,
		graphicCSV: string,
	}>()

	const translation = translationTable()
	const graph = graphData()
	const polygon = ref<number[][]>([])

	const canvasCtx = ref<CanvasRenderingContext2D | null>(null)

	const x = ref<number>(window.innerWidth/2)
	const y = ref<number>(window.innerHeight/2)
	const dragging = ref<boolean>(false)

	function drawScreen(canvasCtx: CanvasRenderingContext2D, polygonData: number[][], currentLayer: number) {
		const VH: number = window.innerHeight
		const VW: number = window.innerWidth
		const lineGap: number = 32
		const lineStyle: string = "rgba(70, 70, 70, 0.25)"
		const lineOffsetX = (x.value) % lineGap
		const lineOffsetY = (y.value) % lineGap

		console.log(VH, VW)
		canvasCtx.canvas.height = VH
		canvasCtx.canvas.width = VW
		canvasCtx.fillStyle = "rgb(0, 204, 102)"
		canvasCtx.fillRect(0, 0, VW, VH)

		console.log(VH, VW)
		for (let xLine = 0; xLine < VW+lineGap; xLine+=lineGap) {
			canvasCtx.strokeStyle = lineStyle
			canvasCtx.beginPath()
			canvasCtx.moveTo(xLine + lineOffsetX, 0)
			canvasCtx.lineTo(xLine + lineOffsetX, VH)
			canvasCtx.stroke()
		}

		for (let yLine = 0; yLine < VH+lineGap; yLine+=lineGap) {
			canvasCtx.strokeStyle = lineStyle
			canvasCtx.beginPath()
			canvasCtx.moveTo(0, yLine + lineOffsetY)
			canvasCtx.lineTo(VW, yLine + lineOffsetY)
			canvasCtx.stroke()
		}

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

	function parseGraphic(csvData: string) {
		polygon.value = csvData.split('\n').map(dataBlock => dataBlock.split(',').map(val => parseInt(val)))
		if (canvasCtx.value) {
			drawScreen(canvasCtx.value, polygon.value, props.currentLayer)
		}
	}

	watch(() => props.graphicCSV, (newGraphic) => parseGraphic(newGraphic)) 
	watch(() => props.translationCSV, (newTranslation) => translation.defineAlias(newTranslation)) 
	watch(() => props.graphCSV, (newGraph) => graph.defineGraph(newGraph)) 

	onMounted(() => {
		window.addEventListener('resize', adjustScreen)
		if (canvas.value && canvas.value.getContext) {
			const ctx = canvas.value.getContext("2d")
			if (ctx) {
				canvasCtx.value = ctx
			}
		}

		console.log(props.graphicCSV)
		graph.defineGraph(props.graphCSV)
		translation.defineAlias(props.translationCSV)
		parseGraphic(props.graphicCSV)
	})
</script>

<template>
	<canvas
		@mousedown="mouseBtnHandler"
		@mouseup="mouseBtnHandler"
		@mousemove="mouseMoveHandler"
		ref="canvas-ref"></canvas>
</template>
