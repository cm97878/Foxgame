<template>
    <Transition name="node-tooltip">
        <div 
        v-show="mapStore.mouseoverNode && !mapStore.mouseoverNode.data.areaSpecialID" 
        class="node-tooltip general_outline" 
        :style="{ left: xStyle, top: yStyle }"
        ref="tooltip"
        >
            <div class="node-tooltip-title">
                {{ mapStore.mouseoverNode?.data.areaName }}
            </div>
            <div>
                {{ mapStore.mouseoverNode?.data.description }}
            </div>
            <hr class="solid">
            Enemies: 
            <span v-for="item, index in mapStore.enemyList.get(mapStore.mouseoverNode?.data.zone)">
                {{ item.name }},
                <!-- {{ item.name }}<span v-if="index != (mapStore.enemyList.length - 1)">, </span> -->
            </span>

            <div 
            v-if="mapStore.mouseoverNode?.data.killCount >= mapStore.mouseoverNode?.data.scoutThreshold" 
            class="node-tooltip-scouted">
                Scouted
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

    //TODO: Tooltip goes offscreen, need to lock it so it doesn't.
    const { x, y } = useMouse({ touch: false });

    const { height } = useElementSize(tooltip);

    const xStyle = computed(() => (x.value+7)+'px');
    const yStyle = computed(() => (y.value-height.value-7)+'px');



</script>

<style>
  .node-tooltip {
        z-index: 100;
        min-width: 300px;
        max-width: 20%;
        word-wrap: normal;
        max-height: 30%;
        background-image: linear-gradient(rgb(53, 53, 53), rgb(25, 25, 25));
        border: 1px solid grey;
        position: absolute;
        padding: 5px;
    }
    .node-tooltip-title {
        font-size: 1.2em;
    }
    .node-tooltip-scouted {
        font-size: .8em;
    }

    .node-tooltip-enter-active {
        transition: opacity 0.2s ease;
    }

    .node-tooltip-enter-from {
        opacity: 0;
    }
    hr.solid {
        border-top: 2px solid rgb(177, 177, 177);
        width: 90%;
    }
</style>