<template>
    <UpgradeTooltip @click="buy()" v-if="show" :class="{bought: is_bought}" :disabled="!canAfford" :upgradeName="title" :tooltipText="description"
    :upgradeCost="costDisplay">
    </UpgradeTooltip>
</template>


<script setup lang="ts">
import { UpgradePurchaseType } from '@/enums/upgradePurchaseType';
import Decimal from 'break_infinity.js';
import { computed, ref, type PropType } from 'vue';
import { usePlayer } from '@/stores/player';
import { useUpgradeStore } from '@/stores/upgradeStore';
import UpgradeTooltip from './UpgradeTooltip.vue';

const name = "upgradebutton";
//TODO: Possibly merge this into UpgradeTooltip.vue -Malt


const player = usePlayer();
const upgrades = useUpgradeStore();
let props = defineProps({
    show: Boolean,
    is_bought: Boolean,
    title: String,
    type: String as PropType<UpgradePurchaseType>,
    description: String,
    map_key: Number,
    cost: {
        type: [Decimal, Number],
        required: true
    },
    effect: Function
})


const canAfford = computed(() => {
    switch(props.type) {
        case UpgradePurchaseType.SOUL: {
            return player.enoughSoul(props.cost);
        }
        case UpgradePurchaseType.AREAS_SCOUTED: {
            return player.enoughScouted(props.cost as number);
        }
        case UpgradePurchaseType.ENEMIES_KILLED: {
            return player.enoughKills(props.cost as number);
        }
        default: {
            console.log("unhandled upgrade purchase type (UpgradeButton.vue)")
        }
    }
})


const buy = function() {
    if(props.map_key || props.map_key === 0) {
        let temp = upgrades.soul.get(props.map_key);
        if(temp) {
            temp.bought = true;

            //For now only SOUL will do anything, but eventually
            //prestige and otheer stuff will need their own handlers. idk if a switch
            //is best for this, but eh we'll see
            switch(props.type) {
                case UpgradePurchaseType.SOUL: {
                    player.subtractSoul(props.cost);
                }
            }
            upgrades.soul.set(props.map_key, temp);
            if(props.effect) {
                props.effect();
            }
        }
    }
}



const costDisplay = computed(() => {
    return props.cost.toString().replace("+","");
})
</script>