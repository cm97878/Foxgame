import { defineStore } from 'pinia'
import { usePlayer } from './player'
import { type Upgrade, UpgradeCategory } from '@/types/upgrade'
import { ResourceEnum } from '@/types/resources';

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
        //TODO @Mak: set the show here to false and programmatically turn it on once you've got the events set up.
       soul: new Map<number, Upgrade>([
            [1, {
                show: true,
                bought: false,
                category: UpgradeCategory.SOUL,
                title: "Soul ATK",
                flavor: "TBD.",
                effectDescription: "+1 attack. Can be bought multiple times.",
                get costDescription() {
                    return Math.pow(1.7, this.level || 1).toFixed(2) + " Soul."
                },
                costFunc: (buyCheck: boolean, level?: number) => {
                    const player = usePlayer();
                    if(!level) { return false; }
                    const cost = parseFloat(Math.pow(1.7, level).toPrecision(1))
                    const canBuy = player.enoughSoul(cost)
  
                    if(buyCheck) {
                        return canBuy
                    } else if(!canBuy) {
                        return false
                    } else {
                        player.subtractSoul(cost);
                        return true;
                    }

                },
                effect: function() {
                    const player = usePlayer();
                    player.addBaseAtk(1);
                },
                repeatable: true,
                level: 1
            }],
            [2, {
                show: true,
                bought: false,
                category: UpgradeCategory.SOUL,
                title: "Soul DEF",
                flavor: "TBD.",
                effectDescription: "+1 defense. Can be bought multiple times.",
                get costDescription() {
                    return Math.pow(1.7, this.level || 1).toFixed(2) + " Soul."
                },
                costFunc: (buyCheck: boolean, level?: number) => {
                    const player = usePlayer();
                    if(!level) { return false; }
                    const cost = parseFloat(Math.pow(1.7, level).toPrecision(1))
                    const canBuy = player.enoughSoul(cost)
  
                    if(buyCheck) {
                        return canBuy
                    } else if(!canBuy) {
                        return false
                    } else {
                        player.subtractSoul(cost);
                        return true;
                    }
                },
                effect: function() {
                    const player = usePlayer();
                    player.addBaseDef(1);
                },
                repeatable: true,
                level: 1
            }],
            [3, {
                show: true,
                bought: false,
                category: UpgradeCategory.SOUL,
                title: "Soul HP",
                flavor: "TBD.",
                effectDescription: "+5 HP. Can be bought multiple times.",
                get costDescription() {
                    return Math.pow(1.5, this.level|| 1).toFixed(2) + " Soul."
                },
                costFunc: (buyCheck: boolean, level?: number) => {
                    const player = usePlayer();
                    if(!level) { return false; }
                    const cost = parseFloat(Math.pow(1.5, level).toPrecision(1))
                    const canBuy = player.enoughSoul(cost)
  
                    if(buyCheck) {
                        return canBuy
                    } else if(!canBuy) {
                        return false
                    } else {
                        player.subtractSoul(cost);
                        return true;
                    }
                },
                effect: function() {
                    const player = usePlayer();
                    player.addBaseHealth(5);
                },
                repeatable: true,
                level: 1
            }]

        ]),
        
        home: new Map<number, Upgrade>([
            [1,{
                show: true,
                bought: false,
                category: UpgradeCategory.HOME,
                title: "Honed Instinct",
                flavor: "You are becoming more familiar with the terrain, more sure of foot.",
                effectDescription: "+1 defense.",
                costDescription: "Requires 3 areas scouted.",
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
                costDescription: "Requires 10 enemies killed.",
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
                costDescription: "Requires 6 areas scouted.",
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
                effectDescription: "+0.5 HP/sec, +0.2 Energy/sec.",
                costDescription: "Costs 5 Fiber and 5 Stone.",
                costFunc: (buyCheck: boolean) => {
                    const player = usePlayer();
                    const canBuy = player.checkResourceCost(5, ResourceEnum.FIBER) && player.checkResourceCost(5, ResourceEnum.STONE)

                    if(buyCheck) {
                        return canBuy
                    } else if(!canBuy) {
                        return false
                    } else {
                        player.payResource(5, ResourceEnum.FIBER)
                        player.payResource(5, ResourceEnum.STONE)
                        return true
                    }
                },
                effect: function() {
                    const player = usePlayer();
                    player.addHPRegen(0.5);
                    player.addEnergyRegen(0.2);
                }

            }],
            [5,{
                show: false,
                bought: false,
                category: UpgradeCategory.HOME,
                title: "Makeshift Rope",
                flavor: "Find a long enough vine to wrap around the strange statue so you can drag it home.",
                effectDescription: "Take this back to the Strange Clearing.",
                costDescription: "Costs 5 Fiber.",
                costFunc: (buyCheck: boolean) => {
                    const player = usePlayer();

                    if(!buyCheck) {
                        return player.payResource(5, ResourceEnum.FIBER)
                    } else {
                        return player.checkResourceCost(5, ResourceEnum.FIBER);
                    }
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
