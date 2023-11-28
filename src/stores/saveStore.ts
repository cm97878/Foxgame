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
            maxSoul: player.currencies.maxSoul,
        },
        name: player.name,
        tails: player.tails,
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
                soul: player.currencies.soul,
                maxSoul: player.currencies.maxSoul,
            },
            name: player.name,
            tails: player.tails,
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
        saveFile.unlocks.playerUpgrades = Array.from(upgrades.soul.entries()).map((entry) => {
            return {
                key: entry[0],
                unlocked: entry[1].show,
                bought: entry[1].bought,
            } as SaveUpgradeArray
        })
        localStorage.setItem('kitsune_save', JSON.stringify(saveFile));
        console.log(saveFile)
    }

    const load = function() {
        saveFile = JSON.parse(localStorage.getItem('kitsune_save') ?? "")
        player.currencies.soul = new Decimal(saveFile.currencies.soul);
        player.currencies.maxSoul = new Decimal(saveFile.currencies.maxSoul);
        player.name = saveFile.name;
        player.tails = saveFile.tails;
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
