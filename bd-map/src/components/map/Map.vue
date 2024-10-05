<script setup lang="ts">
	import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
	import { vDrag } from '@/directives/vDrag'
	import { vMouse } from '@/directives/vMouse'
	import { Polygon } from './polygon.class/main'
	import type { CanvasCoord } from './def'

	const cvsRef = ref<HTMLCanvasElement>()
	const cvsCoord = ref({x: 0, y: 0})
	const cvsCtx = 	ref<CanvasRenderingContext2D | null>()

	const props = defineProps<{
		coord: {x: number, y: number, layer: number}
		data: {graph: number[][], translation: [number, ...string[]][], graphic: Polygon[]}
		getCoord?: (inpt: CanvasCoord) => any
	}>()

	function CanvasCoord(x: number, y: number): CanvasCoord {
		return { x: x, y: y }
	}

	
	function drawBackground(ctx: CanvasRenderingContext2D, r: number, g: number, b: number) {
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	}

	function drawLine(ctx: CanvasRenderingContext2D, start: CanvasCoord, end: CanvasCoord, strokeStyle: string) {
		ctx.strokeStyle = strokeStyle
		ctx.beginPath()
		ctx.moveTo(start.x, start.y)
		ctx.lineTo(end.x, end.y)
		ctx.stroke()
	}

	function drawShape(ctx: CanvasRenderingContext2D, polygon: Polygon) {
		const coord = cvsCoord.value
		const [r, g, b, a] = polygon.color
		const vertices = polygon.vertices

		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
		ctx.beginPath()
		ctx.moveTo(vertices[0]+coord.x, vertices[1]+coord.y)
		for (let i = 1; i < (vertices.length>>1); i++) {
			ctx.lineTo(vertices[2*i]+coord.x, vertices[(2*i)+1]+coord.y)
		}
		ctx.closePath()
		ctx.fill()
		if (polygon.highlighted) {
			ctx.strokeStyle = `rgba(39, 153, 230, 1)`
			ctx.lineWidth = 5
			ctx.stroke()
		}
	}
			
	function drawCanvas() {
		if (cvsCtx.value) {
			const ctx: CanvasRenderingContext2D = cvsCtx.value
			const cW = window.innerWidth
			const cH = window.innerHeight
			const gridLineStyle = "rgba(70, 70, 70, 0.5)"
			ctx.canvas.width = cW
			ctx.canvas.height = cH

			const lineGap: number = 32

			const offsetX: number = cvsCoord.value.x%lineGap
			const offsetY: number = cvsCoord.value.y%lineGap

			drawBackground(ctx, 0, 204, 102)

			for (let lX = 0; lX < cW+lineGap; lX+=lineGap) {
				drawLine(
				ctx,
				CanvasCoord(lX+(offsetX), 0),
				CanvasCoord(lX+(offsetX), cH),
				gridLineStyle
				)
			}
			for (let lY = 0; lY < cH+lineGap; lY+=lineGap) {
				drawLine(
				ctx,
				CanvasCoord(0, lY+(offsetY)),
				CanvasCoord(cW, lY+(offsetY)),
				gridLineStyle
				)
			}

			for (let polygon of props.data.graphic.filter(pData => pData.layer == props.coord.layer)) {
				drawShape(ctx, polygon)
			}
		}
	}


	function updateWDim() {
		drawCanvas()
	}

	function handleVDrag(coordIn: CanvasCoord) {
		cvsCoord.value = coordIn
		if (props.getCoord) {
			props.getCoord(coordIn)
		}
		drawCanvas()
	}
	
	function handleVMouse() {
		drawCanvas()
	}

	watch(cvsRef, (newRef) => {
		if (newRef) {
			cvsCtx.value = newRef.getContext("2d")
			drawCanvas()
		}
	})

	watch(() => props.data.graphic, () => {
		drawCanvas()
	})

	onMounted(() => {
		window.addEventListener('resize', updateWDim)
	})
	onBeforeUnmount(() => {
		window.removeEventListener('resize', updateWDim)
	})
</script>

<template>
	<div>
		<canvas class="fixed top-0 left-0"
				ref="cvsRef" v-drag="handleVDrag" v-mouse="handleVMouse"></canvas>
		<p>hello?</p>
	</div>
</template>
