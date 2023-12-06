<template>
    <div v-show="active === 'areaActions' && !isEventActive">
        <div v-if="combatStore.activeCombat" class="in-combat">
            Currently in combat, cannot explore safely.
        </div>
        <div v-else class="area-box">
            <span>Exploration Progress: {{ player.totalScouted  }} zones scouted.</span>
            <span>Exploration Multiplier: {{ (1+(player.totalScouted/10)) }}x</span>
            <button @click="callEvent(Zone.FOREST)">Explore</button>
        </div>
    </div>
    <EventDisplay v-if="!!isEventActive" :area-event="activeEvent" @event-finished="eventCleanup()"></EventDisplay>
</template>


<script setup lang="ts">
import { Zone } from '@/enums/areaEnums';
import { useCombatStore } from '@/stores/combatStore';
import { usePlayer } from '@/stores/player';
import type { AreaEvent }  from '@/types/areaEvent'
import EventDisplay from './EventDisplay.vue';
import { ref } from 'vue';

const name = "areaActionsPanel";

const player = usePlayer();
const combatStore = useCombatStore();
let isEventActive = ref(false);
let activeEvent = {} as AreaEvent;
const testEvent = {
    id: "1",
    zone: Zone.FOREST,
    eventText: "You found some Soul, woo!",
    choice1Label: "Okay! (+10 Soul)",
    eventCallback: function(choice: number) {
        player.addSoul(10)
        console.log(choice)
    }
} as AreaEvent;

let props = defineProps({
    active: String
})

const callEvent = function (zone: Zone) {
    //Use Zone to check the random events for an area, then call one.

    activeEvent = testEvent;
    isEventActive.value = true;
}

const eventCleanup = function():void {
    isEventActive.value = false;
}
</script>
<style>
    .area-box {
        display: flex;
        flex-direction: column;
        padding-top: 10px;
    }
    .in-combat {
        color:red;
    }
</style>