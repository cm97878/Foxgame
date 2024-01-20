import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import { usePlayer } from './player'
import { UpgradePurchaseType } from '@/enums/upgradePurchaseType'
import type { Upgrade } from '@/types/upgrade'

export const useUpgradeStore = defineStore('upgradeStore', {
    state: () => ({
        /*
            show: false,
            bought: false,
            title: "",
            type: UpgradePurchaseType.SOUL,
            description: "",
            cost: new Decimal("0"),
            effect: null,
        */
       soul: new Map<number, Upgrade>([
            [1,{
                show: true,
                bought: false,
                type: UpgradePurchaseType.AREAS_SCOUTED,
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
                type: UpgradePurchaseType.ENEMIES_KILLED,
                title: "Sharpen Claws",
                flavor: "Sharpen your claws to a fine edge.",
                effectDescription: "+1 attack.",
                cost: new Decimal("10"),
                effect: function() {
                    const player = usePlayer();
                    player.addBaseAtk(1);
                }

            }]

        ])
        // soul: new Map<number, Upgrade>([
        //     [0, {
        //         show: true,
        //         bought: false,
        //         type: UpgradePurchaseType.ENEMIES_KILLED,
        //         title: "Sharpen claws",
        //         description: "Sharpen your claws. +1 attack. req 1 enemy killed",
        //         cost: new Decimal("1"),
        //         effect: function() {
        //             const player = usePlayer();
        //             player.addBaseAtk(1);
        //         }
        //     }],
        //     [1, {
        //         show: true,
        //         bought: false,
        //         type: UpgradePurchaseType.AREAS_SCOUTED,
        //         title: "upgrade 2",
        //         description: "req 3 areas scouted",
        //         cost: new Decimal("3"),
        //         effect: function() {}
        //     }],
        //     [2, {
        //         show: true,
        //         bought: false,
        //         type: UpgradePurchaseType.SOUL,
        //         title: "upgrade 3",
        //         description: "req 4 soul",
        //         cost: new Decimal("4"),
        //         effect: function() {}
        //     }],
        //     [3, {
        //         show: false,
        //         bought: false,
        //         type: UpgradePurchaseType.SOUL,
        //         title: "upgrade 4",
        //         description: "bought, not unlocked, shouldnt see this",
        //         cost: new Decimal("0"),
        //         effect: function() {}
        //     }]
        // ])

    }),
})
