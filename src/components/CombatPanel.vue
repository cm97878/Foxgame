<template>
    <div v-show="active === 'combat'" id="combat_tab">

        <div class="combat_graphics_container">
            <div id="info_player_graphic" class="general_outline combat_graphic">
                Player will go here
            </div>
            <div id="info_soul_graphic">
                a lil soul icon will go here <br />
                <button @click="startFight(mapStuff.enemyList.rat)">test</button>
                <button @click="runTurn()">go</button>
                <button @click="addItem">Add</button>
                <button @click="removeItem">Subtract</button>
            </div>
            <div id="info_enemy_graphic" class="general_outline combat_graphic">
                enemy will go here
            </div>
        </div>

        <div id="turn_carousel" class="general_outline">
            <CarouselIcon v-for="(item) in carousel_array" :key="item.id" :icon="item.type" />
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

        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlayer } from '@/stores/player';
import { useMapStuff } from '@/stores/mapStuff';
import Decimal from 'break_infinity.js';
import { ref, computed } from 'vue';
import type { Enemy } from '../types/enemy';
import CarouselIcon from './CarouselIcon.vue';
const player = usePlayer();
const mapStuff = useMapStuff();

const name = "combatpanel";

const props = defineProps({
    active: String
})

const carousel_array = ref([
    {
        id: 0,
        type: "player"
    },
    {
        id: 1,
        type: "enemy"
    },
    {
        id: 2,
        type: "player"
    },
    {
        id: 3,
        type: "player"
    }
])
const arrayIndex = ref(4)

const addItem = function() {
    carousel_array.value.push({id: arrayIndex.value, type: "player"})
}
const removeItem = function() {
    carousel_array.value.shift();
}



const fighting = ref(false);
const enemyName = ref("");
const enemyAtk = ref(new Decimal(0));
const enemyDef = ref(new Decimal(0));
const enemyHpMax = ref(new Decimal(0));
const enemyHpCurr = ref(new Decimal(0));

const startFight = function(enemy:Enemy) {
    fighting.value = true
    enemyName.value = enemy.name;
    enemyAtk.value = enemy.attack;
    enemyDef.value = enemy.defense;
    enemyHpMax.value = enemy.hp;
    enemyHpCurr.value = enemy.hp;

}

const runTurn = function() {
    enemyHpCurr.value = Decimal.subtract(enemyHpCurr.value, player.getAtk);
    if(enemyHpCurr.value.gte(0)) {
        player.damage(enemyAtk.value);
    }
    else{
        console.log("you win!")
    }
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