<template>
    <div class="carousel_item" :style="{ backgroundColor: iconDefine }"></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
    icon: String
})


const iconDefine = computed(() =>{
    if(props.icon=="player") {
        return "green";
    }
    else {
        return "red";
    }
})

/* So, X+2 slots, say, 7 (5+2). Slot 0 is empty and serves as a spot to
move slot 1 to, fade out, delete, and slot 7 serves to place new icon,
move to 6, fade in. Simple div with a background. issue is separate div ids
but i might just do like. loop index + 7 to account for the initial 7 created */

//background-image: url('../../images/image.png');
</script>