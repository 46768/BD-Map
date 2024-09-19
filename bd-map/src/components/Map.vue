<script setup lang="ts">
	import { useTemplateRef, onMounted } from 'vue'
	const canvas = useTemplateRef('canvas-ref')

	onMounted(() => {
		if (canvas.value && canvas.value.getContext) {
			const ctx = canvas.value.getContext("2d")
			if (ctx) {
				ctx.fillRect(25, 25, 100, 100)
				ctx.clearRect(45, 45, 60 ,60)
				ctx.strokeRect(50, 50, 50, 50)
			}
		}
	})
</script>

<template>
	<canvas ref="canvas-ref" />
</template>
