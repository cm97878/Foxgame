
import type { DeckCard } from "@/types/deckCard";
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { usePlayer } from "./player";
import { ResourceEnum } from "@/types/resources";

export const useDecks = defineStore('decks', () => {
    const player = usePlayer();
  
	// --- State ---
    //Start with one Soul card at Level 1 in the Explore deck by default.
    //TODO: Expand this system to work with multiple decks in the future.
    //const exploreDeck = ref<number[]>([1]);
    //TODO: Hardcode deck for now:
    //TODO: Make a proper Log for deck pulls!
    const exploreDeck = ref<number[]>([1,2,2,2,2,2,3,3,3,3,3]);
    
    const deckReference = ref<Map<number, DeckCard>>(new Map<number, DeckCard>([
        [1, {
            id: 1,
            text: "You've found some latent Soul!",
            effect: function() {
                //Get 5% of maxSoul or 1 Soul, depending on which is higher.
                let changeAmount = "";
                if(player.tails === 1) {
                    player.addSoul(1)
                    changeAmount = "1"
                } else {
                    player.addSoul((player.getMaxSoul.multiply(.05)))
                    changeAmount = player.getMaxSoul.multiply(.05).toString()
                }
                //AddtoExploreLog(changeAmount)
                console.log("Got %s Soul!", changeAmount)
            }
        }],
        [2, {
            id: 2,
            text: "You've found some useful vines and strands...",
            effect: function() {
                //Linear reward for first 5 levels, then make some fractional power function for better scaling.
                const level = deckLevels.value.get(2) || 1
                //TODO: Add scaling later.
                const fiber = player.resources.get(ResourceEnum.FIBER)
                if(!!fiber) {
                    if((fiber?.amount + level) >= fiber?.max) {
                        player.resources.set(ResourceEnum.FIBER, {amount: fiber.max, max: fiber.max})
                        console.log("Maxed Fiber!")
                    } else {
                        player.resources.set(ResourceEnum.FIBER, {amount: fiber.amount + level, max: fiber.max})
                        console.log("Got %s Fiber!", level.toString())
                    }
                }
            }
        }],
        [3, {
            id: 3,
            text: "You've found some rocks and pebbles that could be useful...",
            effect: function() {
                //Linear reward for first 5 levels, then make some fractional power function for better scaling.
                const level = deckLevels.value.get(3) || 1
                //TODO: Add scaling later.
                const stone = player.resources.get(ResourceEnum.STONE)
                if(!!stone) {
                    if((stone?.amount + level) >= stone?.max) {
                        player.resources.set(ResourceEnum.STONE, {amount: stone.max, max: stone.max})
                        console.log("Maxed Stone!")
                    } else {
                        player.resources.set(ResourceEnum.STONE, {amount: stone.amount + level, max: stone.max})
                        console.log("Got %s Stone!", level.toString())
                    }
                }
            }
        }]

    ]))
    const deckLevels = ref<Map<number, number>>(new Map<number, number>([[1,1],[2,5],[3,5]]))

    //Getters/Computed
    const deckSize = computed(() => exploreDeck.value.length);

    //Actions
    function drawCard(): void {
        //Arrays start at 0
        const cardIdx = Math.floor((Math.random() * deckSize.value));
        const drawnCard = deckReference.value.get(exploreDeck.value[cardIdx])
        drawnCard?.effect()
    }

    //TODO: Code in adding cards to deck, which can be called when areas are scouted.
    //Make a helper function that adds in the cards to the deck for the first time when Level 1 of a new card type is reached.


	return {
        //State
		exploreDeck, deckReference,
        //Actions
        drawCard
	}
})