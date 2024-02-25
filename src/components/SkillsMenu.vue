<template>
    <div v-if="props.open" class="skill-menu">
        <div class="skill"><span>Ultima</span><span>SP2</span></div>
        <div class="skill"><span>Flare</span><span>SP4</span></div>
        <div class="skill"><span>Firaga</span><span>SP3</span></div>
        <div class="skill"><span>Stop</span><span>SP1</span></div>
        
    </div>
</template>
<script setup lang="ts">
    //TODO: Make this actually do something.
    let props = defineProps<{
        open: boolean
    }>()
</script>
<style>
.skill-menu {
    position:absolute;
    width: 100%;
    min-height: 94px;
    background-image: linear-gradient(rgb(0, 83, 173), rgb(0, 27, 133));
    border: 3px white outset;
    z-index: 3;
    display:flex;
    font-size:26px;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    border-radius: 8px;
    padding: 2px 0;
}
.skill {
    display:flex;
    justify-content: space-between;
    flex-basis:48%;
    color: white;
    margin:0 4px;
    padding: 0 4px;
    border-radius: 4px;
    cursor: pointer;
}

.skill:hover {
    animation: hoverSelect 1s linear infinite;
}

@keyframes hoverSelect {
    0%, 100% {
        background-color: rgba(255, 255, 255, 0.2)
    }

    50% {
        background-color: rgba(255, 255, 255, 0.6)
    }
}
</style>