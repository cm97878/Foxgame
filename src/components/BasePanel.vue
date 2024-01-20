<template>
    <div v-show="active === Tab.HOME">
        <div v-if="!(mapStore.isSpecial === SpecialAreaId.HOME)" >
            Not available while exploring.
        </div>
        <div v-else class="home-box">
            <div class = "base-pic"></div>
            <div class = "base-text">
                <span>A dark, drafty cave, with little in the way of comfort. It wouldn't hurt to make this place a little bit more like a proper home...</span>
                <span style="color:green">Current HP Regen: {{ player.getHPRegen }}</span>
                <span style=" color:gold">Current Energy Regen: {{ player.getEnergyRegen }}</span>
            </div>
            <div class = "upgrades">
                <!-- FIX!-->
                <UpgradeButton v-for="upgrade in upgrades" :upgradeName="upgrade.name" :tooltipText="upgrade.description" :effect_description="upgrade.effect"
                :upgradeCost="upgrade.cost" :upgrade_key="-1" :cost="-1"></UpgradeButton>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import UpgradeButton from './UpgradeButton.vue';
import { SpecialAreaId } from '@/enums/areaEnums';
import { useMapStore } from '@/stores/mapStore';
import { Tab } from '@/enums/panels';
import { usePlayer } from '@/stores/player';

const name = "basePanel";

const mapStore = useMapStore();
const player = usePlayer();

let props = defineProps({
    active: String
})
const upgrades = [{
        name: "Makeshift Bed",
        description: "Scrounge up some sticks and soft things so you have something better to sleep on then the cold, stone floor.",
        effect: "+0.5 HP/sec, +0.2 Energy/sec",
        cost: "Cost TBD"
    },
    {
        name: "Crude Fox Figurine",
        description: "Try to carve something with your claws as a focus to help channel your new energy.",
        effect: "+1 Atk, +1 Def",
        cost: "Cost TBD"
    }
]

</script>
<style>
    .home-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .base-pic {
            width: 80%;
            height: 280px;
            background-color: grey;
        }

        .base-text {
            margin: 10px 0;
            display: flex;
            flex-direction: column;
        }

        .upgrades {
            display: flex;
            flex-wrap: wrap;
        }
    }
</style>