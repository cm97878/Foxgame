import { FlagEnum } from "@/enums/flagEnum"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useGameFlags = defineStore('gameFlags', () => {
  
	// --- State ---
    const flagList = ref<Map<FlagEnum, boolean>>(new Map<FlagEnum, boolean>([]))

	//Actions
    function setFlag(x: number, newState:boolean): void { 
        flagList.value.set(x, newState)
    }

	return {
		flagList, setFlag, 
	}
})