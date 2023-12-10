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
import { usePlayer } from '@/stores/player';
import { useEventStore } from '@/stores/eventStore';
import { VueFlow, useVueFlow, type GraphNode } from '@vue-flow/core';
import { Zone } from '@/enums/areaEnums';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { GameStage } from '@/enums/gameStage';
import { useCombatStore } from '@/stores/combatStore';


const name = "overmappanel";
const mapStore = useMapStore();
const player = usePlayer();
const eventStore = useEventStore();
const combatStore = useCombatStore();

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

    refreshMap();
})
onNodeClick((node) => {
    if (isConnected(node)) {
        if(player.firstMove) {
            player.firstMove = false;
            combatStore.startCombat(mapStore.enemyList[0]);
            eventStore.callCutscene(eventStore.cutscenes.get("firstMove"));
        }
        mapStore.selectedNode = findNode(node.node.id)!;
        mapStore.setTextAppend()
        if(player.gameStage != GameStage.INTRO) {
            mapStore.callRandomEncounter(Zone.FOREST)
        }
    }
})
const isConnected = function(node: any): boolean {
    return !!getConnectedEdges(mapStore.selectedNode.id).find( 
        connection => (connection.target === node.node.id || connection.source === node.node.id)
    )
}


const scoutRevealNodes = function(element:GraphNode) {
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
const refreshMap = function() {
    nodes.value.forEach(element => {
        if(element.data?.killCount >= element.data?.scoutThreshold) {
            element.hidden = false;
            element.data.intereactable = true;

            scoutRevealNodes(element);
        }
    });
}


const { scouted$ } = storeToRefs(mapStore)

watch(scouted$, (signal) => {
    if(signal === "$REFRESH$") {
        refreshMap();
    }
    else {
        let scoutNode = findNode(signal);
        if(scoutNode) {
            scoutRevealNodes(scoutNode);
        }
    }
})


</script>
