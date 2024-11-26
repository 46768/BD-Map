<script setup lang="ts">
	import { ref } from 'vue'
	import Content from '@/pages/docs/components/content.vue'

	const className = ref("Classname");
</script>

<template>
	<main>
		<p class="text-2xl inline-block">class</p>
		<p class="text-6xl inline-block">{{ className }}</p>
		<p class="text-xl">class description</p>

		<Content />

		<div class="relative top-36">
			<div>
				<p class="text-4xl">constructor</p>
				<p class="text-2xl">constructor desc</p>
				<p class="text-2xl"><code>{{ className }}(arg1: type1, arg2: type2)</code></p>
			</div>

			<div class="mt-4">
				<p class="text-6xl">Properties</p>
			</div>

			<div class="mt-4">
				<p class="text-6xl">Methods</p>
				<div class="mt-4">
					<p class="text-4xl">method</p>
					<p class="text-2xl">method desc</p>
					<p class="text-2xl"><code>method(arg1: type1, arg2: type2)</code></p>
				</div>
			</div>
		</div>
	</main>
</template>

<style></style>
