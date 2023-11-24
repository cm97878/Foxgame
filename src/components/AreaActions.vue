<template>
    <div v-show="active === 'areaActions'">
        yippee!
    </div>
</template>


<script setup lang="ts">
const name = "areaActionsPanel";

let props = defineProps({
    active: String
})
</script>