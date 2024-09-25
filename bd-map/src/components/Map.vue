<script setup lang="ts">
	import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
	import { vDrag } from '../directives/vDrag'
	import type { CanvasCoord, IShapeData } from '../definitions/canvas'

	const cvsRef = ref<HTMLCanvasElement>()
	const cvsCoord = ref({x: 0, y: 0})
	const cvsCtx = 	ref<CanvasRenderingContext2D | null>()
	const wHeight = ref<number>(window.innerHeight)
	const wWidth = ref<number>(window.innerWidth)

	const iShapeData = ref<IShapeData[]>([])

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

	function drawShape(ctx: CanvasRenderingContext2D, shapeData: number[]) {
		if (shapeData.length % 2 != 0) {console.error("shapeData Invalid"); return;}

		ctx.beginPath()
		ctx.moveTo(shapeData[0], shapeData[1])
		for (let i = 1; i < (shapeData.length/2); i++) {
			ctx.lineTo(shapeData[2*i], shapeData[(2*i)+1])
		}
		ctx.lineTo(shapeData[0], shapeData[1])
		ctx.fill()
	}
			
	function drawCanvas() {
		if (cvsCtx.value) {
			const ctx: CanvasRenderingContext2D = cvsCtx.value
			const cW = window.innerWidth
			const cH = window.innerHeight

			ctx.canvas.width = cW
			ctx.canvas.height = cH

			const lineGap: number = 32

			const offsetX: number = cvsCoord.value.x%lineGap
			const offsetY: number = cvsCoord.value.y%lineGap
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

			drawBackground(ctx, 0, 204, 102)

			for (let lX = 0; lX < cW+lineGap; lX+=lineGap) {
				drawLine(
				ctx,
				CanvasCoord(lX+(offsetX), 0),
				CanvasCoord(lX+(offsetX), cH),
				"rgba(70, 70, 70, 0.25)"
				)
			}
			for (let lY = 0; lY < cH+lineGap; lY+=lineGap) {
				drawLine(
				ctx,
				CanvasCoord(0, lY+(offsetY)),
				CanvasCoord(cW, lY+(offsetY)),
				"rgba(70, 70, 70, 0.25)"
				)
			}
		}
	}


	function updateWDim() {
		wWidth.value = window.innerWidth
		wHeight.value = window.innerHeight
		drawCanvas()
		console.log("window resized")
	}

	function handleVDrag(coordIn: CanvasCoord) {
		cvsCoord.value = coordIn
		drawCanvas()
	}

	watch(cvsRef, (newRef) => {
		if (newRef) {
			cvsCtx.value = newRef.getContext("2d")
			drawCanvas()
		}
	})

	onMounted(() => {
		window.addEventListener('resize', updateWDim)
		console.log("reize handler mounted")
	})
	onBeforeUnmount(() => {
		window.removeEventListener('resize', updateWDim)
		console.log("reize handler unmounted")
	})
</script>

<template>
	<div>
		<canvas class="fixed top-0 left-0"
				ref="cvsRef" v-drag="handleVDrag"></canvas>
		<p>hello?</p>
	</div>
</template>
