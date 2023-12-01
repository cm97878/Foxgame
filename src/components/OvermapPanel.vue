<template>
    <div id="maps_container">
        <div id="map_keynodes">
            {{ mapStore.getAreaName }} <br />
            <div v-show="mapStore.isSpecial">
                special 
                <!-- every special tab will look way different, but also this isnt where this shit will
                display, so who cares lmao. -->
                <br />
                <button @click="mapStore.nodes[3].hidden = true">Hide node 4</button>
            </div>
            <div v-show="!mapStore.isSpecial">
                {{ mapStore.getDescription }} {{ mapStore.getDescAppend }}
            </div>
        </div>
        <VueFlow :nodes="mapStore.nodes" class="general_outline">

        </VueFlow>
    </div>
</template>


<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore.js';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Zone } from '@/enums/areaEnums';
import { watch } from 'vue';

const name = "overmappanel";
const mapStore = useMapStore();

const { nodesDraggable, onPaneReady, elementsSelectable, onNodeClick, 
    findNode, findEdge, getConnectedEdges, addEdges } = useVueFlow();
onPaneReady((instance) => {
    addEdges(mapStore.edges);
    nodesDraggable.value = false;
    elementsSelectable.value = true;
    instance.setCenter(0, 0, {zoom: 1})
    mapStore.selectedNode = findNode("1")!;
})
onNodeClick((node) => {
    //Check adjacency.
    const isConnected = getConnectedEdges(mapStore.selectedNode.id).find( 
        connection => (connection.target === node.node.id || connection.source === node.node.id)
    )

    if (isConnected) {
        mapStore.selectedNode = findNode(node.node.id)!;
        mapStore.setTextAppend()
        mapStore.callRandomEncounter(Zone.FOREST)
    }
})




</script>
