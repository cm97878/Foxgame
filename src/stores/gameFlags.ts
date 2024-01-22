import { FlagEnum } from "@/enums/flagEnum"
import type { GameFlag } from "@/types/gameFlag"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useGameFlags = defineStore('gameFlags', () => {
  
	// --- State ---
    const flagList = ref<Map<FlagEnum, GameFlag>>(new Map<FlagEnum, GameFlag>([]))

	//Actions
    //Returns true if operation was successsful, false otherwise.
    function setFlag(x: number, newState:boolean): boolean { 
        const mapValue = flagList.value.get(x)
        if (!!mapValue) {
            flagList.value.set(x, {description: mapValue.description, state: newState})
            return true;
        }
        return false;
    }
    //do this on a new file.
    function initializeFlags(): void {
        flagList.value = new Map<FlagEnum, GameFlag>([
            [FlagEnum.EXPLORE_UNLOCKED, {
                description: "Have you encountered the stone statue yet?",
                state:false
            }],
            [FlagEnum.STATUE_OBTAINED, {
                description: "Have you obtained the stone statue?",
                state:false
            }],
            [FlagEnum.SHRINE_UNLOCKED, {
                description: "Have you returned the statue home?",
                state:false
            }],
            [FlagEnum.SOUL_UNLOCKED, {
                description: "Have you unlocked soul through the intro?",
                state:false
            }],
        ])
    }

    // TODO function reInitFlags: can do this on load to add new flags in. Add this later.


	return {
		flagList, setFlag, initializeFlags
	}
})