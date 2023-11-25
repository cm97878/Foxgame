import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Enemy } from '@/types/enemy'
import type { GraphNode } from '@vue-flow/core'
import type { AreaData } from '@/types/areaData'
import { SpecialAreaId, Zone } from '@/enums/areaEnums'

export const useMapStore = defineStore('mapStuff', {
    state: () => ({
        encounterSignal$: {} as Enemy,
        selectedNode: {data: {}} as GraphNode,
        enemyList: [
            {
                name: "Rat",
                attack: new Decimal("2"),
                defense: new Decimal("0"),
                hp: new Decimal("7"),
                spd: 300,
                soulAbsorb: new Decimal("1"),
                soulKill: new Decimal("1"),
            },
            {
                name: "Dog",
                attack: new Decimal("3"),
                defense: new Decimal("1"),
                hp: new Decimal("10"),
                spd: 300,
                soulAbsorb: new Decimal("1"),
                soulKill: new Decimal("1"),
            },
            {
                name: "Mouse",
                attack: new Decimal("1"),
                defense: new Decimal("0"),
                hp: new Decimal("5"),
                spd: 100,
                soulAbsorb: new Decimal("1"),
                soulKill: new Decimal("1"),
            }
        ] as Array<Enemy>,

        elements: [
            {
                id: '1',
                type: 'input',
                label: 'Home',
                position: { x: 0, y: 0 },
                class: 'light',
                data: {
                    areaSpecialID: SpecialAreaId.HOME, //Absence of this is a regular area.
                    areaName: "Home",
                    zone: Zone.FOREST,
                    description: "You can just put whatever here.",
                } as AreaData
            },
            {
                id: '2',
                label: '',
                position: { x: 100, y: 100 },
                class: 'light',
                data: {
                    areaName: "Dense Foliage",
                    zone: Zone.FOREST,
                    description: "this be some dense foliage"
                } as AreaData
            },
            {
                id: '3',
                label: '',
                position: { x: 400, y: 100 },
                class: 'light',
                data: {
                    areaName: "Small Clearing",
                    zone: Zone.FOREST,
                    description: "A specific clearing description."
                } as AreaData
            },
            {
                id: '4',
                label: '???',
                position: { x: 400, y: 200 },
                class: 'light',
                hidden: false,
            },
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
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
        isSpecial(): Boolean {
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
        hasData(): Boolean {
            return Object.keys(this.selectedNode.data).length !== 0
        },
    },
    actions: {
        setTextAppend() {
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
        callRandomEncounter(zone: Zone) {
            switch(zone) {
                case Zone.FOREST: {
                    const encounterIdx = Math.floor(Math.random() * this.enemyList.length );
                    this.encounterSignal$ = this.enemyList[encounterIdx];
                }
            }
        }
    }
})