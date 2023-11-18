<template>
    <div v-show="active === 'soulUpgrades'" class="general_margin">
        yippee!
    </div>
</template>


<script setup lang="ts">
const name = "soulupgradepanel";

let props = defineProps({
    active: String
})
</script>