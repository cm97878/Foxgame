<template>
    <div v-show="active === Tab.EXPLORE && !isEventActive">
        <div v-if="combatStore.activeCombat" class="in-combat">
            Currently in combat, cannot explore safely.
        </div>
        <div v-else class="area-box">
            <span>Current Energy: {{ player.getEnergyDisplay }}</span>
            <span>Exploration Progress: {{ mapStore.totalScouted  }} zones scouted.</span>
            <!-- Currently unapplied.-->
            <span>Exploration Multiplier: {{ (1+(mapStore.totalScouted/10)) }}x</span>
            <button @click="callEvent(Zone.FOREST)" :disabled="!player.enoughEnergy(10)">Explore (-10 Energy)</button>
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
import { Tab } from '@/enums/panels';
import { useMapStore } from '@/stores/mapStore';

const name = "areaActionsPanel";

const player = usePlayer();
const combatStore = useCombatStore();
const mapStore = useMapStore();
let isEventActive = ref(false);
let activeEvent = {} as AreaEvent;
const testEvent = {
    id: "1",
    zone: Zone.FOREST,
    eventText: "You found some Soul, woo!",
    choices:[{id: 1, label: "Okay! (+10 Soul)"}],
    eventCallback: function(choice: number) {
        player.addSoul(10)
        console.log(choice)
    }
} as AreaEvent;

let props = defineProps({
    active: String
})

const callEvent = function (zone: Zone) {
    //For later: Use Zone to check the random events for an area, then call one.
    if(player.enoughEnergy(10)) {
        player.payEnergy(10)
        activeEvent = testEvent;
        isEventActive.value = true;
    }
}

const eventCleanup = function():void {
    isEventActive.value = false;
}
</script>
<style>
    .area-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        button {
            padding: 4px 10px;
        }
    }
    .in-combat {
        color:red;
    }
</style>