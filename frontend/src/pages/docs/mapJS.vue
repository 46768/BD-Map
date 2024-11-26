<script setup lang="ts">
	import { ref } from 'vue'
	import Content from '@/pages/docs/components/content.vue'
	import Linker from '@/pages/docs/components/linker.vue'

	const className = ref("MapJS");
</script>

<template>
	<main>
		<p class="text-2xl inline-block">class</p>
		<p class="text-6xl inline-block">{{ className }}</p>
		<p class="text-xl">This is the entry point of every map, this class contains the methods to load and display map data onto a canvas</p>

		<Content />

		<div class="relative top-36">
			<div>
				<p class="text-4xl">constructor</p>
				<p class="text-2xl">construct a mapJS</p>
				<p class="text-2xl"><code>{{ className }}()</code></p>
			</div>

			<div class="mt-4">
				<p class="text-6xl">Properties</p>
			</div>

			<div class="mt-4">
				<p class="text-6xl">Methods</p>
				<div class="mt-4">
					<p class="text-4xl">attachCanvas</p>
					<p class="text-2xl">Attach a canvas context to the map</p>
					<p class="text-2xl"><code>attachCanvas(ctx: CanvasRenderingContext2D)</code></p>
				</div>

				<div class="mt-4">
					<p class="text-4xl">detachCanvas</p>
					<p class="text-2xl">Detach currently attached canvas context to the map. Does nothing if no context is attached</p>
					<p class="text-2xl"><code>detachCanvas()</code></p>
				</div>

				<div class="mt-4">
					<p class="text-4xl">addRooms</p>
					<p class="text-2xl">Detach currently attached canvas context to the map. Does nothing if no context is attached</p>
					<p class="text-2xl"><code>addRooms(rooms: <Linker module="Room" /> | <Linker module="Room" />[])</code></p>
				</div>
			</div>
		</div>
	</main>
</template>

<style></style>
