<template>
    <div id="combat_tab2">
        <div class="combat_graphics_container">
            <div id="info_player_graphic2" class="combat_graphic">
                <div class="name_box">{{ player.name }}</div>
                <div class="battle-background">
                    <img class="pedestal" :src="'./src/assets/forestPedestal.png'">
                </div>
            </div>

            <div id="info_soul_graphic">Soul</div>
            
            <div v-if="activeCombat" id="info_enemy_graphic2" class="combat_graphic">
                <div class="name_box">{{ getOpponentStats.name }}</div>
                <div class="battle-background">
                    <img class="pedestal" :src="'./src/assets/forestPedestal.png'">
                </div>

            </div>
            <div v-else class="combat_graphic not_fighting">
            </div>
        </div>


        <div id="turn_carousel2" class="general_outline">
            <div id="carousel_line2" class="general_outline"></div>
            <TransitionGroup name="carousel">
                <CarouselIcon v-for="(item) in carouselArray.slice(0,8)" :key="item.turnNumber" :icon="item.type" />
            </TransitionGroup>
        </div>



        <div class="stats_flex_container">
            <SkillsMenu :open="skillsMenuActive"></SkillsMenu>
            <div class="stats_container">
                <div class="info_hp_bar_outline">
                    <div id="info_player_hp_bar_solid2" class="hp_bar_background"></div>
                    <div class="soul_orbs">
                        <template v-for="orb in player.soulOrbs">
                            <div v-if="!!orb" class="soul_orb full"></div>
                            <div v-else class="soul_orb spent"></div>
                        </template>
                    </div>
                    {{ displayDecimal(getHpCurr) + " / " + displayDecimal(getHpMax) }}
                </div>
                <div class="general_outline combat_stats">
                    Atk: {{ displayDecimal(getAtk) }} <br />
                    Def: {{ displayDecimal(getPhysDef) }} <br />
                    MgR: {{ displayDecimal(getMagRes) }} <br />

                </div>
                
            </div>

            <div v-show="activeCombat" class="stats_container">
                
                <div class="info_hp_bar_outline">
                    <div id="info_enemy_hp_bar_solid2" class="hp_bar_background"></div>
                    {{ getOpponentHP + " / " + getOpponentStats.maxHP }}
                </div>
                <div class="general_outline combat_stats">
                    <div style="width: 100%; height: 100%">
                        Atk: {{ getOpponentStats.attack }} <br />
                        Def: {{ getOpponentStats.physDef }} <br />
                        MgR: {{ getOpponentStats.magRes }} <br />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="activeCombat" class="combat_actions">
            <img @click="playerAction('attack')" :src="'./src/assets/attackButton.png'" class="combat_button" :class="{disabled: !playerTurn }">
            <img @click="toggleMenu()" :src="'./src/assets/SkillButton.png'" class="combat_button" :class="{disabled: !playerTurn }">
            <img @click="playerAction('item')" :src="'./src/assets/ItemButton.png'" class="combat_button" :class="{disabled: true }">
            <img @click="playerAction('wait')" :src="'./src/assets/WaitButton.png'" class="combat_button" :class="{disabled: !playerTurn }">
        </div>
        <div v-else class="combat_actions">
            <img @click="" :src="'./src/assets/ExploreButton.png'" class="combat_button">
        </div>

        <!-- Make this a scrollable area later. -->
        <div id="info_combat_log2">
            <span v-for="(log) in logFeed">
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
import { useVueFlow } from '@vue-flow/core';
import { AI_Type, type Attack, type Enemy2, type Move } from '@/types/enemy';
import Decimal from 'break_infinity.js';
import type { CarouselItem } from '@/types/carouselItem';

const player = usePlayer();
const mapStore = useMapStore();

const props = defineProps({
    active: String
})

onKeyDown(['z'], (e) => {
    e.preventDefault()
    if(!!playerTurn.value) {
        playerAction('attack')
    }
}, {dedupe: true})

onKeyDown(['x'], (e) => {
    e.preventDefault()
    if(!!playerTurn.value) {
        skillsMenuActive.value = true;
    }
}, {dedupe: true})



const playerAction = function (action: string) {
    // combatStore.processPlayerTurn(action);
}

const enemyHpRatio = computed((): string => {
    let x = getOpponentHP.value.dividedBy(getOpponentStats.value.maxHP).times(100)
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





const startFight = function(id: string) {

}


const moves = new Map<string, Move>([
    ["lacerate", {
        baseDmg: new Decimal("100"),
        multi: 1.1,
    } as Attack]

]) 


//TODO: I'm thinking, def is a flat subtraction to damage, atk is a flat addition - skills will have base values these are added to, some may use a multiplier instead of an addition
const griffin = {
    name: "Griffin",
    attack: new Decimal("500"),
    physDef: new Decimal("120"),
    magRes: new Decimal("180"),
    maxHP: new Decimal("1500"),
    spd: 200,
    soulAbsorb: new Decimal("1"),
    soulKill: new Decimal("1"),
    aiType: AI_Type.AGGRO,
    moveList: ["lacerate"],
} as Enemy2



//TODO: Make separate functions for each AI that is passed in a movelist, does calcs on the moves and status, and returns the chosen move




let turnNumber = 0
const { findNode } = useVueFlow({ id:"map"});

// -- State --
const activeCombat = ref(false)
const playerTurn = ref(false)
const currentOpponent = ref<Enemy2>({
    name: "Dummy",
    attack: new Decimal("1"),
    physDef: new Decimal("0"),
    magRes: new Decimal("0"),
    maxHP: new Decimal("1"),
    spd: 1000,
    soulAbsorb: new Decimal("1"),
    soulKill: new Decimal("1"),
    aiType: AI_Type.AGGRO,
    moveList: [] as string[],
})
const currentHP = ref<Decimal>(new Decimal("0"))
const carouselArray = ref<CarouselItem[]>([])
const logFeed = ref<string[]>([""])

// -- Getters/Computeds --
const getOpponentStats = computed(() => currentOpponent.value)
const getOpponentHP = computed(() => currentHP.value)



const playerStats = ref({
    attack: new Decimal("300"),
    physDef: new Decimal("50"),
    magRes: new Decimal("30"),
    maxHealth: new Decimal("2800"),
    currentHealth: new Decimal("2800"),
    spd: 120,
    sp: 2,
    maxSP: 2
})

const getAtk = computed(() => playerStats.value.attack)
const getPhysDef = computed(() => playerStats.value.physDef)
const getMagRes = computed(() => playerStats.value.magRes)
const getHpCurr = computed(() => playerStats.value.currentHealth)
const getHpMax = computed(() => playerStats.value.maxHealth)
const getSpd = computed(() => playerStats.value.spd)
const playerHpRatio = computed(() => {
    let x = playerStats.value.currentHealth.dividedBy(playerStats.value.maxHealth).times(100)
    if(x.gte("0")) {
        return ( x + "%")
    } 
    else {
        return "0%"
    }
})


//TODO: Remove combat carousel :(
function startCombat(enemy: Enemy2): void {
    //Load new enemy into memory
    activeCombat.value = true;
    currentOpponent.value = enemy;
    currentHP.value = enemy.maxHP;
    //player.baseStats.currentHealth = player.baseStats.maxHealth; 

    //initial 8-turn population of carousel
    //Carousel item IDs have to be unique, so turnNumber: -turnNumber for enemies to keep that true. If we add more enemies to battle down the line, an easy fix would be incrementing after the decimal point (which would change data type but, whatever)
    for(turnNumber = 1; carouselArray.value.length < 8; turnNumber++) {
        if(turnNumber%getSpd.value === 0) {
            carouselArray.value.push({turnNumber: turnNumber, type: "player"})
        }
        if(turnNumber%enemy.spd === 0) {
            carouselArray.value.push({turnNumber: -turnNumber, type: "enemy"})
        }   
    }
    // runTurn();
}












defineExpose({ enemyHpRatio })

</script>

<style>

#info_player_hp_bar_solid2 {
        width: v-bind("player.playerHpRatio")
    }

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
    #info_enemy_hp_bar_solid2 {
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

        #info_soul_graphic2 {
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