<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <nav class="w-full relative top-4 z-50">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/dev/editor">Map Editor</RouterLink>
        <RouterLink to="/dev/editor/parser">p</RouterLink>
        <RouterLink to="/dev/editor/parserv2">p2</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<style scoped>
a {
    margin: 10px;
    padding-left: 2px;
    padding-right: 2px;
    font-size: 2rem;
    transition: 100ms;
    background: var(--color-el-background);
    border: solid var(--color-border) 1px;
    border-radius: 5px;
}

a:hover {
    border: solid var(--color-border-hover) 2px;
    border-radius: 5px;
    background: var(--color-el-background-hover);
}
</style>
