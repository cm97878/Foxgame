<template>
    <div class="carousel_item" :class="[iconDefine]"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    icon: String
})

const iconDefine = computed(() =>{
    if(props.icon=="player") {
        return "player";
    }
    else {
        return "enemy";
    }
})

</script>
<style>
.player {
    background-image: url('./src/assets/turnjewel.png');
}
.enemy {
    background-image: url('./src/assets/enemyjewel.png');
}
</style>