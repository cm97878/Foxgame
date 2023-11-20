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
        ] as Array<Enemy>
        
    })
})