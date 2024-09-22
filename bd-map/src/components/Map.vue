<script setup lang="ts">
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import type { CanvasCoord } from '../definitions/canvas'
	import useCanvas from './useCanvas.vue'

	const cvsCoord = ref<CanvasCoord>({x: 0, y: 0})
	const cvsCtx = ref<CanvasRenderingContext2D | null>()
	const wHeight = ref<number>(window.innerHeight)
	const wWidth = ref<number>(window.innerWidth)

	
	function drawBackground(ctx: CanvasRenderingContext2D, r: number, g: number, b: number) {
		ctx.fillRect(0, 0, wWidth.value, wHeight.value)
	}


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
	<useCanvas class="fixed top-0 left-0" :width="wWidth" :height="wHeight"
	:position="cvsCoord" :ctx="cvsCtx"/>
</template>
