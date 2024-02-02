<template>
    <div @mouseenter="nodeMouseover()" 
    @mouseleave="nodeMouseover(true)" 
    class="node-boundary" 
    :class="[{ 'selected-node': mapStore.selectedNode.id === props.id}, zoneClass, {'special': specialZone}]">
        {{ data.areaName }}
    </div>
</template>

<script setup lang="ts">
    import { Zone } from '@/enums/areaEnums';
    import { useMapStore } from '@/stores/mapStore.js';
    import { useVueFlow, type GraphNode } from '@vue-flow/core';
    import { computed } from 'vue';
    
    const mapStore = useMapStore();

    const name = "customNode";
    
    //TODO: This wont work. Need to move all the tooltip stuff to the overmap panel, and do something with emitting events for mouse-overe'd nodes
    const props = defineProps({
        id: String,
        data: {
            type: Object,
            required: true,
        },
    }) 

    
    const zoneClass = computed(() => {
        const zone = props.data.zone as Zone || Zone.FOREST;
        //Add zones in as they are made.
        switch(zone) {
            case Zone.FOREST: return "forest";
            case Zone.DEEP_FOREST: return "deep-forest";
            case Zone.RIVERBANK: return "riverbank";
        }
        
        return "forest"
    })

    const specialZone = computed(() => props.data.areaSpecialID)

    const nodeMouseover = function(reset?:boolean) {
        if(!reset) {
            if(props.id) {
                mapStore.mouseoverDelayCheck = props.id;
                const { findNode } = useVueFlow({ id:"map"});
                setTimeout(() => { 
                    if(mapStore.mouseoverDelayCheck === props.id) {
                        mapStore.mouseoverNode = findNode(props.id)!;
                    } }, 500)
            }
        }
        else {
            mapStore.mouseoverDelayCheck = "";
            mapStore.mouseoverNode = undefined;
        }
    }

</script>
<style>
  .node-boundary {
    padding: 10px;
    border-radius: 20px;
    width: 100px;
    font-size: 24px;
    text-align: center;
    border-style: solid;
    
    color: #222; 
    cursor: pointer;
  }

  .forest {
    border: 2px solid black;
    background-color: #9ec93d;
  }

  .deep-forest {
    border: 2px solid #006608;
    background-color: #00ba06;
  }

  .riverbank {
    border: 2px solid #002861;
    background-color: #0091ff;
  }

  .special {
    border-width: 4px !important;
    border-color:rgb(223, 186, 0);
  }

  .selected-node {
    background-color:rgb(0, 140, 255);
  }
</style>