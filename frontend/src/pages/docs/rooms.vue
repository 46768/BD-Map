<script setup lang="ts">
	import { ref } from 'vue'
	import Content from '@/pages/docs/components/content.vue'
	import Linker from '@/pages/docs/components/linker.vue'

	const typeName = ref("Room");
</script>

<template>
	<main>
		<p class="text-2xl inline-block">data type</p>
		<p class="text-6xl inline-block">{{ typeName }}</p>
		<p class="text-xl">data type description</p>

		<Content />

		<div class="relative top-36">
			<p class="text-6xl">Properties</p>
			<div>
				<p class="text-4xl">polygon</p>
				<p class="text-2xl">The polygon to attach room metadata to</p>
				<p class="text-2xl">type: <code><Linker module="Polygon" /></code></p>
			</div>
		</div>
	</main>
</template>

<style></style>
