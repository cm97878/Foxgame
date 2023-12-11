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
        <div id="vf-map">
            <VueFlow :nodes="mapStore.nodes" class="general_outline">
                <template #node-custom ="{ data, id }">
                    <CustomNode :data="data" :id="id"></CustomNode>
                </template>
            </VueFlow>
        </div>
    </div>
</template>


<script setup lang="ts">
import CustomNode from './CustomNode.vue';
import { useMapStore } from '@/stores/mapStore.js';
import { usePlayer } from '@/stores/player';
import { useEventStore } from '@/stores/eventStore';
import { VueFlow, useVueFlow, type GraphNode } from '@vue-flow/core';
import { SpecialAreaId, Zone } from '@/enums/areaEnums';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { GameStage } from '@/enums/gameStage';
import { useCombatStore } from '@/stores/combatStore';


const name = "overmappanel";
const mapStore = useMapStore();
const player = usePlayer();
const eventStore = useEventStore();
const combatStore = useCombatStore();

const { nodesDraggable, onPaneReady, elementsSelectable, onNodeClick,  findNode, findEdge, getConnectedEdges,
     addEdges, nodes, edgesUpdatable, edgeUpdaterRadius, nodesConnectable, panOnDrag, setViewport } = useVueFlow({ id:"map"});

onPaneReady((instance) => {
    nodes.value.forEach( element => {
        element.hidden = true;
    })


    addEdges(mapStore.edges);
    nodesDraggable.value = false;
    elementsSelectable.value = true;
    edgesUpdatable.value = false;
    nodesConnectable.value = false;
    panOnDrag.value = false;

    edgeUpdaterRadius.value = 0;
    instance.setCenter(0, 0, {zoom: 1.0})
    mapStore.selectedNode = findNode("1")!;

    refreshMap();
})
onNodeClick((node) => {
    if (isConnected(node) && !combatStore.getActiveCombat) {
        if(player.firstMove) {
            player.firstMove = false;
            combatStore.startCombat(mapStore.enemyList[0]);
            eventStore.callCutscene(eventStore.cutscenes.get("firstMove"));
        }

        const chosenNode = findNode(node.node.id)!;
        mapStore.selectedNode = chosenNode;
        console.log(chosenNode);
        centerMap(chosenNode)

        mapStore.setTextAppend()
        if(player.gameStage != GameStage.INTRO && !(mapStore.isSpecial === SpecialAreaId.HOME)) {
            mapStore.callRandomEncounter(Zone.FOREST)
        }
    }
})
const isConnected = function(node: any): boolean {
    return !!getConnectedEdges(mapStore.selectedNode.id).find( 
        connection => (connection.target === node.node.id || connection.source === node.node.id)
    )
}

//DIRTY DIRTY HACKS
const centerMap = function(node:any) {
    const vfMap = document.getElementById("vf-map");
    //Need to find a better way to get these.
    const NODE_WIDTH_OFFSET = -120;
    const NODE_HEIGHT_OFFSET = 150;

    if (!!vfMap) {
        setViewport(
            {
                x: -node.position.x - NODE_WIDTH_OFFSET + (vfMap?.clientHeight / 2),
                y:  -node.position.y - NODE_HEIGHT_OFFSET + (vfMap?.clientWidth / 2),
                zoom: 1.0,
            }, 
            { duration: 600 }
        );
    }
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
    nodes.value.forEach((element: GraphNode) => {
        if(element.data?.killCount >= element.data?.scoutThreshold) {
            element.hidden = false;
            element.data.interactable = true;

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
<style>
    #vf-map {
        height: 100%;
        width: 100%;
    }
</style>
