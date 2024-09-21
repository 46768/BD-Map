<script setup lang='ts'>
	import Map from '../components/Map.vue'
	import { computed, ref } from 'vue'
	const fileReader = new FileReader()
	const fileData = ref<string>("")
	const formattedDataGraphic = computed(() => {
		if (fileData.value === "") return ""
		const formattedArray = fileData.value.split('\n').map(data => {
			const dataArray = data.split(',')
			dataArray.shift()
			dataArray.push('0', '40', '40', '40', '50')
			return dataArray
		})
		formattedArray.pop()
		return formattedArray.join('\n')
	})
	const internalDataGraphic = computed(() => {
		
	})

	fileReader.addEventListener("load", () => {
		fileData.value = fileReader.result as string
	})

	function handleFileInput(evt: Event) {
		const elemnt = evt.target as HTMLInputElement
		if (elemnt.files && elemnt.files.length) {
			fileReader.readAsText(elemnt.files[0])
		}
	}
</script>

<template>
	<Map
			:source="1"
			:target="1"
			:current-loc="[0,0]"
			:current-layer="0"
			graph-c-s-v=""
			:graphic-c-s-v="formattedDataGraphic"
			translation-c-s-v=""
			class="fixed top-0 left-0"
			/>

		<input accept="text/csv" type="file" @change="handleFileInput" class="fixed bottom-2 left-2 w-1/6"></input>
</template>
