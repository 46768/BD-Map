<script setup lang='ts'>
	import { ref, watch } from 'vue'
	import { Polygon } from '@/components/map/polygon.class/main'
	import Map from '@/components/map/Map.vue'
	import PolygonConfigurator from './polygonConfigurator.component/PolygonConfigurator.vue'
	
	const placeholder = ref<Polygon>(new Polygon("placeholder", 0, [0, 0, 0, 0], [0, 1, 2, 3, 4, 5, 6, 7]))

	watch(placeholder, () => console.log(placeholder.value), { immediate: true })
</script>

<template>
	<Map class="z-0" :coord="{x: 0, y: 0, layer: 0}" :data="{graph:[], translation:[], graphic:[]}"/>
	<PolygonConfigurator class="fixed top-10 right-2 z-10" v-model="placeholder"/>
	<!--UI-->
	<div>
	</div>
</template>

<style>
</style>
