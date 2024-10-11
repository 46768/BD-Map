<script setup lang="ts">
import MapDisplay from '@/mod/display/map/MapDisplay.vue';
</script>

<template>
    <div>
        <MapDisplay :gps-coord="[0, 0]" :path-data="[]" :room-data="[]" />
    </div>
</template>

<style></style>
