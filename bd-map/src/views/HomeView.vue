<script setup lang="ts">
	import Map from '../components/Map.vue'
	import { ref, onMounted } from 'vue'
	const graphicData = ref<string>("")
	const graphData = ref<string>("")
	const translationData = ref<string>("")

	fetch('/BD-Map/data/graphic.csv')
	.then(res => res.text())
	.then(text => {graphicData.value = text; console.log(graphicData.value)})
	.catch(error => console.error("Failed fetching graphic.csv: HomeView: ", error))

	fetch('/BD-Map/data/translation.csv')
	.then(res => res.text())
	.then(text => {translationData.value = text; console.log(translationData.value)})
	.catch(error => console.error("Failed fetching translation.csv: HomeView: ", error))

	fetch('/BD-Map/data/graph.csv')
	.then(res => res.text())
	.then(text => {graphData.value = text; console.log(graphData.value)})
	.catch(error => console.error("Failed fetching graph.csv: HomeView: ", error))

	onMounted(() => {
	})
</script>

<template>
	<Map 
	:source="0"
	:target="0"
	:current-loc="[0,0]"
	:current-layer="0" 
	:graph-c-s-v="graphData"
	:translation-c-s-v="translationData"
	:graphic-c-s-v="graphicData"
	class="fixed top-0 left-0"/>
</template>
