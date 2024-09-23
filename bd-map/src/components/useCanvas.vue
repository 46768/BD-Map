<script setup lang='ts'>
	import { ref, watch, defineExpose, defineProps } from 'vue'
	import type { CanvasCoord } from '../definitions/canvas'
	const props = defineProps<{
		width: number,
		height: number,
	}>()
	const position = ref<CanvasCoord>({x: 0, y: 0})
	const cvsRef = ref<HTMLCanvasElement | null>()
	const ctx = ref<CanvasRenderingContext2D | null>()
	const height = ref<number>(props.height)
	const width = ref<number>(props.width)
	const dragging = ref<boolean>(false)
	function handleMUp() {
		dragging.value = false
	}

	function handleMDown() {
		dragging.value = true
	}

	function handleMMove(evt: MouseEvent) {
		if (dragging) {
			position.value.x += evt.movementX
			position.value.y += evt.movementY
		}
	}
		
	watch(cvsRef, (newRef) => {
		if (newRef) {
			ctx.value = newRef.getContext("2d")
		}
	})
	watch(() => props.width, (newWidth) => {
		width.value = newWidth
		console.log(`new width: ${newWidth}`)
	})
	watch(() => props.height, (newHeight) => {
		height.value = newHeight
		console.log(`new height: ${newHeight}`)
	})
	defineExpose({ position, ctx })
</script>

<template>
	<canvas ref="csvRef" @mouseup="handleMUp" @mousedown="handleMDown" @mousemove="handleMMove"
		:width="width" :height="height"></canvas>
</template>
