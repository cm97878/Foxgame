import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import { usePlayer } from './player'
import { UpgradePurchaseType } from '@/enums/upgradePurchaseType'
import type { Upgrade } from '@/types/upgrade'



/* 
name: "",
attack: new Decimal("0"),
defense: new Decimal("0"),
hp: new Decimal("0"),
soulAbsorb: new Decimal("0"),
soulKill: new Decimal("0"), 
*/

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
            [0, {
                show: true,
                bought: false,
                type: UpgradePurchaseType.SOUL,
                title: "Sharpen claws",
                description: "Sharpen your claws. +1 attack.",
                cost: new Decimal("1"),
                effect: function() {
                    const player = usePlayer();
                    player.addBaseAtk(1);
                }
            }],
            [1, {
                show: true,
                bought: false,
                type: UpgradePurchaseType.SOUL,
                title: "upgrade 2",
                description: "unbought, can afford",
                cost: new Decimal("0"),
                effect: null,
            }],
            [2, {
                show: true,
                bought: true,
                type: UpgradePurchaseType.SOUL,
                title: "upgrade 3",
                description: "bought",
                cost: new Decimal("0"),
                effect: null,
            }],
            [3, {
                show: false,
                bought: false,
                type: UpgradePurchaseType.SOUL,
                title: "upgrade 4",
                description: "bought, not unlocked, shouldnt see this",
                cost: new Decimal("0"),
                effect: null,
            }]
        ])

    }),
})
