<template>
    <div id="maps_container">
        <div id="vf-map">
            <VueFlow class="general_outline" :nodes="overworldData.nodeSave" :edges="overworldData.edgeSave">
                <template #node-custom ="{ data, id }">
                    <CustomNode :data="data" :id="id"></CustomNode>
                </template>
            </VueFlow>
        </div>
        <NodeTooltip/>
    </div>
</template>

<script setup lang="ts">
import CustomNode from './CustomNode.vue';
import NodeTooltip from './NodeTooltip.vue';
import { useMapStore } from '@/stores/mapStore.js';
import { usePlayer } from '@/stores/player';
import { useEventStore } from '@/stores/eventStore';
import { VueFlow, useVueFlow, type GraphNode } from '@vue-flow/core';
import { Zone } from '@/enums/areaEnums';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useCombatStore } from '@/stores/combatStore';
import overworldData from '@/assets/json/overworldData.json';

const mapStore = useMapStore();
const player = usePlayer();
const eventStore = useEventStore();
const combatStore = useCombatStore();

const { nodesDraggable, elementsSelectable, onNodeClick,  findNode, getConnectedEdges,
     nodes, edgesUpdatable, edgeUpdaterRadius, nodesConnectable, panOnDrag, setMinZoom, updateNodeData, onInit, updateNode } = useVueFlow({ id:"map"});

onInit((instance) => {
    nodes.value.forEach((node) => {
        updateNode(node.id, {hidden: true})
    })

    nodesDraggable.value = false;
    elementsSelectable.value = true;
    edgesUpdatable.value = false;
    nodesConnectable.value = false;
    panOnDrag.value = true;
    setMinZoom(.25);

    edgeUpdaterRadius.value = 0;
    instance.setCenter(0, 0, {zoom: 1.0})
    refreshMap()
    mapStore.returnHome()    
})

onNodeClick((node) => {
    if (isConnected(node) && !combatStore.getActiveCombat) {
        const chosenNode = findNode(node.node.id)!;

        //TODO: Make this check use gameFlags
        if(player.firstMove && chosenNode != mapStore.selectedNode) {
            player.firstMove = false;
            combatStore.startCombat(mapStore.enemyList.get(Zone.FOREST)![0]);
            eventStore.callCutscene(eventStore.cutscenes.get("firstMove"));
        } 
        else if(!!chosenNode?.data?.customFunc) {
            mapStore.callNodeFunc(chosenNode.data.customFunc);
        } 
        else if(!(!!chosenNode?.data?.areaSpecialID)) {
            mapStore.callRandomEncounter(chosenNode.data.zone || Zone.FOREST)
        } 

        mapStore.selectedNode = chosenNode;
        mapStore.centerMap(chosenNode)

        mapStore.setTextAppend()
    }
})
const isConnected = function(node: any): boolean {
    return !!getConnectedEdges(mapStore.selectedNode.id).find( 
        connection => (connection.target === node.node.id || connection.source === node.node.id)
    )
}

const scoutRevealNodes = function(element:GraphNode, dontCenter?:boolean) {
    updateNodeData(element.id, {scouted: true})
    mapStore.getConnectedNodes(element.id).forEach((id) => {
        updateNodeData(id, {interactable: true})
        updateNode(id, {hidden: false})
    })
    if(!dontCenter) {
        mapStore.centerMap(element);
    }
}

//TODO: I'd rather not need something to refresh the map at all, if we can just bind hidden="interactable" it's fixed but it won't work as far as I've made attempts.
const refreshMap = function() {
    console.log(nodes.value);
    nodes.value.forEach((node: GraphNode) => {
        if(node.data.interactable) {
            updateNode(node.id, {hidden: false});
            if(node.data?.killCount >= node.data?.scoutThreshold) {
                scoutRevealNodes(node, true);
            }
        }
    });
}


const { scouted$ } = storeToRefs(mapStore)

watch(scouted$, (signal) => {
    if(signal === "$REFRESH$") {
        refreshMap();
    }
    else {
        let scoutedNode = findNode(signal);
        if(scoutedNode) {
            scoutRevealNodes(scoutedNode)
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
