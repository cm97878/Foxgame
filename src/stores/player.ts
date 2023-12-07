import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import { computed, ref } from "vue";
import type { Upgrade } from '@/types/upgrade';
import { UpgradePurchaseType } from '@/enums/upgradePurchaseType';
import { useMapStore } from './mapStore';

export const usePlayer = defineStore('player', () => {
    // -- Stats --
    const currencies = ref({
        soul: new Decimal("0"),
        maxSoul: new Decimal("10"),
        energy: 40,
        maxEnergy: 100
    })

    const name = ref("Fox")
    const tails = ref({
        obtained: false,
        amount: 1,
    })
    const baseStats = ref({
        attack: new Decimal("3"),
        defense: new Decimal("0"),
        maxHealth: new Decimal("15"),
        currentHealth: new Decimal("15"),
        spd: 200
    })

    // -- Getters/Computeds --
    const getAtk = computed(() => baseStats.value.attack)
    const getDef = computed(() => baseStats.value.defense)
    const getHpCurr = computed(() => baseStats.value.currentHealth)
    const getHpMax = computed(() => baseStats.value.maxHealth)
    const getSpd = computed(() => baseStats.value.spd)
    const getSoul = computed(() => currencies.value.soul)
    const getMaxSoul = computed(() => currencies.value.maxSoul)
    const getEnergyDisplay = computed(() => currencies.value.energy + "/" + currencies.value.maxEnergy)
    const playerHpRatio = computed(() => {
        let x = baseStats.value.currentHealth.dividedBy(baseStats.value.maxHealth).times(100)
        if(x.gte("0")) {
            return ( x + "%")
        } 
        else {
            return "0%"
        }
    })

    // TODO: Need to encapsulate these two in a better place later. -Malt
    const totalKills = computed(() => {
        const mapStore = useMapStore();
        let val = 0;
        mapStore.nodes.forEach(element => {
            val += element.data.killCount;
        })
        return val;
    })
    const totalScouted = computed(() => {
        const mapStore = useMapStore();
        let val = 0;
        mapStore.nodes.forEach(element => {
            if(element.data.killCount >= element.data.scoutThreshold) {
                val++;
            }
        })
        return val;
    })

    // -- Actions --
    function addSoul(soulAdd:Decimal|number) {
        if(Decimal.add(currencies.value.soul, soulAdd).gt(currencies.value.maxSoul)) {
            currencies.value.soul = currencies.value.maxSoul;
        }
        else {
            currencies.value.soul = Decimal.add(currencies.value.soul, soulAdd);
        }
    }

    function subtractSoul(soulSubtract:Decimal|number) {
        currencies.value.soul  = Decimal.subtract(currencies.value.soul, soulSubtract)
        if(currencies.value.soul.lt("0")) {
            console.log("Subtracted soul that went below 0, a check somewhere is wrong. Amnt subtracted: " + soulSubtract)
        }
    }

    function damage(damageAmnt:Decimal|number, pierce:Boolean=false) {
        if(pierce) {
            baseStats.value.currentHealth = Decimal.subtract(baseStats.value.currentHealth, Decimal.subtract(damageAmnt, baseStats.value.defense));
        }
        else {
            baseStats.value.currentHealth = Decimal.subtract(baseStats.value.currentHealth, damageAmnt);
        }
    }

    function payEnergy(cost:number) {
        if(currencies.value.energy >= cost) {
            currencies.value.energy -= cost;
        }
    }

    function enoughSoul(soulCompare:number|Decimal) {
        return currencies.value.soul.gte(soulCompare);
    }
    function enoughScouted(scoutedCompare:number) {
        return (totalScouted.value >= scoutedCompare);
    }
    function enoughKills(killsCompare:number) {
        return (totalKills.value >= killsCompare);
    }
    function enoughEnergy(energyCompare:number) {
        return (currencies.value.energy >= energyCompare);
    }

    function addBaseAtk(amnt:Decimal|number) {
        baseStats.value.attack = Decimal.add(baseStats.value.attack, amnt);
    }
    function addBaseDef(amnt:Decimal|number) {
        baseStats.value.defense = Decimal.add(baseStats.value.defense, amnt);
    }
    function addBaseHealth(amnt:Decimal|number) {
        baseStats.value.maxHealth = Decimal.add(baseStats.value.maxHealth, amnt);
    }
    //name this different just cause lower is better, functions different than the others
    function modifySpeed(amnt:number) {
        baseStats.value.spd += amnt;
    }

    function modifyMaxSoul(amnt:Decimal|number) {
        currencies.value.maxSoul = Decimal.add(currencies.value.maxSoul, amnt);
    }

    function addTail() {
        if(tails.value.amount < 9) {
            currencies.value.maxSoul = Decimal.mul(currencies.value.maxSoul, 10);
            tails.value.amount++;
            tails.value.obtained = true;
            currencies.value.soul = new Decimal("0")
        }
    }

    return {
        //Stats
        currencies, name, tails, baseStats,
        //Computeds
        getAtk, getDef, getHpCurr, getHpMax, getSpd, getSoul, getMaxSoul, getEnergyDisplay,
        playerHpRatio, totalKills, totalScouted,
        // Actions
        addSoul, subtractSoul, damage, payEnergy, enoughSoul, enoughScouted, enoughKills,
        enoughEnergy, addBaseAtk, addBaseDef, addBaseHealth, modifySpeed, modifyMaxSoul,
        addTail

    }
})