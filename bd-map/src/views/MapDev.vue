<script setup lang='ts'>
	import Map from '../components/Map.vue'
	import { computed, ref } from 'vue'
	const fileReader = new FileReader()
	const fileData = ref<string>("")

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
	<Map/>
	<input accept="text/csv" type="file" @change="handleFileInput" class="fixed bottom-2 left-2 w-1/6"></input>
</template>
