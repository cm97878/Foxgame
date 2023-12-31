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
                position: { x: 100, y: 100 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Dense Foliage",
                    zone: Zone.FOREST,
                    description: "this be some dense foliage",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '3',
                label: '',
                position: { x: 400, y: 100 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Small Clearing",
                    zone: Zone.FOREST,
                    description: "A specific clearing description.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '4',
                label: '',
                position: { x: 400, y: 200 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Small Clearing",
                    zone: Zone.FOREST,
                    description: "A specific clearing description.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '5',
                label: '',
                position: { x: 400, y: 300 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Small Clearing",
                    zone: Zone.FOREST,
                    description: "A specific clearing description.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
            {
                id: '6',
                label: '',
                position: { x: 100, y: 200 },
                class: 'light',
                type: 'custom',
                data: {
                    areaName: "Small Clearing",
                    zone: Zone.FOREST,
                    description: "A specific clearing description.",
                    killCount: 0,
                    scoutThreshold: 1
                } as AreaData
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e6-5', source: '6', target: '5' },
            { id: 'e2-6', source: '2', target: '6' },
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