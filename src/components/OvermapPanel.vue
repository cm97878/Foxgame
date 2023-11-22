<template>
    <div id="maps_container">
        <div id="map_keynodes">

        </div>
        <VueFlow v-model="mapStuff.elements" class="general_outline">

        </VueFlow>
    </div>
</template>


<script setup lang="ts">
import { useMapStuff } from '@/stores/mapStuff';
import { VueFlow, useVueFlow } from '@vue-flow/core';

const name = "overmappanel";
const mapStuff = useMapStuff();

const { nodesDraggable, onPaneReady, elementsSelectable, onNodeClick } = useVueFlow();
onPaneReady((instance) => {
    nodesDraggable.value = false;
    elementsSelectable.value = true;
    instance.setCenter(0, 0, {zoom: 1})
    console.log("test")
})
onNodeClick((node) => {
    console.log(node.node.label);
})

</script>
