import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Upgrade } from '@/types/upgrade';
import { UpgradePurchaseType } from '@/enums/upgradeType';

export const usePlayer = defineStore('player', {
    state: () => ({
        currencies: {
            soul: new Decimal("0"),
        },
        
        //FIXME: i think this may want to be either reworked or moved to its own store. only thing thats
        //gotta be saved is show (unlocked) and bought, and we can bind those values to stuff in this store
        //but for now this works
        upgrades: {
            /*
                show: false,
                bought: false,
                title: "",
                type: UpgradePurchaseType.SOUL,
                description: "",
                cost: new Decimal("0")
            */
            soul: [
                {
                    show: true,
                    bought: false,
                    type: UpgradePurchaseType.SOUL,
                    title: "upgrade 1",
                    description: "unbought, cant afford",
                    cost: new Decimal("100")
                },
                {
                    show: true,
                    bought: false,
                    type: UpgradePurchaseType.SOUL,
                    title: "upgrade 2",
                    description: "unbought, can afford",
                    cost: new Decimal("0")
                },
                {
                    show: true,
                    bought: true,
                    type: UpgradePurchaseType.SOUL,
                    title: "upgrade 3",
                    description: "bought",
                    cost: new Decimal("0")
                },
                {
                    show: false,
                    bought: true,
                    type: UpgradePurchaseType.SOUL,
                    title: "upgrade 4",
                    description: "bought",
                    cost: new Decimal("0")
                }
            ] as Array<Upgrade>
        },
        name: "Fox",
        baseStats: {
            attack: new Decimal("3"),
            defense: new Decimal("0"),
            maxHealth: new Decimal("15"),
            currentHealth: new Decimal("15"),
            spd: 200
        }
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
            this.currencies.soul = Decimal.add(this.currencies.soul, soulAdd);
        },
        subtractSoul(soulSubtract:Decimal|number) {
            this.currencies.soul  = Decimal.subtract(this.currencies.soul, soulSubtract)
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
        }
    }

})