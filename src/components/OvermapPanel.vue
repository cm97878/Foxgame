<template>
    <div id="maps_container">
        <div id="map_keynodes">
            {{ mapStore.getAreaName }} <br />
            <div v-show="mapStore.isSpecial">
                special 
                <!-- every special tab will look way different, but also this isnt where this shit will
                display, so who cares lmao. -->
                <br />
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

const name = "overmappanel";
const mapStore = useMapStore();

const { nodesDraggable, onPaneReady, elementsSelectable, onNodeClick, 
    findNode, findEdge, getConnectedEdges, addEdges, nodes } = useVueFlow();
onPaneReady((instance) => {
    nodes.value.forEach( element => {
        element.hidden = true;
    })


    addEdges(mapStore.edges);
    nodesDraggable.value = false;
    elementsSelectable.value = true;
    instance.setCenter(0, 0, {zoom: 1})
    mapStore.selectedNode = findNode("1")!;
    nodes.value.forEach(element => {
        if(element.data?.killCount?.gte(element.data?.scoutThreshold)) {
            element.hidden = false;
            element.data.intereactable = true;
            //Add !hidden and interactable to all edges and nodes grabbed by this function.
            const edges = getConnectedEdges(element.id);
            edges.forEach(element => {
                let node = findNode(element.target);
                if(node) {
                    node.hidden = false;
                    node.data.interactable = true;
                    let secondEdges = getConnectedEdges(node.id);
                    secondEdges.forEach(innerEl => {
                        let innerNode = findNode(innerEl.target);
                        if(innerNode) {
                            innerNode.hidden = false;
                        }
                    })
                }
            })
        }
    });
})
onNodeClick((node) => {
    if (isConnected(node)) {
        mapStore.selectedNode = findNode(node.node.id)!;
        mapStore.setTextAppend()
        mapStore.callRandomEncounter(Zone.FOREST)
    }
})
const isConnected = function(node: any): boolean {
    return !!getConnectedEdges(mapStore.selectedNode.id).find( 
        connection => (connection.target === node.node.id || connection.source === node.node.id)
    )
}




</script>
