<template>
    <div @mouseenter="nodeMouseover()" @mouseleave="nodeMouseover(true)" class="node-boundary" :class="{ 'selected-node': mapStore.selectedNode.id === props.id}">
        {{ data.areaName }}
    </div>
</template>

<script setup lang="ts">
    import { useMapStore } from '@/stores/mapStore.js';
import { useVueFlow } from '@vue-flow/core';
    import { ref } from 'vue';
    const mapStore = useMapStore();

    const name = "customNode";

    //TODO: This wont work. Need to move all the tooltip stuff to the overmap panel, and do something with emitting events for mouse-overe'd nodes

  //TODO: Could style based off of zone of Area in the future.
    const props = defineProps({
        id: String,
        data: {
            type: Object,
            required: true,
        },
    }) 

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
    border: 2px solid black;
    padding: 10px;
    border-radius: 20px;
    width: 100px;
    font-size: 24px;
    text-align: center;
    border-width: 3px;
    border-style: solid;
    background-color: #9ec93d;
    color: #222; 
    cursor: pointer;
  }

  .selected-node {
    background:grey;
  }



</style>