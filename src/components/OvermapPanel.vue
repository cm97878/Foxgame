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
            <VueFlow :nodes="mapStore.mapNodes" class="general_outline">
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
import { toRaw, watch } from 'vue';
import { useCombatStore } from '@/stores/combatStore';


const name = "overmappanel";
const mapStore = useMapStore();
const player = usePlayer();
const eventStore = useEventStore();
const combatStore = useCombatStore();

const { nodesDraggable, onPaneReady, elementsSelectable, onNodeClick,  findNode, getConnectedEdges,
     addEdges, nodes, edgesUpdatable, edgeUpdaterRadius, nodesConnectable, panOnDrag, fitView } = useVueFlow({ id:"map"});

onPaneReady((instance) => {
    nodes.value.forEach( element => {
        element.hidden = true;
    })


    addEdges(mapStore.mapEdges);
    nodesDraggable.value = false;
    elementsSelectable.value = true;
    edgesUpdatable.value = false;
    nodesConnectable.value = false;
    panOnDrag.value = true;

    edgeUpdaterRadius.value = 0;
    instance.setCenter(0, 0, {zoom: 1.0})
    const startingNode = findNode("1")!;
    mapStore.selectedNode = startingNode;

    refreshMap();
    centerMap(startingNode);
})
onNodeClick((node) => {
    if (isConnected(node) && !combatStore.getActiveCombat) {
        if(player.firstMove) {
            player.firstMove = false;
            combatStore.startCombat(mapStore.enemyList[0]);
            eventStore.callCutscene(eventStore.cutscenes.get("firstMove"));
        }
        
        //TODO: Tweak this later.
        else if(!(mapStore.isSpecial === SpecialAreaId.HOME)) {
            mapStore.callRandomEncounter(Zone.FOREST)
        }

        const chosenNode = findNode(node.node.id)!;
        mapStore.selectedNode = chosenNode;
        centerMap(chosenNode)

        mapStore.setTextAppend()
    }
})
const isConnected = function(node: any): boolean {
    return !!getConnectedEdges(mapStore.selectedNode.id).find( 
        connection => (connection.target === node.node.id || connection.source === node.node.id)
    )
}

const getConnectedNodes = function(id: string): string[] {
    return getConnectedEdges(mapStore.selectedNode.id).map( 
        edge => edge.target === id ? edge.source : edge.target
    )
}

//FIXME: Other issues i've noticed while fuckin around:
//Dying doesn't set it back to home
//If you scroll in and out you can move the map around in a weird way
//also you cant scroll out very far? we should probably change that at least for now, so we can get a better overview of how it looks as it expands
//also due to the spacing we may wanna make the text bigger
const centerMap = function(node:GraphNode) {
    //Not sure why I have to do this, but it's needed to make this work.
    toRaw(node);
    const nodes = getConnectedNodes(node.id);
    nodes.push(node.id)
    fitView({
        nodes: nodes,
        duration: 600
    })
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
