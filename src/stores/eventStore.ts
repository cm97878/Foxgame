import type { EventChoice } from "@/types/areaEvent";
import { defineStore } from "pinia";
import { ref, watch, watchEffect } from "vue";
import { useCombatStore } from "./combatStore";
import type { Cutscene } from "@/types/cutscene";
import { useMapStore } from "./mapStore";
import { usePlayer } from "./player";
import { GameStage } from "@/enums/gameStage";

export const useEventStore = defineStore('eventstore', () => {
    const combatStore = useCombatStore();
    const mapStore = useMapStore();
    const player = usePlayer();

    const activeScene = ref<Cutscene>();
    const sceneDesc = ref("");
    const soulDenyCounter = ref(0);

    //TODO: Put these in a json file so we can edit/add easier
    const cutscenes = new Map<string, Cutscene>([
        ["intro", {
            title: "",
            description: "A pang of hunger wakes you from a restless sleep on the rough stone floor of the cave you've found yourself in. Driven from your territory and in search of a new home, a terrible storm drove you to seek shelter in a dark, damp cave. From the rushing sound echoing in from the narrow entrance, the storm continues to rage outside, but you can't ignore your hunger any longer. It's time to go hunt.<br /> <br />You are a fox in a dark, storming forest.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
        }],
        ["firstMove", {
            title: "",
            description: "You slip out of the narrow crack in the cliff face and into the heavy rain outside, immediately undoing whatever meager drying you had accomplished inside your shelter. You head $DIRECTION$. And it's almost immediately that you find your next meal. And at the same time, it finds its next meal as well. The rat lunges.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            textReplace: [
                {
                    toReplace: "$DIRECTION$",
                    replacement: function () {
                        if(mapStore.selectedNode.id === "2") {
                            return "south, sticking close to the cliff in hopes of avoiding the worst of the downpour";
                        }
                        else {
                            return "[east, darting into the forest and under the thick canopy above, hoping to prevent the worst of the deluge";
                        }
                    },
                },
            ],
        }],
        ["soulGet1", {
            title: "",
            description: "The rain has begun to clear up as you've been hunting, and by now you've filled your stomach and gotten some to bring 'home'. You begin to make your way back to the cave with your spoils, as the sun just begins to peek out through the clouds.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function(choice) {
                callCutscene(cutscenes.get("soulGet2"))
            },
            chain: true,
        }],
        ["soulGet2", {
            title: "",
            description: "As you travel back to your den, a small squirrel darts out in front of you, stopping directly on the natural path you have been following. There's a soft glow around it, as if shrouded in the light of early dawn - but despite the rays filtering through the canopy above, neither of you are in the splotches of sunlight scattering through the underbrush.<br /><br />The squirrel stares at you, motionless.  And as you stare back, you begin to feel an urge, deep down, to strike, to rip, tear, devour.<br /><br /><i>A gift for you, one graciously given, and accepted in a way natural to you. Eat, friend.</i>", //TODO: apparently i tags suck ass now
            choices: [
                {
                    id: 1,
                    label: "Leave."
                },
                {
                    id: 2,
                    label: "Accept."
                }
            ],
            cutsceneCallback: function(choice) {
                if(choice === 1) {
                    soulDenyCounter.value++;
                    if(soulDenyCounter.value === 18) {
                        player.deniedSoul = true;
                    }
                }
                else {
                    soulDenyCounter.value = 0;
                    callCutscene(cutscenes.get("soulGet3"))
                }
            },
            chain: true
        }],
        ["soulGet3", {
            title: "",
            description: "You lunge at the rat and viciously sink your teeth into it. The moment they puncture its flesh, you feel something different, something alien, rush into you. In one brief, excruciating instant, you feel your mind expand beyond yourself, and you feel within the creature between your teeth something you've now a hunger for beyond meat. Still under the influence of your urges, you focus and... draw this something out, and into yourself.<br /><br />$DENIED$<br /><br />You stagger back, your mind becoming your own once more. And yet, not the same mind it was. You are more than you once were.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function(choice) {
                callCutscene(cutscenes.get("soulGet4"))
            },
            textReplace: [
                {
                    toReplace: "$DENIED$",
                    replacement: function () {
                        if(soulDenyCounter.value >= 18) {
                            return "As the last trickles drain into you, a final burst follows it, much more than the sum of the parts before, and you shiver.";
                        }
                        else {
                            return "As the last trickles drain into you, you manage to overpower that primal drive and drop it.";
                        }
                    },
                },
            ],
            chain: true,
        }],
        ["soulGet4", {
            title: "",
            description: "<i><b>I</b></i> am more than I once was.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function(choice) {
                player.gameStage = GameStage.PRE_TAILS;
                player.addFood(player.getFood.times(-1)); //Food aint stored here, it becomes an actual resource again later but not yet baybee
                activeScene.value = undefined;
            },
            chain: true,
        }],
    ])



    function callCutscene(cutscene: Cutscene | undefined): void {
        if(!cutscene) {
            console.log("Failed to call cutscene");
            return;
        }
        activeScene.value = cutscene;
        let desc = activeScene.value.description;
        if(!!activeScene.value.textReplace) {
            activeScene.value.textReplace.forEach((item) => {
                desc = desc.replace(item.toReplace, item.replacement);
            })
        }
        sceneDesc.value = desc;
    }

    function endCutscene(choice: number): void {
        if(!!activeScene.value?.cutsceneCallback) {
            activeScene.value.cutsceneCallback(choice);
        }
        if(!activeScene.value?.chain) {
            activeScene.value = undefined;
        }
    }

    watch(
        () => player.totalKills,
        (kills) => {
            if(player.gameStage === GameStage.INTRO && kills === 2) {
                callCutscene(cutscenes.get("soulGet1"))
            }
        }
    )
    watch(
        () => player.totalScouted,
        (scouted) => {
            if(player.gameStage === GameStage.INTRO && scouted === 5) {
                callCutscene(cutscenes.get("soulGet1"))
            }
        }
    )

    return {
        cutscenes, activeScene, sceneDesc, soulDenyCounter,

        callCutscene, endCutscene
    }
})