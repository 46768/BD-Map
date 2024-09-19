<script setup lang="ts">
	import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<nav class="w-full relative top-0 z-50">
		<RouterLink to='/'>Home</RouterLink>
		<RouterLink to='/about'>About</RouterLink>
		<RouterLink to='/mapdev'>Map Editor</RouterLink>
	</nav>
	<main>
		<RouterView />
	</main>
</template>

<style scoped>
	a {
		margin: 10px;
		font-size: 2.5rem;
		transition: 100ms;
	}

	a:hover {
		border: solid var(--color-border-hover);
		border-radius: 5px;
	}
</style>
