<script setup lang="ts">
	import Map from '../components/Map.vue'
</script>

<template>
	<Map :source="0" :target="0" :current-loc="[0,0]" :current-layer="0" class="fixed top-0 left-0"/>
</template>
