import { defineStore } from 'pinia'
import type { Enemy } from '@/types/enemy'
import Decimal from 'break_infinity.js'
import { readonly } from 'vue';
import { usePlayer } from '@/stores/player';
import type { CarouselItem } from '../types/carouselItem';

export const useCombatStore = defineStore('combat', {
    state: () => ({
        activeCombat: false as Boolean,
        playerTurn: false as Boolean,
        currentOpponent: {
            name: "Dummy",
            attack: new Decimal("1"),
            defense: new Decimal("0"),
            maxHP: new Decimal("1"),
            spd: 1000,
            soulAbsorb: new Decimal("1"),
            soulKill: new Decimal("1"),
        } as Enemy,
        currentHP: new Decimal("0"),
        carouselArray: <CarouselItem[]>([]),
        turnTimer: 0,
        turnNumber: 0
    }),
    getters: {
        getOpponentStats(): Enemy {
            return readonly(this.currentOpponent);
        },
        getOpponentHP(): Decimal {
            return readonly(this.currentHP);
        },
        getActiveCombat(): Boolean {
            return this.activeCombat;
        }
    },
    actions: {
        startCombat(enemy: Enemy): void {
            //Load new enemy into memory
            const player = usePlayer();
            this.activeCombat = true;
            this.currentOpponent = enemy;
            this.currentHP = enemy.maxHP;
            player.baseStats.currentHealth = player.baseStats.maxHealth; 

            //initial 8-turn population of carousel
            for(this.turnTimer = 1; this.carouselArray.length < 8; this.turnTimer++) {
                if(this.turnTimer%player.getSpd === 0) {
                    this.carouselArray.push({turnNumber: this.turnNumber, type: "player"})
                    this.turnNumber++;
                }
                if(this.turnTimer%enemy.spd === 0) {
                    this.carouselArray.push({turnNumber: this.turnNumber, type: "enemy"})
                    this.turnNumber++;
                }   
            }
            this.runTurn();
        },
        runTurn(): void {
            const player = usePlayer();
            //Check for battle end.
            if(player.baseStats.currentHealth.lte(0)){
                //battleResult.value = "lose :(";
                this.endCombat();
            }
            else if(this.currentHP.lte(0)) {
                //battleResult.value = "win! :3";
                player.addSoul(this.currentOpponent.soulKill);
                this.endCombat();
            }
            else if(this.carouselArray[0].type === "player") {
                this.playerTurn = true; //just enables player buttons that will do stuff
                return;
            }
            else {
                //Run enemy Turn:
                player.damage(Decimal.subtract(this.getOpponentStats.attack, player.getDef));
                setTimeout(() => {
                    this.repopulateTurns();
                    this.runTurn();
                }, 200)
            }
        },
        dealDamage(playerAtk: Decimal): void {
            this.currentHP = Decimal.subtract(this.currentHP, Decimal.subtract(playerAtk, this.currentOpponent.defense));
            //this.repopulateTurns();
        },
        processPlayerTurn(action: string): void {
            const player = usePlayer();
            switch(action) {
                case "attack": {
                    this.dealDamage(player.getAtk)
                }
                case "wait": {
                    //nothing, possibly add a regen later.
                }
            }
            this.repopulateTurns();
            this.runTurn(); 
        },
        //shifts array, loops turnTimer (battle turn timer) until another turn is added
        repopulateTurns() {
            const player = usePlayer();
            this.carouselArray.shift();
            for(; this.carouselArray.length < 8; this.turnTimer++) {
                if(this.turnTimer%player.getSpd === 0) {
                    this.carouselArray.push({turnNumber: this.turnNumber, type: "player"})
                    this.turnNumber++;
                }
                if(this.turnTimer%this.currentOpponent.spd === 0) {
                    this.carouselArray.push({turnNumber: this.turnNumber, type: "enemy"})
                    this.turnNumber++;
                }
            }
        },
        endCombat(): void {
            this.carouselArray=[];
            this.activeCombat = false;
            this.playerTurn = false;
            this.turnNumber = 0;
            this.turnTimer = 0;
        }
    }

})