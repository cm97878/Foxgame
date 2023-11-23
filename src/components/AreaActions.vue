<template>
    <div v-show="active === 'soulUpgrades'">
        yippee!
    </div>
</template>


<script setup lang="ts">
const name = "areaActionsPanel";

let props = defineProps({
    active: String
})
</script>