<script setup lang="ts">
	import { ref } from 'vue'
	import Content from '@/pages/docs/components/content.vue'

	const typeName = ref("Typename");
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
				<p class="text-4xl">property</p>
				<p class="text-2xl">property desc</p>
				<p class="text-2xl">type: <code>type</code></p>
			</div>
		</div>
	</main>
</template>

<style></style>
