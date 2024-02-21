<template>
    <div id="maps_container">
        <div id="vf-map">
            <VueFlow class="general_outline" :nodes="overworldData.nodeSave" :edges="overworldData.edgeSave">
                <div class="fow"></div>
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
import { onKeyDown } from '@vueuse/core';

const mapStore = useMapStore();
const player = usePlayer();
const eventStore = useEventStore();
const combatStore = useCombatStore();

const { nodesDraggable, onPaneReady, elementsSelectable, onNodeClick,  findNode, getConnectedEdges,
     addEdges, nodes, edgesUpdatable, edgeUpdaterRadius, nodesConnectable, panOnDrag, setMinZoom  } = useVueFlow({ id:"map"});
const { scouted$ } = storeToRefs(mapStore)

// -- EVENT HANDLERS --
onPaneReady((instance) => {
    nodes.value.forEach( element => {
        element.hidden = true;
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
    mapStore.mapLoaded = true;
})
onNodeClick((node) => {
    if (isConnected(node) && !combatStore.getActiveCombat) {
        onEnterNode(node.node.id)
    }
})

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

onKeyDown(['ArrowDown', 's'], (e) => {
    e.preventDefault()
    if(!combatStore.activeCombat && !!mapStore.handles?.bottom) {
        onEnterNode(mapStore.handles.bottomNode)
    }
}, {dedupe: true})

onKeyDown(['ArrowUp', 'w'], (e) => {
    e.preventDefault()
    if(!combatStore.activeCombat && !!mapStore.handles?.top) {
        onEnterNode(mapStore.handles.topNode)
    }
}, {dedupe: true})

onKeyDown(['ArrowLeft', 'a'], (e) => {
    e.preventDefault()
    if(!combatStore.activeCombat && !!mapStore.handles?.left) {
        onEnterNode(mapStore.handles.leftNode)
    }
}, {dedupe: true})

onKeyDown(['ArrowRight', 'd'], (e) => {
    e.preventDefault()
    if(!combatStore.activeCombat && !!mapStore.handles?.right) {
        onEnterNode(mapStore.handles.rightNode)
    }
}, {dedupe: true})


// -- FUNCTIONS --
//TODO: Move more of this logic into mapStore, if possible. -Malt
const onEnterNode = function(id: string): void {
    //TODO: Make this check use gameFlags
    const node = findNode(id)!;
    if(player.firstMove && node != mapStore.selectedNode) {
            player.firstMove = false;
            combatStore.startCombat(mapStore.enemyList.get(Zone.FOREST)![0]);
            eventStore.callCutscene(eventStore.cutscenes.get("firstMove"));
        } 
        else if(!!node?.data?.customFunc) {
            mapStore.callNodeFunc(node.data.customFunc);
        } 
        else if(!(!!node?.data?.areaSpecialID)) {
            mapStore.callRandomEncounter(node.data.zone || Zone.FOREST)
        } 

        mapStore.moveToNode(node) 
}

const isConnected = function(node: any): boolean {
    return !!getConnectedEdges(mapStore.selectedNode.id).find( 
        connection => (connection.target === node.node.id || connection.source === node.node.id)
    )
}

const scoutRevealNodes = function(element:GraphNode, dontCenter?:boolean) {
    element.data.scouted = true;
    let scoutNodes = mapStore.getConnectedNodes(element.id);
    scoutNodes.forEach((nodeID) => {
        let node = findNode(nodeID);
        if(node) {
            node.data.interactable = true;
            node.hidden = false;
        }
    })
    if(!dontCenter) {
        mapStore.centerMap(element);
    }
}

//TODO: I'd rather not need something to refresh the map at all, if we can just bind hidden="interactable" it's fixed but it won't work as far as I've made attempts.
const refreshMap = function() {
    nodes.value.forEach((element: GraphNode) => {
        if(element.data.interactable) {
            element.hidden = false;
            if(element.data?.killCount >= element.data?.scoutThreshold) {
                scoutRevealNodes(element, true);
            }
        }
    });
}

</script>
<style>
    #vf-map {
        height: 100%;
        width: 100%;
        position:relative;     
    }
    .fow {
        position:absolute;
        background-color: rgba(0,0,0,0.7);
        z-index: 1;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .vue-flow__panel {
        z-index: 1;
    }
</style>
