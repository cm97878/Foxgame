import type { GameFlag } from "@/types/gameFlag"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useGameFlags = defineStore('gameFlags', () => {
  
	// --- State ---

	//TODO: I've wussed out on making a Map of GameFlags due to the thorny issues around making a Map reactive on it's entries
	//and not it's keys not coming to me right now. Going to just make individual gameFlag variables for now.
	//const gameFlags = ref<Map<string, GameFlag>>()
	const shrine1 = ref<GameFlag>({description: "Have you encountered the stone statue yet? ", flagOn: false})
	const shrine2 = ref<GameFlag>({description: "Have you returned the statue back home? ", flagOn: false})

	// --- Getters/Computeds ---
	const getShrine1 = computed(() => shrine1.value.flagOn)
	const getShrine2 = computed(() => shrine2.value.flagOn)

	//Actions
    function setShrine1(state: boolean): void {shrine1.value.flagOn = state}
	function setShrine2(state: boolean): void {shrine2.value.flagOn = state}


	return {
		//State
		shrine1, shrine2,
        //Computed
        getShrine1, getShrine2,
		//Actions
		setShrine1, setShrine2
	}
})