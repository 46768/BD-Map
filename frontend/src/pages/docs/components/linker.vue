<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	const slots = defineProps<{
		module: string
	}>()
	const linkName = ref(slots.module ?? "")
	const linkURL = ref(linkName.value == "" ? "/BD-Map/docs" : `/BD-Map/docs/${linkName.value.toString().toLowerCase()}`)

	onMounted(() => {
		console.log(linkName.value)
	})
</script>

<template>
	<a :href=linkURL>{{ linkName }}</a>
</template>
