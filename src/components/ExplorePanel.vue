<template>
    <div v-show="active === Tab.EXPLORE">
        <div>
            <div class="deck-choice">
                <div class="log"><span class="log-text">{{ exploreDeck.pullLog }}</span></div>
                <img class="left-arrow" :src="'./src/assets/arrowL.png'">
                <img class="spotlight" :src="'./src/assets/spotlight.png'">
                <img class="deck" :src="'./src/assets/cardback.png'">
                <img class="right-arrow" :src="'./src/assets/arrowR.png'">
            </div>
            <div class="area-box">
                <span>Current deck selected: Exploration  | Cost: 10 Energy per pull.</span>
                <span>Current Energy: {{ player.getEnergyDisplay }}</span>
                <span>Exploration Progress: {{ mapStore.totalScouted  }} zones scouted.</span>
                <span>There are currently <b>3</b> types of cards in the deck. Scout more zones to unlock new cards and make them stronger!</span>
                <button @click="pullCard()" :disabled="!player.enoughEnergy(10)">Pull a card... (-10 Energy)</button>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { usePlayer } from '@/stores/player';
import { Tab } from '@/enums/panels';
import { useMapStore } from '@/stores/mapStore';
import { useDecks } from '@/stores/deckStore';

const player = usePlayer();
const mapStore = useMapStore();
const exploreDeck = useDecks();

let props = defineProps({
    active: String
})

const pullCard = function () {
    if(player.enoughEnergy(10)) {
        player.payEnergy(10)
        exploreDeck.drawCard()
    }
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
        font-size: 24px;
    }
    .deck-choice {
        background-color: black;
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 20px;
        /* This lets us layer images on top of each other properly. */
        position: relative;

        .log {
            position:absolute;
            width:100%;
            /* margin-left: 50%; */
            font-size: 30px;
            top:5px;
            .log-text {
                position:relative;
            }
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
            position: absolute;
            animation: deck-hover 4s ease-in-out infinite;
            height: 200px;
            width: 150px;
            margin-left: calc(50% - 75px);
            z-index: 2;
        }
        .left-arrow {
            position: absolute;
            margin-left: calc(15% - 28px);
            height: 28px;
            width: 22px;
            z-index: 3;
        }
        .right-arrow {
            position: absolute;
            margin-left: calc(85% + 28px);
            height: 28px;
            width: 22px;
            z-index: 3;
        }
    }
    .in-combat {
        color:red;
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