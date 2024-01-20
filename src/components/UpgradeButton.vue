<template>
    <button @click="buy()" class="tooltip-button" :class="{bought: is_bought, unbuyable: !canAfford }">
        {{ title }}
        <div class="tooltiptext">
            {{ flavor }}
            <div class="divider"></div>
            {{ effect_description }}
            <div class="divider"></div>
            <span v-if="upgrade_type === UpgradePurchaseType.AREAS_SCOUTED">
                Requires {{ costDisplay }} areas scouted.
            </span>
            <span v-if="upgrade_type === UpgradePurchaseType.ENEMIES_KILLED">
                Requires {{ costDisplay }} enemy kills.
            </span>
            <span v-else-if="upgrade_type === UpgradePurchaseType.SOUL">
                {{ costDisplay }} Soul.
            </span>
        </div>
    </button>
</template>


<script setup lang="ts">
import Decimal from 'break_infinity.js';
import { computed, type PropType } from 'vue';
import { usePlayer } from '@/stores/player';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { UpgradeCategory, UpgradePurchaseType } from '@/types/upgrade';


const name = "upgradebutton";


const player = usePlayer();
const upgrades = useUpgradeStore();
let props = defineProps({
    show: Boolean,
    is_bought: Boolean,
    title: String,
    upgrade_type: String as PropType<UpgradePurchaseType>,
    upgrade_category: String as PropType<UpgradeCategory>,
    flavor: String,
    effect_description: String,
    upgrade_key: Number,
    cost: {
        type: [Decimal, Number],
        required: true
    },
    effect: Function
})


const canAfford = computed(() => {
    switch(props.upgrade_type) {
        case UpgradePurchaseType.SOUL: {
            return player.enoughSoul(props.cost);
        }
        case UpgradePurchaseType.AREAS_SCOUTED: {
            return player.enoughScouted(props.cost as number);
        }
        case UpgradePurchaseType.ENEMIES_KILLED: {
            const x = player.enoughKills(props.cost as number);
            console.log(x)
            return player.enoughKills(props.cost as number);
        }
        default: {
            console.log("unhandled upgrade purchase type (UpgradeButton.vue)")
        }
    }
})


const buy = function() {
    if(props.upgrade_key && canAfford.value) {
        let temp = props.upgrade_category=== UpgradeCategory.SOUL ? upgrades.soul.get(props.upgrade_key) : upgrades.shrine.get(props.upgrade_key);
        if(temp) {
            temp.bought = true;

            //For now only SOUL will do anything, but eventually
            //prestige and otheer stuff will need their own handlers. idk if a switch
            //is best for this, but eh we'll see
            switch(props.upgrade_type) {
                case UpgradePurchaseType.SOUL: {
                    player.subtractSoul(props.cost);
                }
            }
            props.upgrade_category === UpgradeCategory.SOUL ? upgrades.soul.set(props.upgrade_key, temp) : upgrades.shrine.set(props.upgrade_key, temp);
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
<style>
    .tooltip-button {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
    }

    .tooltip-button .tooltiptext {
        visibility: hidden;
        width: 200px;
        background-color: grey;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        border: 1px solid;
        padding: 8px;

        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        top: -5px;
        left: 105%;
    }

    .tooltip-button:hover .tooltiptext {
        visibility: visible;
    }
    .divider {
        border-bottom: 1px solid;
    }

    .tooltip-button {
        padding: 4px 10px;
        margin: 0 20px;
    }

    .bought {
        background-color: rgb(41, 163, 47) !important;
    }

    .unbuyable {
        background-color: rgb(117, 117, 117);
    }
</style>