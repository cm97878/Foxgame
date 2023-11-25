<template>
    <button @click="buy()" v-if="show" :class="{bought: is_bought}" :disabled="!player.enoughSoul(cost)">
        {{ title }} <br />
        {{ description }} <br />
        {{ costDisplay }}
    </button>
</template>


<script setup lang="ts">
import { UpgradePurchaseType } from '@/enums/upgradeType';
import Decimal from 'break_infinity.js';
import { computed, type PropType } from 'vue';
import { usePlayer } from '@/stores/player';
import { useUpgradeStore } from '@/stores/upgradeStore';

const name = "upgradebutton";


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
        type: Decimal,
        required: true,
    },
    effect: Function
})

const currType = props.type;

const canAfford = function() {
    //TODO: switch case here, to set the :disabled="" section above to enoughSoul/areasScounted/etc
}

const buy = function() {
    if(props.map_key || props.map_key === 0) {
        let temp = upgrades.soul.get(props.map_key);
        if(temp) {
            temp.bought = true;
            player.subtractSoul(props.cost);
            upgrades.soul.set(props.map_key, temp);
            if(props.effect) {
                props.effect();
                console.log("worked")
            }
        }
    }
}



const costDisplay = computed(() => {
    return props.cost.toString().replace("+","");
})
</script>