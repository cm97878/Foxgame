<template>
    <div v-show="active === Tab.COMBAT" id="combat_tab">

        <div class="combat_graphics_container">
            <div id="info_player_graphic" class="combat_graphic">
                <div class="name_box">{{ player.name }}</div>
                <div class="battle-background">
                    <img class="pedestal" :src="'./src/assets/forestPedestal.png'">
                </div>
                
                <!-- <Transition name="attack-text">
                    <div v-show="playerDamage">{{ player.getAtkDisplay + " damage!" }}</div>
                </Transition> -->
            </div>
            <div id="info_soul_graphic">Soul</div>
            <div v-if="combatStore.activeCombat" id="info_enemy_graphic" class="combat_graphic">
                <div class="name_box">{{ combatStore.getOpponentStats.name }}</div>
                <div class="battle-background">
                    <img class="pedestal" :src="'./src/assets/forestPedestal.png'">
                </div>
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
            <SkillsMenu :open="skillsMenuActive"></SkillsMenu>
            <div class="stats_container">
                <PlayerHpBar />
                <div class="general_outline combat_stats">
                    Atk: {{ displayDecimal(player.getAtk) }} <br />
                    Def: {{ displayDecimal(player.getDef) }} <br />

                </div>
                
            </div>

            <div v-show="combatStore.activeCombat" class="stats_container">
                
                <div class="info_hp_bar_outline">
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
        <div v-if="combatStore.activeCombat" class="combat_actions">
            <img @click="playerAction('attack')" :src="'./src/assets/attackButton.png'" class="combat_button" :class="{disabled: !combatStore.playerTurn }">
            <img @click="toggleMenu()" :src="'./src/assets/SkillButton.png'" class="combat_button" :class="{disabled: !combatStore.playerTurn }">
            <img @click="playerAction('item')" :src="'./src/assets/ItemButton.png'" class="combat_button" :class="{disabled: true }">
            <img @click="playerAction('wait')" :src="'./src/assets/WaitButton.png'" class="combat_button" :class="{disabled: !combatStore.playerTurn }">
        </div>
        <div v-else class="combat_actions">
            <img @click="mapStore.callRandomEncounter(Zone.FOREST)" :src="'./src/assets/ExploreButton.png'" class="combat_button">
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
import { useCombatStore } from '@/stores/combatStore';
import { computed, ref } from 'vue';
import CarouselIcon from './CarouselIcon.vue';
import { displayDecimal } from '@/utils/utils';
import { Tab } from '@/enums/panels';
import PlayerHpBar from './playerHPBar.vue';
import { onKeyDown } from '@vueuse/core';
import { useMapStore } from '@/stores/mapStore';
import { Zone } from '@/enums/areaEnums'
import SkillsMenu from './SkillsMenu.vue';

const player = usePlayer();
const combatStore = useCombatStore();
const mapStore = useMapStore();

const props = defineProps({
    active: String
})

onKeyDown(['z'], (e) => {
    e.preventDefault()
    if(!!combatStore.playerTurn) {
        playerAction('attack')
    }
}, {dedupe: true})

onKeyDown(['x'], (e) => {
    e.preventDefault()
    if(!!combatStore.playerTurn) {
        skillsMenuActive.value = true;
    }
}, {dedupe: true})



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

const toggleMenu = function(state?: boolean) {
    if(state){
        skillsMenuActive.value = state
    } else {
        //toggle to the opposite state
        skillsMenuActive.value = !skillsMenuActive.value
    }
}

const skillsMenuActive= ref(false);

defineExpose({ enemyHpRatio })

</script>

<style>
    .stats_flex_container {
        display: flex;
        width: 100%;
        justify-content: space-between;
        position:relative;
        gap: 10px;
    }

    .stats_container {
        min-width: 180px;
        width:100%;
        min-height: 100px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        margin: 0 4px;
    }

    .combat_stats {
        font-size: 24px;
    }

    .combat_actions {
        width:100%;

        img {
            margin-top: 4px;
            margin-right: 8px;
            background-color:white;
        }

        img:hover {
            background: linear-gradient(rgb(0,98,179), rgb(0, 140, 255), rgb(153,209,255), rgb(0, 140, 255), rgb(0,98,179));
            background-size: 100% 400%;
            animation: gradient 5s linear infinite;       
        }

        .combat_button {
            width:128px;
            height:64px;
            border:none;
            cursor: pointer;
            border-radius: 2px;
        }
        .disabled {
            background-color: rgb(117, 117, 117) !important;
            pointer-events: none !important;
        }
    }
    #info_enemy_hp_bar_solid {
        width: v-bind("enemyHpRatio")
    }

    .combat_graphics_container {
        display: flex;
        width: 100%;
        align-content: stretch;

        .combat_graphic {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            min-height: 200px;
            border: 4px ridge rgb(125, 125, 125);

            img {
                position:absolute;
            }

            .pedestal {
                /* calc'ed this wrong, make it better later. */
                margin-left:calc(15% - 160px);
                margin-top: 90px;
            }
        }
        
        .combat_graphic.not_fighting {
            background-color: grey;
        }

        .name_box {
            min-height: 22px;
            font-size: 20px;
            border-bottom: 2px solid rgb(125, 125, 125);
        }

        #info_soul_graphic {
            width: 120px;
            min-width: 120px;
            min-height: 180px;
            margin-left: 0px;
            margin-right: 0px;
        }

        .battle-background {
            position:relative;
            /*background-color: rgb(20, 20, 20);*/
            background-image: linear-gradient(rgb(20, 20, 20) 42%, #76552b 45%);
            height: 100%;
        }
    }

    @keyframes gradient {
	0% {
		background-position: 100% 0%;
	}
	50% {
		background-position: 100% 200%;
	}
	100% {
		background-position: 100% 400%;
	}
}
</style>