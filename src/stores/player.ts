import { defineStore, storeToRefs } from 'pinia'
import Decimal from 'break_infinity.js'
import { computed, ref, watch } from "vue";
import { useMapStore } from './mapStore';
import { useGameTick } from './gameTick';
import { GameStage } from '@/enums/gameStage';
import { SpecialAreaId } from '@/enums/areaEnums';

export const usePlayer = defineStore('player', () => {

    // -- Game states --
    const loaded = ref(false);
    const firstMove = ref(true);
    const gameStage = ref(GameStage.INTRO);
    const furthestStage = ref(GameStage.INTRO);
    const deniedSoul = ref(false);
    const exploreUnlocked = ref(false);
    const soulUnlocked = ref(false);



    // -- Stats --
    const currencies = ref({
        soul: new Decimal("0"),
        maxSoul: new Decimal("10"),
        food: new Decimal("0"),
        energy: 40,
        maxEnergy: 100
    })

    const name = ref("Fox")
    const tails = ref(1)
    const playerStats = ref({
        attack: new Decimal("3"),
        defense: new Decimal("0"),
        maxHealth: new Decimal("15"),
        currentHealth: new Decimal("15"),
        spd: 200,
    })
    const baseStats = ref({
        hpRegen: .5,
        energyRegen: .2
    })



    // -- Watch processes --
    const gameTick = useGameTick();
    const mapStore = useMapStore();
    const { tick$ } = storeToRefs(gameTick);
    //Game tick
    watch( tick$, () => {
        const areaId = mapStore.isSpecial

        //Only regen at home.
        if(areaId === SpecialAreaId.HOME) {
            //HP Regen.
            const stats = playerStats.value
            const bStats = baseStats.value
            const energy = currencies.value
            if (stats.currentHealth.lt(stats.maxHealth)) {
                if(Decimal.add(stats.currentHealth, bStats.hpRegen).gte(stats.maxHealth)) {
                    playerStats.value.currentHealth = stats.maxHealth
                } else {
                    // Need to figure out what rounds to decimal places in break_infinity.js
                    playerStats.value.currentHealth = Decimal.add(stats.currentHealth, bStats.hpRegen)
                }
            }

            //Energy Regen
            if (energy.energy < energy.maxEnergy) {
                if((energy.energy + bStats.energyRegen) > energy.maxEnergy) {
                    currencies.value.energy = energy.maxEnergy
                } else {
                    currencies.value.energy = Number((energy.energy + bStats.energyRegen).toFixed(2))
                }
            }
        }


    })



    // -- Getters/Computeds --
    const getAtk = computed(() => playerStats.value.attack)
    const getDef = computed(() => playerStats.value.defense)
    const getHpCurr = computed(() => playerStats.value.currentHealth)
    const getHpMax = computed(() => playerStats.value.maxHealth)
    const getSpd = computed(() => playerStats.value.spd)
    const getSoul = computed(() => currencies.value.soul)
    const getMaxSoul = computed(() => currencies.value.maxSoul)
    const getEnergyDisplay = computed(() => currencies.value.energy + "/" + currencies.value.maxEnergy)
    const playerHpRatio = computed(() => {
        let x = playerStats.value.currentHealth.dividedBy(playerStats.value.maxHealth).times(100)
        if(x.gte("0")) {
            return ( x + "%")
        } 
        else {
            return "0%"
        }
    })
    const getFood = computed(() => currencies.value.food)

    const getHPRegen = computed(() => baseStats.value.hpRegen)
    const getEnergyRegen = computed(() => baseStats.value.energyRegen)


    // -- Actions --
    function addSoul(soulAdd:Decimal|number) {
        if(Decimal.add(currencies.value.soul, soulAdd).gt(currencies.value.maxSoul)) {
            currencies.value.soul = currencies.value.maxSoul;
        }
        else {
            currencies.value.soul = Decimal.add(currencies.value.soul, soulAdd);
        }
    }

    function addFood(foodAdd:Decimal|number) {
        currencies.value.food = Decimal.add(currencies.value.food, foodAdd);
    }

    function subtractSoul(soulSubtract:Decimal|number) {
        currencies.value.soul  = Decimal.subtract(currencies.value.soul, soulSubtract)
        if(currencies.value.soul.lt("0")) {
            console.log("Subtracted soul that went below 0, a check somewhere is wrong. Amnt subtracted: " + soulSubtract)
        }
    }

    function damage(damageAmnt:Decimal|number, pierce:Boolean=false) {
        if(pierce) {
            playerStats.value.currentHealth = Decimal.subtract(playerStats.value.currentHealth, Decimal.subtract(damageAmnt, playerStats.value.defense));
        }
        else {
            playerStats.value.currentHealth = Decimal.subtract(playerStats.value.currentHealth, damageAmnt);
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
        return (mapStore.totalScouted >= scoutedCompare);
    }
    function enoughKills(killsCompare:number) {
        return (mapStore.totalKills >= killsCompare);
    }
    function enoughEnergy(energyCompare:number) {
        return (currencies.value.energy >= energyCompare);
    }

    function addBaseAtk(amnt:Decimal|number) {
        playerStats.value.attack = Decimal.add(playerStats.value.attack, amnt);
    }
    function addBaseDef(amnt:Decimal|number) {
        playerStats.value.defense = Decimal.add(playerStats.value.defense, amnt);
    }
    function addBaseHealth(amnt:Decimal|number) {
        playerStats.value.maxHealth = Decimal.add(playerStats.value.maxHealth, amnt);
    }
    function addHPRegen(amnt:number) {
        baseStats.value.hpRegen = baseStats.value.hpRegen + amnt;
    }
    function addEnergyRegen(amnt:number) {
        baseStats.value.energyRegen = baseStats.value.energyRegen + amnt;
    }
    //name this different just cause lower is better, functions different than the others
    function modifySpeed(amnt:number) {
        playerStats.value.spd += amnt;
    }

    function modifyMaxSoul(amnt:Decimal|number) {
        currencies.value.maxSoul = Decimal.add(currencies.value.maxSoul, amnt);
    }

    function addTail() {
        if(tails.value < 9) {
            currencies.value.maxSoul = Decimal.mul(currencies.value.maxSoul, 10);
            tails.value++;
			if(gameStage.value <= GameStage.PRE_TAILS) {
                gameStage.value = GameStage.TAILS

                //this feels clunky, may want a better way to update this later?
                //like a watcher, that if gamestage > furthest stage, furtheststage=gamestage
                //idk
                if(furthestStage.value <= GameStage.PRE_TAILS) {
                    furthestStage.value = GameStage.TAILS;
                }
            }
            currencies.value.soul = new Decimal("0")
        }
    }

    return {
        //Stats
        currencies, name, tails, playerStats, gameStage, furthestStage, loaded, firstMove, deniedSoul, exploreUnlocked, soulUnlocked,
        //Computeds
        getAtk, getDef, getHpCurr, getHpMax, getSpd, getSoul, getMaxSoul, getEnergyDisplay, playerHpRatio, getFood,
        getHPRegen, getEnergyRegen,
        // Actions
        addSoul, subtractSoul, damage, payEnergy, enoughSoul, enoughScouted, enoughKills, enoughEnergy, addBaseAtk, addBaseDef,
        addBaseHealth, modifySpeed, modifyMaxSoul, addTail, addFood, addHPRegen, addEnergyRegen
    }
})