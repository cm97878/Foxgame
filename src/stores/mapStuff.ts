import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Enemy } from '@/types/enemy'
import type { GraphNode } from '@vue-flow/core'
import type { AreaData } from '@/types/areaData'

/* 
name: "",
attack: new Decimal("0"),
defense: new Decimal("0"),
hp: new Decimal("0"),
soulAbsorb: new Decimal("0"),
soulKill: new Decimal("0"), 
*/


export const useMapStuff = defineStore('mapStuff', {
    state: () => ({
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
                label: 'Node 1',
                position: { x: 0, y: 0 },
                class: 'light',
                data: {
                    areaSpecial: true, //Isn't needed, shows default if not true
                    areaName: "Home",
                    randomZone: "Special nodes will handle this stuff differently.",
                    description: "You can just put whatever here.",
                } as AreaData
            },
            {
                id: '2',
                label: 'Node 2',
                position: { x: 100, y: 100 },
                class: 'light',
                data: {
                    areaName: "Dense Foliage",
                    randomZone: "forest",
                    description: "this be some dense foliage"
                } as AreaData
            },
            {
                id: '3',
                label: 'Node 3',
                position: { x: 400, y: 100 },
                class: 'light',
                data: {
                    areaName: "Small Clearing",
                    randomZone: "forest",
                    description: "A specific clearing description."
                } as AreaData
            },
            {
                id: '4',
                label: 'Node 4',
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
            if(this.selectedNode.data.areaSpecial) {
                return true
            }
            else {
                return false;
            }
        },
        getAreaName(): string {
            if(this.hasData) {
                return this.selectedNode.data.areaName;            
            }
            else {
                return "No data"
            }
        },
        getDescription(): string {
            if(this.hasData) {
                return this.selectedNode.data.description;      
            }
            else {
                
                return "No data"
            }
        },
        getDescAppend(): string {
            if(this.hasData) {
                return this.areaData.random.descAppend; 
            }
            else return "no data"
        },
        hasData(): Boolean {
            if(Object.keys(this.selectedNode.data).length === 0) {
                return false;
            }
            else return true;
        },



    },
    actions: {
        setTextAppend() {
            if(this.hasData && (Math.floor(Math.random() * 100) <= 20)) {
                switch(this.selectedNode.data.randomZone) {
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
    }
})