<template>
    <Transition name="node-tooltip">
        <div v-show="mapStore.mouseoverNode" class="node-tooltip" :style="{ left: mapStore.x+3+'px', top: mapStore.y-103+'px' }">
            test
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore';

const name = "nodetooltip"

const mapStore = useMapStore();


</script>