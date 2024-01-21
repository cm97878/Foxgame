import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import { usePlayer } from './player'
import { type Upgrade, UpgradeCategory } from '@/types/upgrade'

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
            }],
            [2,{
                show: true,
                bought: false,
                category: UpgradeCategory.SOUL,
                title: "Sharpen Claws",
                flavor: "Sharpen your claws to a fine point.",
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
                category: UpgradeCategory.SOUL,
                title: "Novice Explorer",
                flavor: "You have grown stronger from your explorations of the immediate area.",
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
            [4,{
                show: true,
                bought: false,
                category: UpgradeCategory.SHRINE,
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
        ])

    }),
})
