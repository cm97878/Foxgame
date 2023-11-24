<template>
    <div v-show="active === 'combat'" id="combat_tab">

        <div class="combat_graphics_container">
            <div id="info_player_graphic" class="combat_graphic">
                <div class="name_box">{{ player.name }}</div>
                <Transition name="attack-text">
                    <div v-show="playerDamage">{{player.getAtkDisplay + " damage!"}}</div>
                </Transition>
            </div>
            <div id="info_soul_graphic">
                a lil soul icon will go here <br />
                <button @click="startRandomFight(mapStuff.enemyList)">test</button> <br />
                
            </div>
            <div v-if="fighting" id="info_enemy_graphic" class="combat_graphic">
                <div class="name_box">{{ enemyName }}</div>
                <Transition name="attack-text">
                    <span v-show="enemyDamage">{{ enemyAtk.toString() + " damage!" }}</span>
                </Transition>
            </div>
            <div v-else class="combat_graphic not_fighting">
            </div>
        </div>


        <div id="turn_carousel" class="general_outline">
            <div id="carousel_line" class="general_outline"></div>
            <TransitionGroup name="carousel">
                <CarouselIcon v-for="(item) in carousel_array" :key="item.id" :icon="item.type" />
            </TransitionGroup>
        </div>

        

        <div class="stats_flex_container">
            <div class="stats_container">
                <div class="general_outline info_hp_bar_outline">
                    <div id="info_player_hp_bar_solid" class="hp_bar_background"></div>
                    {{ player.getHpCurrDisplay + " / " + player.getHpMaxDisplay }}
                </div>
                <div class="general_outline combat_stats">
                    Atk: {{ player.getAtkDisplay }} <br />
                    Def: {{ player.getDefDisplay }} <br />

                </div>
                <div class="combat_actions">
                    <button @click="playerAction('attack')" :disabled="!playerTurn">Attack</button>
                    <button @click="playerAction('wait')" :disabled="!playerTurn">Wait</button>
                </div>
            </div>

            <div v-show="fighting" class="stats_container" >
                <div class="general_outline info_hp_bar_outline">
                    <div id="info_enemy_hp_bar_solid" class="hp_bar_background"></div>
                    {{ enemyHpCurr + " / " + enemyHpMax }}
                </div>
                <div class="general_outline combat_stats">
                    <div style="width: 100%; height: 100%">
                        Atk: {{ enemyAtk }} <br />
                        Def: {{ enemyDef }} <br />
                        
                    </div>
                </div>
            </div>
        </div>

        <div id="info_combat_log">
            {{ battleResult }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlayer } from '@/stores/player';
import { useMapStuff } from '@/stores/mapStuff';
import Decimal from 'break_infinity.js';
import { ref, computed, watch } from 'vue';
import type { Enemy } from '../types/enemy';
import type { CarouselItem } from '../types/carouselItem';
import CarouselIcon from './CarouselIcon.vue';
import { storeToRefs } from 'pinia';
const player = usePlayer();
const mapStuff = useMapStuff();

const name = "combatpanel";

const props = defineProps({
    active: String
})

/** 
 * TODO: Need to figure out how to format the actual fight page.
 * Areas might in general have more than just combat, so this should be
 * decided at some point. Will you be able to fish at the river?
 * Will you gather herbs? Could just keep the combat space as it is
 * right now but could also have it be its own sorta tab thingy?
 * Could do a like, tab style w/ a general info, combat, gathering
 * Put picture, description, overview (enemies, can gather, can fish, etc)
 * on the general info and then the actions can be done at the individual tabs
 * 
 * also im totally putting off making the nodemap lol thats gonna be so annoying
*/


//sets up the carousel, empty ref array, start index
const carousel_array = ref<CarouselItem[]>([])
const arrayIndex = ref(0)

//adds item, increments index
const addItem = function(type:string) {
    carousel_array.value.push({id: arrayIndex.value, type: type})
    arrayIndex.value++;
}
//shifts array, loops arrCount (battle turn timer) until another turn is added
const incrementCarousel = function() {
    carousel_array.value.shift();
    for(; carousel_array.value.length < 8; arrCount++) {
        if(arrCount%player.getSpd === 0) {
            addItem("player");
        }
        if(arrCount%enemySpd.value === 0) {
            addItem("enemy");
        }
    }
}


//stats
const fighting = ref(false);
const enemyName = ref("Not Fighting");
const enemyAtk = ref(new Decimal(0));
const enemyDef = ref(new Decimal(0));
const enemyHpMax = ref(new Decimal(0));
const enemyHpCurr = ref(new Decimal(0));
const enemySpd = ref(0);
const enemySoulKill = ref(new Decimal(0));
const enemySoulAbsorb = ref(new Decimal(0));

var arrCount = 0; //battle turn timer
const playerTurn = ref(false); //controls whether player can click actions


//stuff for testing, will delete later
const playerDamage = ref(false);
const enemyDamage = ref(false);
const win = ref("");
const battleResult = ref("");
const { encounterSignal$ } = storeToRefs(mapStuff)

//Signals
watch( encounterSignal$, (signal) => {
    console.log('tock!');
    startFight(signal);
})



const startFight = function(enemy:Enemy) {
    //heal player, this may be redundant.. currHealth should maybe be var in combatPanel instead?
    //i dont plan to have damage persist for other things
    player.baseStats.currentHealth = player.baseStats.maxHealth; 
    battleResult.value = "";

    //fighting true, enemy values equal to passed enemy
    fighting.value = true
    enemyName.value = enemy.name;
    enemyAtk.value = enemy.attack;
    enemyDef.value = enemy.defense;
    enemyHpMax.value = enemy.hp;
    enemyHpCurr.value = enemy.hp;
    enemySpd.value = enemy.spd;
    enemySoulAbsorb.value = enemy.soulAbsorb;
    enemySoulKill.value = enemy.soulKill;
    
    //reset array stuff
    carousel_array.value = [];
    arrayIndex.value = 0;

    //initial 8-turn population of carousel
    for(arrCount = 1; carousel_array.value.length < 8; arrCount++) {
        if(arrCount%player.getSpd === 0) {
            addItem("player");
        }
        if(arrCount%enemySpd.value === 0) {
            addItem("enemy");
        }
    }
    runTurn();
}

const startRandomFight = function(enemyList:Array<Enemy>) {
    //Pull random encounter out of the enemyList
    const encounterIdx = Math.floor(Math.random() * enemyList.length );
    console.log(encounterIdx)
    return startFight(enemyList[encounterIdx]);
}

//check if battle is over and handle, otherwise run turn based on upcoming carousel item
const runTurn = function() {
    if(player.baseStats.currentHealth.lte(0)){
        battleResult.value = "lose :(";
        carousel_array.value = [];
    }
    else if(enemyHpCurr.value.lte(0)) {
        battleResult.value = "win! :3";
        enemyName.value = "dead lul";
        player.addSoul(enemySoulKill.value);
        carousel_array.value = [];
        fighting.value = false;
    }
    else if(carousel_array.value[0].type === "player") {
        playerTurn.value = true; //just enables player buttons that will do stuff
    }
    else {
        runEnemyTurn();
    }
}

const playerAction = function(action:string) {
    playerTurn.value = false;
    //only one attack, this can be added later but just make a separate function to determine
    //specific attack effects, or a switch case or something idk
    //for now this shall be flavored as Claw


    //play animation here someday
    //Should probably make something neater then Timeouts in the future... -Malt
    //Maybe use enums too? -M
    switch(action) {
        case "attack": {
            //for now, show dmg text immediately, wait .4s, fadeout and deal damage
            playerDamage.value = true;
            setTimeout(function(){
                playerDamage.value = false;
                enemyHpCurr.value = Decimal.subtract(enemyHpCurr.value, Decimal.subtract(player.getAtk, enemyDef.value));
            }, 400)
        }
        case "wait": {
            //nothing, possibly add a regen later.
        }
    }

    //wait another .4s past first, increment turn, run next turn
    setTimeout(function(){
        incrementCarousel();
        runTurn(); 
    }, 800)
}

const runEnemyTurn = function() {
    //enemy ai should go here, but thats. way down the line

    enemyDamage.value = true;
    setTimeout(function() {
        enemyDamage.value = false;
        player.damage(Decimal.subtract(enemyAtk.value, player.getDef));
    }, 400)
    setTimeout(function(){
        incrementCarousel();
        runTurn(); 
    }, 800)
}

const enemyHpRatio = computed(() : string => {
    let x = enemyHpCurr.value.dividedBy(enemyHpMax.value).times(100)
    if(x.gte("0")) {
        return ( x + "%")
    } 
    else {
        return "0%"
    }
})



defineExpose({enemyHpRatio})

</script>

<style>
    #info_player_hp_bar_solid {
        width: v-bind("player.playerHpRatio")
    }
    #info_enemy_hp_bar_solid {
        width: v-bind("enemyHpRatio")
    }
</style>