<template>
    <div v-show="active === 'combat'" id="combat_tab">

        <div class="combat_graphics_container">
            <div id="info_player_graphic" class="general_outline combat_graphic">
                <Transition name="attack-text">
                    <div v-show="playerDamage">{{player.getAtkDisplay + " damage!"}}</div>
                </Transition>
            </div>
            <div id="info_soul_graphic">
                a lil soul icon will go here <br />
                <button @click="startFight(mapStuff.enemyList.rat)">test</button> <br />
                
                <!-- <button @click="removeItem()">Tick</button> -->
                <!-- <button @click="removeItem">Subtract</button> -->
            </div>
            <div id="info_enemy_graphic" class="general_outline combat_graphic">
                <Transition name="attack-text">
                    <span v-show="enemyDamage">{{ enemyAtk.toString() + " damage!" }}</span>
                </Transition>
            </div>
        </div>

        <div id="turn_carousel" class="general_outline">
            <div id="carousel_line" class="general_outline"></div>
            <TransitionGroup name="carousel">
                <CarouselIcon v-for="(item) in carousel_array" :key="item.id" :icon="item.type" />
            </TransitionGroup>
        </div>

        <div class="stats_flex_container">
            <div class="general_outline stats_container">
                <div class="general_outline info_hp_bar_outline">
                    <div id="info_player_hp_bar_solid" class="hp_bar_background"></div>
                    {{ player.getHpCurrDisplay + " / " + player.getHpMaxDisplay }}
                </div>
                <div class="general_outline combat_stats">
                    Atk: {{ player.getAtkDisplay }} <br />
                    Def: {{ player.getDefDisplay }} <br />

                </div>
                <button @click="playerAttack('')" :disabled="!playerTurn">go</button>
            </div>

            <div v-show="fighting" class="general_outline stats_container" >
                <div class="general_outline info_hp_bar_outline">
                    <div id="info_enemy_hp_bar_solid" class="hp_bar_background"></div>
                    {{ enemyHpCurr + " / " + enemyHpMax }}
                </div>
                <div class="general_outline combat_stats">
                    <div style="width: 100%; height: 100%" v-show="fighting">
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
import { ref, computed } from 'vue';
import type { Enemy } from '../types/enemy';
import type { CarouselItem } from '../types/carouselItem';
import CarouselIcon from './CarouselIcon.vue';
const player = usePlayer();
const mapStuff = useMapStuff();

const name = "combatpanel";

const props = defineProps({
    active: String
})

const carousel_array = ref<CarouselItem[]>([])
const arrayIndex = ref(0)

const addItem = function(type:string) {
    carousel_array.value.push({id: arrayIndex.value, type: type})
    arrayIndex.value++;
}
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



const fighting = ref(false);
const enemyName = ref("");
const enemyAtk = ref(new Decimal(0));
const enemyDef = ref(new Decimal(0));
const enemyHpMax = ref(new Decimal(0));
const enemyHpCurr = ref(new Decimal(0));
const enemySpd = ref(0);
var arrCount = 0;
const playerTurn = ref(false);
const playerDamage = ref(false);
const enemyDamage = ref(false);

const win = ref("");
const battleResult = ref("");

const startFight = function(enemy:Enemy) {
    player.baseStats.currentHealth = player.baseStats.maxHealth;
    battleResult.value = "";

    fighting.value = true
    enemyName.value = enemy.name;
    enemyAtk.value = enemy.attack;
    enemyDef.value = enemy.defense;
    enemyHpMax.value = enemy.hp;
    enemyHpCurr.value = enemy.hp;
    enemySpd.value = enemy.spd;

    carousel_array.value = [];

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

const runTurn = function() {
    if(player.baseStats.currentHealth.lte(0)){
        battleResult.value = "lose :(";
        carousel_array.value = [];
    }
    else if(enemyHpCurr.value.lte(0)) {
        battleResult.value = "win! :3"
        carousel_array.value = [];
    }
    else if(carousel_array.value[0].type === "player") {
        playerTurn.value = true;
    }
    else {
        runEnemyTurn();
    }
}

const playerAttack = function(attack:string) {
    playerTurn.value = false;
    //only one attack, this can be added later but just make a separate function to determine
    //specific attack effects, or a switch case or something idk
    //for now this shall be flavored as Claw

    //play animation
    
    playerDamage.value = true;
    setTimeout(function(){
        playerDamage.value = false;
        enemyHpCurr.value = Decimal.subtract(enemyHpCurr.value, Decimal.subtract(player.getAtk, enemyDef.value));
    }, 400)
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

const up = function() {
    // player.baseStats.currentHealth = Decimal.subtract(player.baseStats.currentHealth, 1);
    console.log(enemyHpRatio)
}

const down = function() {
    player.subtractSoul(1)


}


//TODO//
//Make a new store, for map data - should be mostly just things like the enemy list
//area names and descriptions may change, and likely will end up doing so - BUT!
//you also may consider just having areas in the same other store, and having an
//additional variable that prompts it to look for changes in the savefile.
//or something like, parse the area data through getters and use special characters to denote
//grabbing from the save file. maybe
//run this by malth lmao
//hi malth

</script>

<style>
    #info_player_hp_bar_solid {
        width: v-bind("player.playerHpRatio")
    }
    #info_enemy_hp_bar_solid {
        width: v-bind("enemyHpRatio")
    }
</style>