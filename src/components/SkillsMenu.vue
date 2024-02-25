<template>
    <div v-if="props.open" class="skill-menu">
        <div class="skill"><span>Ultima</span><span>SP2</span></div>
        <div class="skill"><span>Flare</span><span>SP4</span></div>
        <div class="skill"><span>Firaga</span><span>SP3</span></div>
        <div class="skill"><span>Stop</span><span>SP1</span></div>
        
    </div>
</template>
<script setup lang="ts">
    let props = defineProps<{
        open: boolean
    }>()
</script>
<style>
.skill-menu {
    position:absolute;
    width: 100%;
    min-height: 98px;
    background-image: linear-gradient(rgb(0, 83, 173), rgb(0, 27, 133));
    border: 3px white outset;
    z-index: 3;
    display:flex;
    font-size:26px;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    border-radius: 8px;
}
.skill {
    display:flex;
    justify-content: space-between;
    flex-basis:48%;
    color: white;
    margin:0 4px;
}
</style>