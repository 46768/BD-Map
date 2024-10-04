<script setup lang="ts">
	import Map from '@/components/map/Map.vue'
	import { ref, onMounted } from 'vue'
	import cacheFetch from '@/components/utils/cacheFetch'
	import type { IShapeData } from '@/components/map/def' 

	const graphicData = ref<IShapeData[]>([])
	const graphData = ref<number[][]>([])
	const translationData = ref<[number, ...string[]][]>([])
</script>

<template>
	<Map :coord="{x:0,y:0,layer:0}" :data="{graph:graphData,translation:translationData,graphic:graphicData}"/>
</template>
