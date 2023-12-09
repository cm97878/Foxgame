import type { EventChoice } from "@/types/areaEvent";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useCombatStore } from "./combatStore";
import type { Cutscene } from "@/types/cutscene";

export const useEventStore = defineStore('eventstore', () => {
    const combatStore = useCombatStore();

    const activeScene = ref<Cutscene>();


    const custcenes = new Map<string, Cutscene>([
        // ["", {
        //     title: "",
        //     description: "A pang of hunger wakes you from a restless sleep on the rough stone floor of the cave you've found yourself in. Driven from your territory and in search of a new home, a terrible storm drove you to seek shelter in a dark, damp cave. From the rushing sound echoing in from the narrow entrance, the storm continues to rage outside, but you can't ignore your hunger any longer. It's time to go hunt.<br /> <br />You are a fox in a dark, storming forest.",
        //     choices: [
        //         {
        //             id: 1,
        //             label: "Continue"
        //         }
        //     ]
        // }]
        
    ])


    const cutscenes = ref({
        intro: {
            title: "",
            description: "A pang of hunger wakes you from a restless sleep on the rough stone floor of the cave you've found yourself in. Driven from your territory and in search of a new home, a terrible storm drove you to seek shelter in a dark, damp cave. From the rushing sound echoing in from the narrow entrance, the storm continues to rage outside, but you can't ignore your hunger any longer. It's time to go hunt.<br /> <br />You are a fox in a dark, storming forest.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
        } as Cutscene,
        firstMove: {
            title: "",
            description: "",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
        } as Cutscene,
    })



    function callCutscene(cutscene: Cutscene): void {
        activeScene.value = cutscene;
    }
    function endCutscene(choice: number): void {
        if(!!activeScene.value?.cutsceneCallback) {
            activeScene.value.cutsceneCallback(choice);
        }
        activeScene.value = undefined;
    }

    // function cutsceneResponse(choice: number): void {
    //     //for now, cause non eligble choice to be 2.
    //     choice === 1 ? combatStore.pushToCombatLog("You chose number 1!") : combatStore.pushToCombatLog("You chose number 2!")
    //     cutsceneActive.value = false;
    // }

    return {
        cutscenes, activeScene,

        callCutscene, endCutscene
    }
})