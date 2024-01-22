import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import { usePlayer } from './player'
import { type Upgrade, UpgradeCategory } from '@/types/upgrade'
import { ResourceEnum } from '@/enums/ResourceEnum'

export const useUpgradeStore = defineStore('upgradeStore', {
    state: () => ({
        /*
            show: true,
            bought: false,
            category: UpgradeCategory.SOUL,
            title: "Watchful Eye",
            flavor: "Experience gained from exploring better prepares you for incoming danger.",
            effectDescription: "+1 defense.",
            costDescription:"Requires 3 areas scouted.",
            costFunc: (buyCheck: boolean) => {
                const player = usePlayer();
                return player.enoughScouted(3);
            },
            effect: function() {
                const player = usePlayer();
                player.addBaseDef(1);
            }
        */

        //TODO: add this to saving functionality.
       soul: new Map<number, Upgrade>([

        ]),
        
        home: new Map<number, Upgrade>([
            [1,{
                show: true,
                bought: false,
                category: UpgradeCategory.HOME,
                title: "Honed Instinct",
                flavor: "You are becoming more familiar with the terrain, more sure of foot.",
                effectDescription: "+1 defense.",
                costDescription:"Requires 3 areas scouted.",
                costFunc: (buyCheck: boolean) => {
                    const player = usePlayer();
                    return player.enoughScouted(3);
                },
                effect: function() {
                    const player = usePlayer();
                    player.addBaseDef(1);
                }
            }],
            [2,{
                show: true,
                bought: false,
                category: UpgradeCategory.HOME,
                title: "Sharpen Claws",
                flavor: "You let your claws dull before. You should fix that.",
                effectDescription: "+1 attack.",
                costDescription:"Requires 10 enemies killed.",
                costFunc: (buyCheck: boolean) => {
                    const player = usePlayer();
                    return player.enoughKills(10);
                },
                effect: function() {
                    const player = usePlayer();
                    player.addBaseAtk(1);
                }

            }],
            [3,{
                show: true,
                bought: false,
                category: UpgradeCategory.HOME,
                title: "Adaptation",
                flavor: "Despite your recent travels and bouts of combat, you feel... energized. Harder to wind, harder to bleed.",
                effectDescription: "+10 HP.",
                costDescription:"Requires 6 areas scouted.",
                costFunc: (buyCheck: boolean) => {
                    const player = usePlayer();
                    return player.enoughScouted(6);
                },
                effect: function() {
                    const player = usePlayer();
                    player.addBaseHealth(10);
                }

            }],
            //TODO: will obv need to be material cost once we implement that
            [4,{
                show: true,
                bought: false,
                category: UpgradeCategory.HOME,
                title: "Makeshift Bed",
                flavor: "Scrounge up some sticks and soft things so you have something better to sleep on then the cold stone floor.",
                effectDescription: "+0.5 HP/sec, +0.2 Energy/sec. True Cost is TBD",
                costDescription:"Costs 10 Soul.",
                costFunc: (buyCheck: boolean) => {
                    const player = usePlayer();
                    const canBuy = player.enoughSoul(10);
                    if (buyCheck) {
                        return canBuy;
                    }

                    if(canBuy) {
                        player.subtractSoul(10);  
                    }
                    return canBuy;
                },
                effect: function() {
                    const player = usePlayer();
                    player.addHPRegen(0.5);
                    player.addEnergyRegen(0.2);
                }

            }],
            [4,{
                show: false,
                bought: false,
                category: UpgradeCategory.HOME,
                title: "Makeshift Rope",
                flavor: "Find a long enough vine to wrap around the strange statue so you can drag it home.",
                effectDescription: "Take this back to the Strange Clearing.",
                costDescription:"Costs 5 Fiber. (For now, costs 10 soul instead.)",
                // costFunc: (buyCheck: boolean) => {
                //     const player = usePlayer();
                //     const fiber = player.resources.get(ResourceEnum.FIBER) || 0
                //     if (fiber < 5) {
                //         return false;
                //     }

                //     if(!buyCheck) {
                //         player.resources.set(ResourceEnum.FIBER, fiber-5) 
                //     }
                //     return true;
                // },
                costFunc: (buyCheck: boolean) => {
                    const player = usePlayer();
                    const canBuy = player.enoughSoul(10);
                    if (buyCheck) {
                        return canBuy;
                    }

                    if(canBuy) {
                        player.subtractSoul(10);  
                    }
                    return canBuy;
                },
                //We can check to see if this is bought at the Clearing.
                effect: function() {}
            }],
        ])

    }),
    getters: {
        getBuyableHomeUpgrades: (state) => {
            return Array.from(state.home.entries()).filter( upgrade => upgrade[1].show === true)
        },
        getBuyableSoulUpgrades: (state) => {
            return Array.from(state.soul.entries()).filter( upgrade => upgrade[1].show === true)
        }
    }
})
