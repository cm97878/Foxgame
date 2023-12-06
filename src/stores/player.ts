import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Upgrade } from '@/types/upgrade';
import { UpgradePurchaseType } from '@/enums/upgradePurchaseType';
import { useMapStore } from './mapStore';
import { GameStage } from '@/enums/gameStage';

export const usePlayer = defineStore('player', {
    state: () => ({
        gameStage: GameStage.INTRO,
        furthestStage: GameStage.INTRO,
        currencies: {
            soul: new Decimal("0"),
            maxSoul: new Decimal("10"),
            food: new Decimal("0"),
        },
        name: "Fox",
        tails: 1,
        baseStats: {
            attack: new Decimal("3"),
            defense: new Decimal("0"),
            maxHealth: new Decimal("15"),
            currentHealth: new Decimal("15"),
            spd: 200
        },
    }),
    getters: {
        //get base stats
        getAtk(): Decimal {
            let finalAtk = this.baseStats.attack;
            return finalAtk;
        },
        getAtkDisplay(): string {
            return this.getAtk.toString().replace("+","");
        },

        getDef(): Decimal {
            let finalDef = this.baseStats.defense;
            return finalDef;
        },
        getDefDisplay(): string {
            return this.getDef.toString().replace("+","");
        },

        getHpCurr(): Decimal {
            let finalHpCurr = this.baseStats.currentHealth;
            return finalHpCurr;
        },
        getHpCurrDisplay(): string {
            return this.getHpCurr.toString().replace("+","");
        },

        getHpMax(): Decimal {
            let finalHpMax = this.baseStats.maxHealth;
            return finalHpMax;
        },
        getHpMaxDisplay(): string {
            return this.getHpMax.toString().replace("+","");
        },

        getSpd(): number {
            let finalSpd = this.baseStats.spd;
            return finalSpd;
        },


        getSoul(): Decimal {
            return this.currencies.soul;
        },
        getMaxSoul(): Decimal {
            return this.currencies.maxSoul;
        },
        getSoulDisplay(): string {
            return this.getSoul.toString().replace("+","");
        },


        getFood(): Decimal {
            return this.currencies.food;
        },
        getFoodDisplay(): string {
            return this.getFood.toString().replace("+","");
        },

        
        totalKills(): number {
            const mapStore = useMapStore();
            let val = 0;
            mapStore.nodes.forEach(element => {
                val += element.data.killCount;
            })
            return val;
        },
        totalScouted(): number {
            const mapStore = useMapStore();
            let val = 0;
            mapStore.nodes.forEach(element => {
                if(element.data.killCount >= element.data.scoutThreshold) {
                    val++;
                }
            })
            return val;
        },


        playerHpRatio(): string {
            let x = this.getHpCurr.dividedBy(this.getHpMax).times(100)
            if(x.gte("0")) {
                return ( x + "%")
            } 
            else {
                return "0%"
            }
        },
    },
    actions: {
        addSoul(soulAdd:Decimal|number) {
            if(Decimal.add(this.currencies.soul, soulAdd).gt(this.currencies.maxSoul)) {
                this.currencies.soul = this.currencies.maxSoul;
            }
            else {
                this.currencies.soul = Decimal.add(this.currencies.soul, soulAdd);
            }
        },
        subtractSoul(soulSubtract:Decimal|number) {
            this.currencies.soul  = Decimal.subtract(this.currencies.soul, soulSubtract)
            if(this.currencies.soul.lt("0")) {
                console.log("Subtracted soul that went below 0, a check somewhere is wrong. Amnt subtracted: " + soulSubtract)
            }
        },
        damage(damageAmnt:Decimal|number, AP:Boolean=false) {
            if(AP) {
                this.baseStats.currentHealth = Decimal.subtract(this.baseStats.currentHealth, Decimal.subtract(damageAmnt, this.getDef));
            }
            else {
                this.baseStats.currentHealth = Decimal.subtract(this.baseStats.currentHealth, damageAmnt);
            }
        },


        
        enoughSoul(soulCompare:number|Decimal) {
            return this.currencies.soul.gte(soulCompare);
        },
        enoughScouted(scoutedCompare:number) {
            return (this.totalScouted >= scoutedCompare);
        },
        enoughKills(killsCompare:number) {
            return (this.totalKills >= killsCompare);
        },



        addBaseAtk(amnt:Decimal|number) {
            this.baseStats.attack = Decimal.add(this.baseStats.attack, amnt);
        },
        addBaseDef(amnt:Decimal|number) {
            this.baseStats.defense = Decimal.add(this.baseStats.defense, amnt);
        },
        addBaseHealth(amnt:Decimal|number) {
            this.baseStats.maxHealth = Decimal.add(this.baseStats.maxHealth, amnt);
        },
        //name this different just cause lower is better, functions different than the others
        modifySpeed(amnt:number) {
            this.baseStats.spd += amnt;
        },

        modifyMaxSoul(amnt:Decimal|number) {
            this.currencies.maxSoul = Decimal.add(this.currencies.maxSoul, amnt);
        },


        addTail() {
            if(this.tails < 9) {
                this.currencies.maxSoul = Decimal.mul(this.currencies.maxSoul, 10);
                this.tails++;
                if(this.gameStage <= GameStage.PRE_TAILS) {
                    this.gameStage = GameStage.TAILS

                    //this feels clunky, may want a better way to update this later?
                    //like a watcher, that if gamestage > furthest stage, furtheststage=gamestage
                    //idk
                    if(this.furthestStage <= GameStage.PRE_TAILS) {
                        this.furthestStage = GameStage.TAILS;
                    }
                }
                this.currencies.soul = new Decimal("0")
            }
        },
    }
})