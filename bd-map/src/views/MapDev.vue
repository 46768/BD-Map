<script setup lang='ts'>
	import Map from '../components/Map.vue'
</script>

<template>
	<Map
			:source="1"
			:target="1"
			:current-loc="[0,0]"
			:current-layer="0"
			graph-c-s-v=""
			graphic-c-s-v=""
			translation-c-s-v=""
			class="fixed top-0 left-0"
			/>

		<input type="file" accept="text/csv" class="fixed left-2 bottom-2"></input>
</template>
