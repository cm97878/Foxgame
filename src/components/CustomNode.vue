<template>
    <div :class="[{'explored-area': scouted}, {'not-explored': !scouted}]">
        <div @mouseenter="nodeMouseover()" 
            @mouseleave="nodeMouseover(true)" 
            class="node-boundary" 
            :class="[{ 'selected-node': isSelected}, zoneClass, {'special': specialZone}]">
                {{ data.areaName }}
        </div>
    </div>
    
    <div class="handle">
        <Handle v-for="handle in props.data.handles" :id="handle" :position="handleDirection(handle)">
            <img v-if="isSelected && !combatStore.activeCombat" :class="[handleDirection(handle)]" :src="'./src/assets/mapArrow2x.gif'">
        </Handle>
    </div>

</template>

<script setup lang="ts">
    import { Zone } from '@/enums/areaEnums';
    import { useCombatStore } from '@/stores/combatStore';
    import { useMapStore } from '@/stores/mapStore.js';
    import { useVueFlow, Handle, Position } from '@vue-flow/core';
    import { computed } from 'vue';
    
    const mapStore = useMapStore();
    const combatStore = useCombatStore();

    //TODO: This wont work. Need to move all the tooltip stuff to the overmap panel, and do something with emitting events for mouse-overe'd nodes
    const props = defineProps({
        id: String,
        data: {
            type: Object,
            required: true,
        },
    }) 

    const isSelected = computed(() => mapStore.selectedNode.id === props.id)
    const specialZone = computed(() => props.data.areaSpecialID)
    const scouted = computed(() => props.data.killCount >= props.data.scoutThreshold)
    
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

    const handleDirection = function(handle:string) {
        let direction = handle.split(",")[1];
        switch(direction) {
            case "1": return Position.Top;
            case "2": return Position.Bottom;
            case "3": return Position.Left;
            case "4": return Position.Right;
        }
    }

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
    /* Psuedo fog-of-war reveal */
    .explored-area {
        border:40px solid #ebd5b3;
        background-color: #ebd5b3;
        border-radius: 80px;
    }

    .not-explored {
        opacity: .35;
    }

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

    .left {
        position: relative;
        transform: rotate(-0.25turn);
        left: -45px;
        bottom: 21px;
    }

    .top {
        position: relative;
        bottom: 45px;
        right: 23px;
    }

    .right {
        position: relative;
        transform: rotate(0.25turn);
        left: 5px;
        bottom: 20px;
    }

    .bottom {
        position: relative;
        transform: rotate(0.5turn);
        left: -22px;
        top: 5px;
    }

    .handle {
        visibility: hidden;
        img {
            visibility:visible;
        }
    }
</style>