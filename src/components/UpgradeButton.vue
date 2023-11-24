<template>
    <button v-if="show" :class="{bought: is_bought}" :disabled="!player.enoughSoul(cost)">
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

const name = "upgradebutton";


const player = usePlayer();
let props = defineProps({
    show: Boolean,
    is_bought: Boolean,
    title: String,
    type: String as PropType<UpgradePurchaseType>,
    description: String,
    cost: {
        type: Decimal,
        required: true,
    }
})

const currType = props.type;

const canAfford = function() {
    //TODO: switch case here, to set the :disabled="" section above to enoughSoul/areasScounted/etc
}




const costDisplay = computed(() => {
    console.log(player.enoughSoul(props.cost))
    return props.cost.toString().replace("+","");
})
</script>