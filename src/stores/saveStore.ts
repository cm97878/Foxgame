import { defineStore } from "pinia";
import { usePlayer } from "./player";
import { useUpgradeStore } from "./upgradeStore";
import Decimal from "break_infinity.js";
import { ref } from "vue";

export const useSaveStore = defineStore('saveStore', () =>{
    const player = usePlayer();
    const upgrades = useUpgradeStore();

    const saveFile = ref({
        currencies: {
            soul: player.currencies.soul,
        },
        name: "Fox",
        baseStats: {
            attack: new Decimal("3"),
            defense: new Decimal("0"),
            maxHealth: new Decimal("15"),
            currentHealth: new Decimal("15"),
            spd: 200
        },
        unlocks: {
            upgrades: {
                
            }
        }
    })



    const save = function() {
        // localStorage.setItem('kitsune_save', saveFile)
    }

    const load = function() {

    }


    return { save, load }
})