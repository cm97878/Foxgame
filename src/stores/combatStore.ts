import { defineStore } from 'pinia'
import type { Enemy } from '@/types/enemy'
import Decimal from 'break_infinity.js'
import { computed, ref } from 'vue';
import { usePlayer } from '@/stores/player';
import type { CarouselItem } from '../types/carouselItem';
import { useMapStore } from './mapStore';
import { GameStage } from '@/enums/gameStage';
import { useVueFlow } from '@vue-flow/core';

export const useCombatStore = defineStore('combat', () => {
    let turnNumber = 0
    const { findNode } = useVueFlow({ id:"map"});

    // -- State --
    const activeCombat = ref(false)
    const playerTurn = ref(false)
    const currentOpponent = ref<Enemy>({
        name: "Dummy",
        attack: new Decimal("1"),
        defense: new Decimal("0"),
        maxHP: new Decimal("1"),
        spd: 1000,
        soulAbsorb: new Decimal("1"),
        soulKill: new Decimal("1"),
    })
    const currentHP = ref<Decimal>(new Decimal("0"))
    const carouselArray = ref<CarouselItem[]>([])
    const logFeed = ref<string[]>([""])

    const mapStore = useMapStore();

    // -- Getters/Computeds --
    const getOpponentStats = computed(() => currentOpponent.value)
    const getOpponentHP = computed(() => currentHP.value)
    const getActiveCombat = computed(() => activeCombat.value)


    // -- Actions --
    function startCombat(enemy: Enemy): void {
        //Load new enemy into memory
        const player = usePlayer();
        activeCombat.value = true;
        currentOpponent.value = enemy;
        currentHP.value = enemy.maxHP;
        //player.baseStats.currentHealth = player.baseStats.maxHealth; 

        //initial 8-turn population of carousel
        //Carousel item IDs have to be unique, so turnNumber: -turnNumber for enemies to keep that true. If we add more enemies to battle down the line, an easy fix would be incrementing after the decimal point (which would change data type but, whatever)
        for(turnNumber = 1; carouselArray.value.length < 8; turnNumber++) {
            if(turnNumber%player.getSpd === 0) {
                carouselArray.value.push({turnNumber: turnNumber, type: "player"})
            }
            if(turnNumber%enemy.spd === 0) {
                carouselArray.value.push({turnNumber: -turnNumber, type: "enemy"})
            }   
        }
        runTurn();
    }

    function pushToCombatLog(log: string): void {
        const tempArray = logFeed.value;
        tempArray.unshift(log);
        if (tempArray.length > 7) {
            tempArray.pop()
        }

        logFeed.value = tempArray;
    }

    function dealDamage(playerAtk: Decimal): void {
        const damage = Decimal.max(Decimal.subtract(playerAtk, currentOpponent.value.defense), 0);
        currentHP.value = Decimal.subtract(currentHP.value, damage);
        pushToCombatLog( currentOpponent.value.name + " took " + damage + " damage!" );
    }

    function processPlayerTurn(action: string): void {
        const player = usePlayer();
        switch(action) {
            case "attack": {
                dealDamage(player.getAtk)
            }
            case "wait": {
                //nothing, possibly add a regen later.
            }
        }
        repopulateTurns();
        runTurn(); 
    }

    // -- Private functions --
    function runTurn(): void {
        const player = usePlayer();
        //Check for battle end.
        if(player.getHpCurr.lte(0)){
            pushToCombatLog("Defeat..")
            mapStore.moveToNode(findNode("Home")!) 
            endCombat();
        }
        else if(currentHP.value.lte(0)) {
            if(player.gameStage != GameStage.INTRO) {
                pushToCombatLog("Victory! Gained " + currentOpponent.value.soulKill + " Soul.")
                player.addSoul(currentOpponent.value.soulKill);
            }
            else {
                pushToCombatLog("Victory! Gained " + currentOpponent.value.soulKill + " meat.")
                player.addFood(1);
            }
            mapStore.addKills(1);
            endCombat();
        }
        else if(carouselArray.value[0].type === "player") {
            playerTurn.value = true; //just enables player buttons that will do stuff
            return;
        }
        else {
            //Run enemy Turn:
            const damage = Decimal.subtract(getOpponentStats.value.attack, player.getDef)
            player.damage(damage);
            
            
            setTimeout(() => {
                pushToCombatLog("Player took " + (Decimal.gt(damage,0) ? damage : "no") + " damage!")
                repopulateTurns();
                runTurn();
            }, 300)
        }
    }

    //shifts array, loops turnTimer (battle turn timer) until another turn is added
    function repopulateTurns() {
        const player = usePlayer();
        carouselArray.value.shift();
        for(; carouselArray.value.length < 8; turnNumber++) {
            if(turnNumber%player.getSpd === 0) {
                carouselArray.value.push({turnNumber: turnNumber, type: "player"})
            }
            if(turnNumber%currentOpponent.value.spd === 0) {
                carouselArray.value.push({turnNumber: -turnNumber, type: "enemy"})
            }
        }
    }

    function endCombat(): void {
        carouselArray.value=[];
        activeCombat.value = false;
        playerTurn.value = false;
        turnNumber = 0;
    }

    return {
        //Stats
        activeCombat, playerTurn, currentOpponent, currentHP, carouselArray, logFeed,
        //Computeds
        getOpponentStats, getOpponentHP, getActiveCombat,
        // Actions
        startCombat, dealDamage, pushToCombatLog, processPlayerTurn,
    }

})