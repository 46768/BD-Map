<script setup lang="ts">
	import { ref, useTemplateRef, computed, onMounted, onBeforeUnmount } from 'vue'
	import type { CanvasCoord, IShapeData } from '../definitions/canvas'
	import useCanvas from './useCanvas.vue'

	const cvsRef = useTemplateRef("use-cvs")
	const cvsCoord = computed(() => {return cvsRef.value?.position})
	const cvsCtx = computed(() => {return cvsRef.value?.ctx})
	const wHeight = ref<number>(window.innerHeight)
	const wWidth = ref<number>(window.innerWidth)

	const iShapeData = ref<IShapeData[]>([])

	function CanvasCoord(x: number, y: number): CanvasCoord {
		return { x: x, y: y }
	}

	
	function drawBackground(ctx: CanvasRenderingContext2D, r: number, g: number, b: number) {
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
		ctx.fillRect(0, 0, wWidth.value, wHeight.value)
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

			const lineGap: number = 32
			const cH: number = ctx.canvas.width
			const cW: number = ctx.canvas.height

			drawBackground(cvsCtx.value, 0, 204, 102)
			
			for (let lX = 0; lX < cW+lineGap; lX+=lineGap) {
				drawLine(
				ctx,
				CanvasCoord(lX+(cvsCoord.value.x%lineGap), 0),
				CanvasCoord(lX+(cvsCoord.value.x%lineGap), cH),
				"rgba(70, 70, 70, 0.25"
				)
			}
			for (let lY = 0; lY < cH+lineGap; lY+=lineGap) {
				drawLine(
				ctx,
				CanvasCoord(0, lY+(cvsCoord.value.y%lineGap)),
				CanvasCoord(cW, lY+(cvsCoord.value.y%lineGap)),
				"rgba(70, 70, 70, 0.25)"
				)
			}
		}
	}

	drawCanvas()


	function updateWDim() {
		wHeight.value = window.innerHeight
		wWidth.value = window.innerWidth
	}

	onMounted(() => {
		window.addEventListener('resize', updateWDim)
	})
	onBeforeUnmount(() => {
		window.removeEventListener('resize', updateWDim)
	})
</script>

<template>
	<useCanvas class="fixed top-0 left-0" :width="wWidth" :height="wHeight" ref="use-cvs"/>
</template>
