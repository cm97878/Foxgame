import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Enemy } from '@/types/enemy'
import { useVueFlow, type GraphNode } from '@vue-flow/core'
import type { AreaData } from '@/types/areaData'
import { SpecialAreaId, Zone } from '@/enums/areaEnums'
import { useCombatStore } from '@/stores/combatStore';

/* LEAVE THIS HERE >:(
name: "",
attack: new Decimal(""),
defense: new Decimal(""),
maxHP: new Decimal(""),
spd: ,
soulAbsorb: new Decimal(""),
soulKill: new Decimal(""),
*/


export const useMapStore = defineStore('mapStuff', {
    state: () => ({
        scouted$: "",
        selectedNode: {data: {}} as GraphNode,
        enemyList: [
            {
                name: "Rat",
                attack: new Decimal("2"),
                defense: new Decimal("0"),
                maxHP: new Decimal("7"),
                spd: 300,
                soulAbsorb: new Decimal("1"),
                soulKill: new Decimal("1"),
            },
            {
                name: "Dog",
                attack: new Decimal("3"),
                defense: new Decimal("1"),
                maxHP: new Decimal("10"),
                spd: 300,
                soulAbsorb: new Decimal("1"),
                soulKill: new Decimal("1"),
            },
            {
                name: "Mouse",
                attack: new Decimal("1"),
                defense: new Decimal("0"),
                maxHP: new Decimal("5"),
                spd: 100,
                soulAbsorb: new Decimal("1"),
                soulKill: new Decimal("1"),
            }
        ] as Array<Enemy>,

        nodes: [
            {
                id: '1',
                type: 'custom',
                label: 'Home',
                position: { x: 0, y: 0 },
                class: 'light',
                data: {
                    areaSpecialID: SpecialAreaId.HOME, //Absence of this is a regular area.
                    areaName: "Home",
                    zone: Zone.FOREST,
                    description: "You can just put whatever here.",
                    killCount: 0,
                    scoutThreshold: 0
                } as AreaData
            },
            {
                id: '2',
                label: '',
                position: { x: -80, y: 260 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Cliffside",
                    zone: Zone.FOREST,
                    description: "The brush here gives way to rocky soil a few feet from the rough cliff. The sharp stones dig into your paws.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '3',
                label: '',
                position: { x: 450, y: -10 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Cliffside",
                    zone: Zone.FOREST,
                    description: "A narrow path follows the cliffside, between the dense brush and rocky wall. The tendrils of a thicket of brambles further along snake along the side of the path.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '4',
                label: '',
                position: { x: 680, y: 300 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Brambles",
                    zone: Zone.FOREST,
                    description: "A mass of dense brambles lie to the north. You're agile, but not that agile - you would be shredded if you tried to pass through. A well-trod path winds south along the edge.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '5',
                label: '',
                position: { x: 695, y: 520 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Underbrush",
                    zone: Zone.FOREST,
                    description: "Sparse underbrush covers the ground here, right up to the brambles to the east. A trail from the north fades away here, but the brush is thin enough to pass through with ease.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '6',
                label: '',
                position: { x: -10, y: 580 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Boulder",
                    zone: Zone.FOREST,
                    description: "A chunk of the cliffside has fallen here, a rockslide that brought a massive boulder to rest. Old trees, knocked down by the shifting earth, have created a rather unpleasant barrier - some thorny plant has overtaken this area. Over the boulder, not around it.", //TODO: We may want to add 'blockers', that prevent traversal past? This could be one, needs xyz upgrade to have the agility to leap up and over
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '7',
                label: '',
                position: { x: 60, y: 900 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Cliffside",
                    zone: Zone.FOREST,
                    description: "The cliff face continues to the north, and veers to the left as it heads south. A small natural path entices you back into the forest.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '8',
                label: '',
                position: { x: 530, y: 880 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Underbrush",
                    zone: Zone.FOREST,
                    description: "Sparse underbrush covers the ground here. Through it, a natural path runs east to west, winding amongst the foliage.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '9',
                label: '',
                position: { x: 880, y: 730 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Old Oak",
                    zone: Zone.FOREST,
                    description: "The brush gives way to grass and dirt around a massive oak tree, towering above the rest. There is something different in the air about it; a history here. One from before you arrived, and one that will continue after you have left. You wonder, briefly, what secrets its high branches may hold.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '10',
                label: '',
                position: { x: 1150, y: 745 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Faded Trail (S-E)",
                    zone: Zone.FOREST,
                    description: "A natural trail from the west joins with a more defined path that runs from the south on a gentle eastward curve. This path seems to be marked with stones along the sides, and remains clearly visible despite being rather overgrown. The large thicket of brambles follows the path on the north.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '11',
                label: '',
                position: { x: 1500, y: 680 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Faded Trail (W-E)",
                    zone: Zone.FOREST,
                    description: "A stone-marked trail runs west to east, with thick brambles meandering along to its north.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '12',
                label: '',
                position: { x: -180, y: 1250 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Cliffside Clearing",
                    zone: Zone.FOREST,
                    description: "The cliff pulls away from the forest and, here, the forest does not follow, creating a rocky clearing.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '13',
                label: '',
                position: { x: 1000, y: 1100 },
                class: 'light',
                type: 'custom',
                data: {
                    //Will be special
                    areaName: "Strange Clearing",
                    zone: Zone.FOREST,
                    description: "i imagine special locations are gonna just have fully different formatting so this doesnt matter lol",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            
        ],
        //this fucking sucks to comprehend, we should change the IDs to be descriptors later
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e2-6', source: '2', target: '6' },
            { id: 'e6-7', source: '6', target: '7' },
            { id: 'e7-8', source: '7', target: '8' },
            { id: 'e8-9', source: '8', target: '9' },
            { id: 'e5-9', source: '5', target: '9' },
            { id: 'e9-10', source: '9', target: '10' },
            { id: 'e10-11', source: '10', target: '11' },
            { id: 'e10-13', source: '10', target: '13' },
            { id: '7-12', source: '7', target: '12' },
            
        ],
        areaData: {
            //holds the thing to display and the list of things that can be displayed
            random: {
                descAppend: "",
                forest: [
                    " Test addon 1",
                    " test addon 2",
                    " test addon 3"
                ]
            },
            //special doesnt do anything yet
            special: {
                Home: {

                }
            }
        }
        
    }),
    getters: {
        isSpecial(): SpecialAreaId {
            return this.selectedNode.data.areaSpecialID;
        },
        getAreaName(): string {
            return this.hasData ? this.selectedNode.data.areaName : "";
        },
        getDescription(): string {
            return this.hasData ? this.selectedNode.data.description  : "";
        },
        getDescAppend(): string {
            return this.hasData ? this.areaData.random.descAppend  : "";
        },
        getKillCount(): Decimal {
            return this.hasData ? this.selectedNode.data.killCount : "";
        },
        scouted(): Boolean {
            return (this.getKillCount.gte(this.selectedNode.data.scoutThreshold))
        },
        hasData(): Boolean {
            return !!this.selectedNode.data; 
        },
    },
    actions: {
        setTextAppend(): void {
            if(this.hasData && (Math.floor(Math.random() * 100) <= 20)) {
                switch(this.selectedNode.data.zone) {
                    case "forest": {
                        this.areaData.random.descAppend = this.areaData.random.forest[Math.floor(Math.random() * 3)]
                        break;
                    }
                    default: {
                        console.log("somethin fucky with random text switch case")
                    }
                }
            }
            else {
                this.areaData.random.descAppend = "";
            }
        },
        callRandomEncounter(zone: Zone): void {
            switch(zone) {
                case Zone.FOREST: {
                    const encounterIdx = Math.floor(Math.random() * this.enemyList.length );

                    const combatStore = useCombatStore();
                    combatStore.startCombat(this.enemyList[encounterIdx]);
                }
            }
        },

        //this just adds kills to the current node, but should be easy to expand to add elsewhere
        //if we do stuff that'd allow it later
        addKills(amnt:number) {
            if(this.hasData) {
                let node = this.nodes.find(item => item.id === this.selectedNode.id)

                if(node) {
                    node.data.killCount += amnt
                    if(node.data.killCount >= node.data.scoutThreshold) {
                        this.scouted$ = node.id;
                    }
                }
                else {console.log("Couldn't update killcount. addKills()")}
            }
        }

    }
})