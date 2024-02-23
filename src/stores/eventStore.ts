import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Cutscene } from "@/types/cutscene";
import { useMapStore } from "./mapStore";
import { usePlayer } from "./player";
import { GameStage } from "@/enums/gameStage";
import { useGameFlags } from "./gameFlags";
import { FlagEnum } from "@/enums/flagEnum";

export const useEventStore = defineStore('eventstore', () => {
    const mapStore = useMapStore();
    const player = usePlayer();
    const gameFlags = useGameFlags();

    const activeScene = ref<Cutscene>();
    const sceneDesc = ref("");
    const soulDenyCounter = ref(0);

    //TODO: Put these in a json file so we can edit/add easier
    const cutscenes = new Map<string, Cutscene>([

        //On game start
        ["intro", {
            description: "A pang of hunger wakes you from a restless sleep on the rough stone floor of the cave you've found yourself in. Driven from your territory and in search of a new home, a terrible storm drove you to seek shelter in a dark, damp cave. From the rushing sound echoing in from the narrow entrance, the storm continues to rage outside, but you can't ignore your hunger any longer. It's time to go hunt.<br /> <br />You are a fox in a dark, storming forest.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
        }],

        //First time the player moves to another node
        //TODO: This feels clunky and should be polished a bit when we start - I'm thinking perhaps we'll want to slide the player to the next node and fade this in, a bit slower, to make it feel less "close cutscene, click ope bam another one in my face".
        ["firstMove", {
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

        //Intro cutscene for obtaining Soul
        ["soulGet1", {
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
            description: "<i><b>I</b></i> am more than I once was.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                player.gameStage = GameStage.PRE_TAILS;
                player.addFood(player.getFood.times(-1)); //Food aint stored here, it becomes an actual resource again later but not yet baybee
                activeScene.value = undefined;
            },
            chain: true,
        }],

        //Finding the statue
        ["statueFind", {
            description: "You slip through a thick fern into a modest clearing, warm and brightly lit by the mid-day sun. And freeze, as you feel your fur stand on end. Not in fear, no, but you feel something deeply strange about this place. In that same way you can now feel that energy you've come to call Soul flowing in yourself and in others, you feel a similar sensation from the very air here. It is... intense, akin to a toothache the way it digs into your skull.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                callCutscene(cutscenes.get("statueFind2"))
            },
            chain: true,
        }],
        ["statueFind2", {
            description: "Your attention is drawn to a rock, half covered in moss and partially sunken into the soft earth. The sunlight illuminates it in a way that you find unnatural, and yet familiar.<br /><br />\"I would take that with you, little fox.\"",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                callCutscene(cutscenes.get("statueFind3"))
            },
            chain: true,
        }],
        ["statueFind3", {
            description: "A strange voice, almost in your ear. You whip around with a snarl, face to face with... nothing. Not even a scent lingers, although you swear for that briefest of moments you could smell something strange... water? There's nothing else now, save for the buzzing in the air.<br /><br />Your eyes return to the odd stone in the ground. It seems shaped, and with intent. And that strange sensation... well. It's not like you could lug it back even if you wanted, it's far too big to grab with your teeth. If you wound some vines around it, though...<br /><br />[You have unlocked a new upgrade back at the cave.]",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                activeScene.value = undefined;
            },
            chain: true,
        }],

        //Obtaining the statue
        ["statueGet", {
            description: "You trot back into the clearing, a bundle of vines carried in your mouth, twisted together and clumsily tied with the brambles near your cave. Terrible craftsmanship - and a little blood-speckled - but more than enough to tie around the odd rock. After a great heave, and a moment where you worry the rope will snap, the rock breaks free of the soil and slides along behind you. Not as heavy as you expected. Now for the journey home. It's relatively flat, but... you've a feeling that this will not be an enjoyable trek.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                callCutscene(cutscenes.get("statueGet2"))
                mapStore.moveToId("Home") 
            },
            chain: true
        }],
        ["statueGet2", {
            description: "And you were spot-on. Damnable thing got caught on every rock, stump, branch, and bush it could find. But it's back with you now, and you were (barely) able to roll it through the crevice. You can get a better look at it, now.<br /><br />It's a statue of some sort. The details have been worn away by time, but even from the details that remain, it looks like it must have been quite the work of art long ago. And not just because the shape reminds you, even if only faintly, of a fox like yourself.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                gameFlags.setFlag(FlagEnum.SHRINE_UNLOCKED, true)
                activeScene.value = undefined;
            },
            chain: true
        }],


        //Meditate at the statue
        //TODO: Not liking how these sound, I need to re-pass them later. good enough for a rough draft but they feel clunky and too wordy - may be able to condense this into 2 panels instead of 3 as well.
        ["statueMeditate", {
            description: "You sit down in front of it and, after a tilt of the head, close your eyes. Immediately, jarringly, the sounds around you seem to fade away into the background. The buzzing of insects outside, the chirps of nearby birds, all dull to nothing more than a distant drone. And yet, as your senses dull, another opens to you as you gradually come to experience the world around you in a whole new way. The walls of your cave feel muffling, like trying to hear with your head buried in sand, but beyond that you can feel the presence of creatures beyond. Some few clusters of light are outside, one up in the branches of a tree you barely recognize as such, and another, smaller, quickly darting along beneath.",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                callCutscene(cutscenes.get("statueMeditate2"))
            },
            chain: true
        }],
        ["statueMeditate2", {
            description: "Suddenly, you sense the higher light drop, colliding with the glow below it, and the latter snuffs out into wisps. And just as suddenly, you know what you are 'seeing'. That energy you've come to call soul, within those creatures outside. A bird, or a cat, or some other nimble creature leaping onto prey from above! And if you can see those auras even muffled as they are..",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                callCutscene(cutscenes.get("statueMeditate3"))
            },
            chain: true
        }],
        ["statueMeditate3", {
            description: "You turn your newfound sense inward. Rather than a formless blob, you can 'see' this soul flowing through your body like blood through your veins. Not only that, but you also feel a sense of <i>control</i>. Right now, this power you have is swirling around inside of you, but it does not appear to be doing much of anything at all. And you now know you have the ability to change that, with a bit of effort.<br /><br />[New upgrades unlocked!]",
            choices: [
                {
                    id: 1,
                    label: "Continue"
                }
            ],
            cutsceneCallback: function() {
                gameFlags.setFlag(FlagEnum.STATUE_INSPECTED, true);
                activeScene.value = undefined;
            },
            chain: true
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
        () => mapStore.totalKills,
        (kills) => {
            if(player.gameStage === GameStage.INTRO && kills === 2) {
                callCutscene(cutscenes.get("soulGet1"))
            }
        }
    )
    watch(
        () => mapStore.totalScouted,
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