import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import { usePlayer } from './player'
import { type Upgrade, UpgradePurchaseType, UpgradeCategory } from '@/types/upgrade'

export const useUpgradeStore = defineStore('upgradeStore', {
    state: () => ({
        /*
            show: true,
            bought: false,
            category: UpgradeCategory.SOUL,
            cost_type: UpgradePurchaseType.AREAS_SCOUTED,
            title: "Watchful Eye",
            flavor: "Experience gained from exploring better prepares you for incoming danger.",
            effectDescription: "+1 defense.",
            cost: new Decimal("3"),
            effect: function() {
                const player = usePlayer();
                player.addBaseDef(1);
            }
        */
       soul: new Map<number, Upgrade>([
            [1,{
                show: true,
                bought: false,
                category: UpgradeCategory.SOUL,
                cost_type: UpgradePurchaseType.AREAS_SCOUTED,
                title: "Watchful Eye",
                flavor: "Experience gained from exploring better prepares you for incoming danger.",
                effectDescription: "+1 defense.",
                cost: new Decimal("3"),
                effect: function() {
                    const player = usePlayer();
                    player.addBaseDef(1);
                }

            }],
            [2,{
                show: true,
                bought: false,
                category: UpgradeCategory.SOUL,
                cost_type: UpgradePurchaseType.ENEMIES_KILLED,
                title: "Sharpen Claws",
                flavor: "Sharpen your claws to a fine edge.",
                effectDescription: "+1 attack.",
                cost: new Decimal("10"),
                effect: function() {
                    const player = usePlayer();
                    player.addBaseAtk(1);
                }

            }]

        ]),
        //TODO: We need to make costType be able to handle multiple things.
        //Also, add this to saving functionality.
        shrine: new Map<number, Upgrade>([
            [1,{
                show: true,
                bought: false,
                category: UpgradeCategory.SHRINE,
                cost_type: UpgradePurchaseType.SOUL,
                title: "Makeshift Bed",
                flavor: "Scrounge up some sticks and soft things so you have something better to sleep on then the cold, stone floor.",
                effectDescription: "+0.5 HP/sec, +0.2 Energy/sec. True Cost is TBD",
                cost: new Decimal("10"),
                effect: function() {
                    const player = usePlayer();
                    player.addHPRegen(0.5);
                    player.addEnergyRegen(0.2);
                }

            }],
        ])


    }),
})
