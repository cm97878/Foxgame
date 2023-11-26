import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Upgrade } from '@/types/upgrade';
import { UpgradePurchaseType } from '@/enums/upgradePurchaseType';

export const usePlayer = defineStore('player', {
    state: () => ({
        currencies: {
            soul: new Decimal("0"),
            maxSoul: new Decimal("10"),
        },
        name: "Fox",
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
            let finalSoul = this.currencies.soul;
            return finalSoul;
        },
        getSoulDisplay(): string {
            return this.getSoul.toString().replace("+","");
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
        enoughSoul(soulCompare:Decimal|number) {
            if(this.currencies.soul.gte(soulCompare)) {
                return true;
            }
            else return false;
        },
        damage(damageAmnt:Decimal|number, AP:Boolean=false) {
            if(AP) {
                this.baseStats.currentHealth = Decimal.subtract(this.baseStats.currentHealth, Decimal.subtract(damageAmnt, this.getDef));
            }
            else {
                this.baseStats.currentHealth = Decimal.subtract(this.baseStats.currentHealth, damageAmnt);
            }
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
        }
    }

})