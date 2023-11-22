import { defineStore } from 'pinia'
import Decimal from 'break_infinity.js'
import type { Enemy } from '@/types/enemy'

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
            },
            {
                id: '2',
                label: 'Node 2',
                position: { x: 100, y: 100 },
                class: 'light',
            },
            {
                id: '3',
                label: 'Node 3',
                position: { x: 400, y: 100 },
                class: 'light',
            },
            {
                id: '4',
                label: 'Node 4',
                position: { x: 400, y: 200 },
                class: 'light',
            },
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
        ]
        
    })
})