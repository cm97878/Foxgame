<template>
    <Transition name="node-tooltip">
        <div 
        v-show="mapStore.mouseoverNode" 
        class="node-tooltip general_outline" 
        :style="{ left: x+7+'px', top: y-height-7+'px' }"
        ref="tooltip"
        >
            <div class="node-tooltip-title">
                {{ mapStore.mouseoverNode?.data.areaName }}
            </div>
            <div>
                {{ mapStore.mouseoverNode?.data.description }}
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/stores/mapStore';
    import { useMouse, useElementSize } from '@vueuse/core'
    import { computed, ref } from 'vue';

    const name = "nodetooltip"
    const tooltip = ref(null);

    const mapStore = useMapStore();

            //Tooltip Stuff
    const { x, y } = useMouse({ touch: false });

    const { height } = useElementSize(tooltip);




</script>

<style>
  .selected-node {
    background:grey;
  }
  .node-tooltip {
        z-index: 100;
        min-width: 300px;
        max-width: 20%;
        word-wrap: normal;
        min-height: 150px;
        max-height: 30%;
        background-image: linear-gradient(rgb(53, 53, 53), rgb(25, 25, 25));
        border: 1px solid grey;
        position: absolute;
        padding: 5px;
    }
    .node-tooltip-title {
        font-size: 1.2em;
    }

    .node-tooltip-enter-active {
        transition: opacity 0.2s ease;
    }

    .node-tooltip-enter-from {
        opacity: 0;
    }
</style>