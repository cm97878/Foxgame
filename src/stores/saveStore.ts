import { defineStore, storeToRefs } from "pinia";
import { usePlayer } from "./player";
import { useUpgradeStore } from "./upgradeStore";
import Decimal from "break_infinity.js";
import { ref } from "vue";
import type { SaveUpgradeArray, SaveKillsArray, SavedGameFlags } from "@/types/saveArrays";
import { useMapStore } from "./mapStore";
import { useGameFlags } from "./gameFlags";
import type { FlagEnum } from "@/enums/flagEnum";
import { useVueFlow } from "@vue-flow/core";
import { watchOnce } from "@vueuse/core";

export const useSaveStore = defineStore('saveStore', () =>{
    const player = usePlayer();
    const upgrades = useUpgradeStore();
    const mapStore = useMapStore();
    const gameFlags = useGameFlags();
    const { nodes } = useVueFlow({ id:"map"});

    var saveFile = {
        //TODO: gamestage stuff
        gameStage: player.gameStage,
        furthestStage: player.furthestStage,
        firstMove: player.firstMove,
        deniedSoul: player.deniedSoul,


        currencies: {
            soul: player.currencies.soul,
            maxSoul: player.currencies.maxSoul,
        },
        name: player.name,
        tails: player.tails,
        playerStats: {
            attack: player.playerStats.attack,
            defense: player.playerStats.defense,
            maxHealth: player.playerStats.maxHealth,
            currentHealth: player.playerStats.currentHealth,
            spd: player.playerStats.spd
        },
        unlocks: {
            playerUpgrades: [] as Array<SaveUpgradeArray>,
            soulUpgrades: [] as Array<SaveUpgradeArray>
        },
        kills: [] as Array<SaveKillsArray>,
        totalKills: mapStore.totalKills,
        gameFlags: [] as Array<SavedGameFlags>,
        location: mapStore.selectedNode?.id,
        version: 1
    }


    //TODO: Probably wanna make it so you cant save in combat. Would kinda allow for some cheese otherwise
    const save = function() {
        console.log(saveFile)
        saveFile = {
            //TODO: gamestage stuff
            gameStage: player.gameStage,
            furthestStage: player.furthestStage,
            firstMove: player.firstMove,
            deniedSoul: player.deniedSoul,

            currencies: {
                soul: player.currencies.soul,
                maxSoul: player.currencies.maxSoul,
            },
            name: player.name,
            tails: player.tails,
            playerStats: {
                attack: player.playerStats.attack,
                defense: player.playerStats.defense,
                maxHealth: player.playerStats.maxHealth,
                currentHealth: player.playerStats.currentHealth,
                spd: player.playerStats.spd
            },
            unlocks: {
                playerUpgrades: [] as Array<SaveUpgradeArray>,
                soulUpgrades: [] as Array<SaveUpgradeArray>
            },
            kills: [] as Array<SaveKillsArray>,
            totalKills: mapStore.totalKills,
            gameFlags: [] as Array<SavedGameFlags>,
            location: mapStore.selectedNode.id,
            //Set a version for dealing with breaking changes to saves.
            version: 1
        }
        //TODO: this only saves upgrades in the home category
        saveFile.unlocks.playerUpgrades = Array.from(upgrades.home.entries()).map((entry) => {
            return {
                key: entry[0],
                unlocked: entry[1].show,
                bought: entry[1].bought,
            } as SaveUpgradeArray
        })
        saveFile.unlocks.soulUpgrades = Array.from(upgrades.soul.entries()).map((entry) => {
            return {
                key: entry[0],
                unlocked: entry[1].show,
                bought: entry[1].bought,
                level: entry[1].level || 1,
            } as SaveUpgradeArray
        })
        saveFile.kills = Array.from(nodes.value).map((entry) => {
            return {
                key: entry.id,
                kills: entry.data.killCount
            } as SaveKillsArray
        })
        saveFile.gameFlags = Array.from(gameFlags.flagList).map((entry) => {
            return {
                key: entry[0],
                state: entry[1]
            } as SavedGameFlags
        })
        localStorage.setItem('kitsune_save', JSON.stringify(saveFile));
        console.log(saveFile)
    }

    const load = function(refresh?:boolean) {
        if(refresh) {
            location.reload();
            return false;
        }

        saveFile = JSON.parse(localStorage.getItem('kitsune_save'))
        
        const { mapLoaded } = storeToRefs(mapStore)
        if(!saveFile || localStorage.getItem('kitsune_save_bool') === "0") {
            console.log("no save found")
            watchOnce(mapLoaded, () => {
                console.log("map loaded");
                mapStore.moveToId("Home");
            })
            player.loaded = true;
            return false;
        }

        //TODO: gamestage stuff
        player.gameStage = saveFile.gameStage;
        player.furthestStage = saveFile.furthestStage;
        player.firstMove = saveFile.firstMove;
        player.deniedSoul = saveFile.deniedSoul;

        player.currencies.soul = new Decimal(saveFile.currencies.soul);
        player.currencies.maxSoul = new Decimal(saveFile.currencies.maxSoul);
        player.name = saveFile.name;
        player.tails = saveFile.tails;
        player.playerStats = {
            attack: new Decimal(saveFile.playerStats.attack),
            defense: new Decimal(saveFile.playerStats.defense),
            maxHealth: new Decimal(saveFile.playerStats.maxHealth),
            currentHealth: new Decimal(saveFile.playerStats.currentHealth),
            spd: saveFile.playerStats.spd
        };
        saveFile.unlocks.playerUpgrades.forEach(function(item) {
            let temp = upgrades.home.get(item.key);
            if(temp) {
                temp.show = item.unlocked;
                temp.bought = item.bought;
                upgrades.home.set(item.key, temp);
            }
        })
        saveFile.unlocks.soulUpgrades.forEach(function(item) {
            let temp = upgrades.soul.get(item.key);
            if(temp) {
                temp.show = item.unlocked;
                temp.bought = item.bought;
                temp.level = item.level || 1;
                upgrades.soul.set(item.key, temp);
            }
        })
        saveFile.kills.forEach(function(item) {
            let temp2 = nodes.value.find((element) => element.id === item.key)
            if(temp2) {
                temp2.data.killCount = item.kills;
            }
        })
        mapStore.totalKills = saveFile.totalKills || 0;
        const gameFlagsMap = new Map<FlagEnum, boolean>([])
        saveFile.gameFlags.forEach(function(item) {
            gameFlagsMap.set(item.key, item.state)
        })
        gameFlags.flagList = gameFlagsMap
        mapStore.scouted$ = "$REFRESH$"
        watchOnce(mapLoaded, () => {
            console.log("map loaded");
            mapStore.moveToId(saveFile.location);
        })
        console.log(saveFile)
        
        player.loaded = true;
        console.log("save file loaded");
        return true;
    }


    return { save, load }
})
