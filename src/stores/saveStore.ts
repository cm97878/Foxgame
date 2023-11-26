import { defineStore } from "pinia";
import { usePlayer } from "./player";
import { useUpgradeStore } from "./upgradeStore";
import Decimal from "break_infinity.js";
import { ref } from "vue";
import type { SaveUpgradeArray } from "@/types/saveUpgradeArray";

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
            playerUpgrades: [] as Array<SaveUpgradeArray>
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
                playerUpgrades: [] as Array<SaveUpgradeArray>
            }
        }
        upgrades.soul.forEach(function(value, key) {
            let x:SaveUpgradeArray = {
                key: key,
                unlocked: value.show,
                bought: value.bought,
            }
            saveFile.unlocks.playerUpgrades.push(x)
        })
        localStorage.setItem('kitsune_save', JSON.stringify(saveFile));
        console.log(saveFile)
    }

    const load = function() {
        saveFile = JSON.parse(localStorage.getItem('kitsune_save') ?? "")
        player.currencies.soul = new Decimal(saveFile.currencies.soul);
        player.name = saveFile.name;
        player.baseStats = {
            attack: new Decimal(saveFile.baseStats.attack),
            defense: new Decimal(saveFile.baseStats.defense),
            maxHealth: new Decimal(saveFile.baseStats.maxHealth),
            currentHealth: new Decimal(saveFile.baseStats.currentHealth),
            spd: saveFile.baseStats.spd
        };
        saveFile.unlocks.playerUpgrades.forEach(function(item) {
            let temp = upgrades.soul.get(item.key);
            if(temp) {
                temp.show = item.unlocked;
                temp.bought = item.bought;
                upgrades.soul.set(item.key, temp);
            }
        })
        console.log(saveFile)
    }


    return { save, load }
})