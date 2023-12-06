<template>
    <div v-show="active === 'areaActions'" class="area-box">
        <span>Exploration Progress: {{ player.totalScouted  }} zones scouted.</span>
        <span>Exploration Multiplier: {{ (1+(player.totalScouted/10)) }}x</span>
        <button>Explore</button>
    </div>
</template>


<script setup lang="ts">
import { usePlayer } from '@/stores/player';

const name = "areaActionsPanel";

const player = usePlayer();

let props = defineProps({
    active: String
})
</script>
<style>
    .area-box {
        display: flex;
        flex-direction: column;
        padding-top: 10px;
    }
</style>