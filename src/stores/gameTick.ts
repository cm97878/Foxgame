import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameTick = defineStore('gameTick', () => {
    let timerId = 0;
    const tick$ = ref(1);

    function startGameTick() {
        //Tick on every second.
        console.log('Game tick on!')
        timerId = setInterval(() => tick$.value = (tick$.value === 1 ? 2 : 1), 1000 )
    }

    function stopGameTick() {
        clearInterval(timerId)
    }

    return { tick$, startGameTick, stopGameTick }
})