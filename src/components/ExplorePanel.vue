<template>
    <div v-show="active === Tab.EXPLORE && !isEventActive">
        <div v-if="combatStore.activeCombat" class="in-combat">
            Currently in combat, cannot explore safely.
        </div>
        <div v-else>
            <div class="deck-choice center-stage">
                <!-- <div class="center-stage"> -->
                    <img class="spotlight" :src="'./src/assets/spotlight.png'">
                    <img class="deck" :src="'./src/assets/cardback.png'">
                <!-- </div> -->
            </div>
            <div class="area-box">
                <span>Current deck selected: Exploration</span>
                <span>Cost: 10 Energy per pull.</span>
                <span>Current Energy: {{ player.getEnergyDisplay }}</span>
                <span>Exploration Progress: {{ mapStore.totalScouted  }} zones scouted.</span>
                <!-- Currently unapplied.-->
                <span>Exploration Multiplier: {{ (1+(mapStore.totalScouted/10)) }}x</span>
                <button @click="callEvent(Zone.FOREST)" :disabled="!player.enoughEnergy(10)">Pull a card... (-10 Energy)</button>
            </div>
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
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        button {
            padding: 4px 10px;
        }
        font-size: 22px;
    }
    .deck-choice {
        /* background-color: rgb(25, 25, 25); */
        background-color: black;
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 20px;
    }
    .in-combat {
        color:red;
    }
    .center-stage {
        /* This lets us layer images on top of each other properly. */
        position: relative;
    }
    .spotlight {
        position: absolute;
        /* 2x image scalar */
        height:320px;
        width: 202px;
        /* Manual horizontal centering. */
        margin-left: calc(50% - 101px);
        z-index: 1;

    }
    .deck {
        /* animation: deck-hover 4s linear infinite; */
        position: absolute;
        animation: deck-hover 4s ease-in-out infinite;
        height: 200px;
        width: 150px;
        margin-left: calc(50% - 75px);
        z-index: 2;
    }

    @keyframes deck-hover {
        0%, 100% {
            transform: translateY(10px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
</style>