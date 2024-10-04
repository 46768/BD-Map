<script setup lang="ts">
	import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
	import { vDrag } from '@/directives/vDrag'
	import { vMouse } from '@/directives/vMouse'
	import type { CanvasCoord, IShapeData } from './def'

	const cvsRef = ref<HTMLCanvasElement>()
	const cvsCoord = ref({x: 0, y: 0})
	const cvsCtx = 	ref<CanvasRenderingContext2D | null>()
	const wHeight = ref<number>(window.innerHeight)
	const wWidth = ref<number>(window.innerWidth)

	const props = defineProps<{
		coord: {x: number, y: number, layer: number}
		data: {graph: number[][], translation: [number, ...string[]][], graphic: IShapeData[]}
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

	function drawShape(ctx: CanvasRenderingContext2D, shapeData: number[], shapeColor: [number, number, number, number], highlighed: boolean) {
		if (shapeData.length % 2 != 0) {console.error("shapeData Invalid"); return;}
		const coord = cvsCoord.value

		ctx.fillStyle = `rgba(${shapeColor[0]}, ${shapeColor[1]}, ${shapeColor[2]}, ${shapeColor[3]})`
		ctx.beginPath()
		ctx.moveTo(shapeData[0]+coord.x, shapeData[1]+coord.y)
		for (let i = 1; i < (shapeData.length/2); i++) {
			ctx.lineTo(shapeData[2*i]+coord.x, shapeData[(2*i)+1]+coord.y)
		}
		ctx.lineTo(shapeData[0]+coord.x, shapeData[1]+coord.y)
		ctx.fill()
		if (highlighed) {
			ctx.strokeStyle = `rgba(39, 153, 230, 1)`
			ctx.lineWidth = 5
			ctx.beginPath()
			ctx.moveTo(shapeData[0]+coord.x, shapeData[1]+coord.y)
			for (let i = 1; i < (shapeData.length/2); i++) {
				ctx.lineTo(shapeData[2*i]+coord.x, shapeData[(2*i)+1]+coord.y)
			}
			ctx.lineTo(shapeData[0]+coord.x, shapeData[1]+coord.y)
			ctx.stroke()
		}
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

			drawShape(ctx, [-50, -50, 50, -50, 50, 50, -50, 50], [255, 0, 0, 0.5], false)
			for (let polygon of props.data.graphic.filter(pData => pData.shapeLayer.value == props.coord.layer)) {
				drawShape(ctx, polygon.shapeDrawn.value, polygon.shapeColor.value, polygon.hightlighted.value)
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

	watch(() => props.data.graphic, () => drawCanvas())

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
				ref="cvsRef" v-drag="handleVDrag" v-mouse="handleVMouse"></canvas>
		<p>hello?</p>
	</div>
</template>
