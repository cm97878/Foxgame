import { defineStore } from "pinia";
import { usePlayer } from "./player";
import { useUpgradeStore } from "./upgradeStore";
import Decimal from "break_infinity.js";
import { ref } from "vue";

export const useSaveStore = defineStore('saveStore', () =>{
    const player = usePlayer();
    const upgrades = useUpgradeStore();

    var saveFile = {
        currencies: {
            soul: player.currencies.soul,
        },
        name: player.name,
        baseStats: {
            attack: player.baseStats.attack,
            defense: player.baseStats.defense,
            maxHealth: player.baseStats.maxHealth,
            currentHealth: player.baseStats.currentHealth,
            spd: player.baseStats.spd
        },
        unlocks: {
            upgrades: {

            }
        }
    }



    const save = function() {
        console.log(saveFile)
        saveFile = {
            currencies: {
                soul: player.currencies.soul as Decimal,
            },
            name: player.name,
            baseStats: {
                attack: player.baseStats.attack,
                defense: player.baseStats.defense,
                maxHealth: player.baseStats.maxHealth,
                currentHealth: player.baseStats.currentHealth,
                spd: player.baseStats.spd
            },
            unlocks: {
                upgrades: {
    
                }
            }
        }
        localStorage.setItem('kitsune_save', JSON.stringify(saveFile));
        console.log(saveFile)
    }

    const load = function() {
        saveFile = JSON.parse(localStorage.getItem('kitsune_save') ?? "")
        player.currencies.soul = new Decimal(saveFile.currencies.soul);
        console.log(saveFile)
    }


    return { save, load }
})