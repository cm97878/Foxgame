<template>
    <div v-show="active === 'combat'" id="combat_tab">

        <div class="combat_graphics_container">
            <div id="info_player_graphic" class="combat_graphic">
                <div class="name_box">{{ player.name }}</div>
                <!-- <Transition name="attack-text">
                    <div v-show="playerDamage">{{ player.getAtkDisplay + " damage!" }}</div>
                </Transition> -->
            </div>
            <div id="info_soul_graphic">
                a lil soul icon will go here <br />

            </div>
            <div v-if="combatStore.activeCombat" id="info_enemy_graphic" class="combat_graphic">
                <div class="name_box">{{ combatStore.getOpponentStats.name }}</div>
                <!-- <Transition name="attack-text">
                    <span v-show="enemyDamage">{{ combatStore.getOpponentStats.attack + " damage!" }}</span>
                </Transition> -->
            </div>
            <div v-else class="combat_graphic not_fighting">
            </div>
        </div>


        <div id="turn_carousel" class="general_outline">
            <div id="carousel_line" class="general_outline"></div>
            <TransitionGroup name="carousel">
                <CarouselIcon v-for="(item) in combatStore.carouselArray.slice(0,8)" :key="item.turnNumber" :icon="item.type" />
            </TransitionGroup>
        </div>



        <div class="stats_flex_container">
            <div class="stats_container">
                <div class="general_outline info_hp_bar_outline">
                    <div id="info_player_hp_bar_solid" class="hp_bar_background"></div>
                    {{ displayDecimal(player.getHpCurr) + " / " + displayDecimal(player.getHpMax) }}
                </div>
                <div class="general_outline combat_stats">
                    Atk: {{ displayDecimal(player.getAtk) }} <br />
                    Def: {{ displayDecimal(player.getDef) }} <br />

                </div>
                <div class="combat_actions">
                    <button @click="playerAction('attack')" :disabled="!combatStore.playerTurn">Attack</button>
                    <button @click="playerAction('wait')" :disabled="!combatStore.playerTurn">Wait</button>
                </div>
            </div>

            <div v-show="combatStore.activeCombat" class="stats_container">
                <div class="general_outline info_hp_bar_outline">
                    <div id="info_enemy_hp_bar_solid" class="hp_bar_background"></div>
                    {{ combatStore.getOpponentHP + " / " + combatStore.getOpponentStats.maxHP }}
                </div>
                <div class="general_outline combat_stats">
                    <div style="width: 100%; height: 100%">
                        Atk: {{ combatStore.getOpponentStats.attack }} <br />
                        Def: {{ combatStore.getOpponentStats.defense }} <br />

                    </div>
                </div>
            </div>
        </div>

        <!-- Make this a scrollable area later. -->
        <div id="info_combat_log">
            <span v-for="(log) in combatStore.logFeed">
                {{ log }}<br>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlayer } from '@/stores/player';
import { useMapStore } from '@/stores/mapStore';
import { useCombatStore } from '@/stores/combatStore';
import { ref, computed, watch } from 'vue';
import CarouselIcon from './CarouselIcon.vue';
import { storeToRefs } from 'pinia';
import { displayDecimal } from '@/utils/utils'
const player = usePlayer();
const mapStore = useMapStore();
const combatStore = useCombatStore();

const name = "combatpanel";

const props = defineProps({
    active: String
})

//stuff for testing, will delete later
const { encounterSignal$ } = storeToRefs(mapStore)

//Signals
watch(encounterSignal$, (signal) => combatStore.startCombat(signal))


const playerAction = function (action: string) {
    combatStore.processPlayerTurn(action);
}

const enemyHpRatio = computed((): string => {
    let x = combatStore.getOpponentHP.dividedBy(combatStore.getOpponentStats.maxHP).times(100)
    if (x.gte("0")) {
        return (x + "%")
    }
    else {
        return "0%"
    }
})

defineExpose({ enemyHpRatio })

</script>

<style>
    #info_player_hp_bar_solid {
        width: v-bind("player.playerHpRatio")
    }

    #info_enemy_hp_bar_solid {
        width: v-bind("enemyHpRatio")
    }
</style>