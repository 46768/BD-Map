<script setup lang="ts">
	import Map from '@/components/map/Map.vue'
	import { ref, onMounted } from 'vue'
	import { Polygon } from '@/components/map/polygon.class/main'
	import cacheFetch from '@/components/utils/cacheFetch'

	const graphicData = ref<Polygon[]>([])
	const graphData = ref<number[][]>([])
	const translationData = ref<[number, ...string[]][]>([])
</script>

<template>
	<Map :coord="{x:0,y:0,layer:0}" :data="{graph:graphData,translation:translationData,graphic:graphicData}"/>
</template>
