<template>
    <div id="maps_container">
        <div id="map_keynodes">
            {{ mapStuff.getAreaName }} <br />
            <div v-show="mapStuff.isSpecial">
                special 
                <!-- every special tab will look way different, but also this isnt where this shit will
                display, so who cares lmao. -->
                <br />
                <button @click="mapStuff.elements[3].hidden = true">Hide node 4</button>
            </div>
            <div v-show="!mapStuff.isSpecial">
                {{ mapStuff.getDescription }} {{ mapStuff.getDescAppend }}
            </div>
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

const { nodesDraggable, onPaneReady, elementsSelectable, onNodeClick, findNode, findEdge, getConnectedEdges } = useVueFlow();
onPaneReady((instance) => {
    nodesDraggable.value = false;
    elementsSelectable.value = true;
    instance.setCenter(0, 0, {zoom: 1})
    mapStuff.selectedNode = findNode("1")!;
})
onNodeClick((node) => {
    //Check adjacency.
    //debugger;
    console.log(node.node.id)
    const isConnected = getConnectedEdges(mapStuff.selectedNode.id).find( connection => connection.target || connection.source === node.node.id)

    if (isConnected) {
        mapStuff.selectedNode = findNode(node.node.id)!;
        mapStuff.setTextAppend()
    }
})

</script>