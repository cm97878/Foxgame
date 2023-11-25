import { defineStore } from 'pinia'
import type { Enemy } from '@/types/enemy'
import Decimal from 'break_infinity.js'
import { readonly } from 'vue';

export const useCombatStore = defineStore('combat', {
    state: () => ({
        activeCombat: false as Boolean,
        playerTurn: false,
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
        //TODO: eventually contain the full combat flow in here.
        startCombat(enemy: Enemy): void {
            //Load new enemy into memory
            this.activeCombat = true;
            this.currentOpponent = enemy;
            this.currentHP = enemy.maxHP;

        },
        dealDamage(playerAtk: Decimal): void {
            this.currentHP = Decimal.subtract(this.currentHP, Decimal.subtract(playerAtk, this.currentOpponent.defense));
        },
        // endCombat(): void {
        //     useCombatStore.patch$
        //     this.activeCombat = false;
        // }
    }

})