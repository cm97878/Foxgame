<template>
    <button @click="buy()" class="tooltip-button" :class="[boughtType, {unbuyable: !canAfford }]" @mouseenter="hover = true" @mouseleave="hover = false">
        {{ fullTitle }}
        <Transition name="upgrade-tooltip">
            <!-- sets hover false on mouseenter here 'cause otherwise it can get 'stuck' and feel weird -->
            <div v-show="hover" class="tooltiptext" @mouseenter="hover = false">
                {{ flavor }}
                <div class="divider"></div>
                {{ effect_description }}
                <div class="divider"></div>
                {{ cost_description }}
            </div>
        </Transition>
    </button>
</template>


<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { usePlayer } from '@/stores/player';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { UpgradeCategory } from '@/types/upgrade';


const name = "upgradebutton";

const player = usePlayer();
const upgrades = useUpgradeStore();

let props = defineProps({
    show: Boolean,
    is_bought: Boolean,
    title: String,
    upgrade_category: String as PropType<UpgradeCategory>,
    flavor: String,
    effect_description: String,
    cost_description: String,
    upgrade_key: Number,
    costFunc: Function, // (buyCheck: boolean) => boolean;
    effect: Function,
    repeatable: Boolean,
    level: Number
})

const hover = ref(false);
const boughtType = computed(() => {
    if(props.repeatable && props.is_bought) {
        return "multi-bought"
    } else if (props.is_bought) {
        return "bought"
    } else {
        return ""
    }
})


const canAfford = computed(() => props.costFunc ? props.costFunc(true, props.level || -1) : false)
const fullTitle = computed(() => {
    const level = props.level || 0;
    return level > 1 ? props.title + " \(" + (level-1) + "\)"  : props.title
})


const buy = function() {
    if(props.upgrade_key && canAfford.value && props.costFunc) {
        let temp = props.upgrade_category === UpgradeCategory.SOUL ? upgrades.soul.get(props.upgrade_key) : upgrades.home.get(props.upgrade_key);
        if(temp) {
            //repeatables
            if(temp.repeatable && !!temp.level) {
                props.costFunc(false, temp.level)
                temp.bought = true
                temp.level = temp.level+1
                props.upgrade_category === UpgradeCategory.SOUL ? upgrades.soul.set(props.upgrade_key, temp) : upgrades.home.set(props.upgrade_key, temp);
                if(props.effect) {
                    props.effect();
                }
            }
            if(!temp.bought) {
                // Actually buy the upgrade.
                props.costFunc(false)
                temp.bought = true;
                props.upgrade_category === UpgradeCategory.SOUL ? upgrades.soul.set(props.upgrade_key, temp) : upgrades.home.set(props.upgrade_key, temp);
                if(props.effect) {
                    props.effect();
                }
            }

        }
    }
}

</script>
<style>
    .tooltip-button {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
    }

    .tooltip-button .tooltiptext {
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

    .tooltip-button {
        padding: 4px 10px;
        margin: 0 20px;
    }

    .bought {
        background-color: rgb(41, 163, 47) !important;
    }

    .multi-bought {
        border: 3px solid rgb(41, 163, 47);
        outline: none !important;
    }

    .unbuyable {
        background-color: rgb(117, 117, 117);
    }
    .unbuyable:hover {
        background-color: rgb(117, 117, 117);
        color: white;
    }
    .unbuyable:active {
        box-shadow: none;
    }

    .upgrade-tooltip-enter-active,
    .upgrade-tooltip-leave-active {
        transition: opacity 0.1s ease;
    }

    .upgrade-tooltip-enter-from,
    .upgrade-tooltip-leave-to {
        opacity: 0;
    }
</style>