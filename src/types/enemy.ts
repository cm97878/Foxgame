import Decimal from "break_infinity.js";

//TODO: Possible add a zone field here later.
export interface Enemy {
    name: string;
    attack: Decimal;
    defense: Decimal;
    maxHP: Decimal;
    spd: number;
    soulAbsorb: Decimal;
    soulKill: Decimal;
}

export interface Skill {
    cost: number;
    obtained: boolean;
    displayName: string;
    effect: Function;
}

export enum SkillEnum {
    MEDITATION = 1,
    DEBUG_METEOR = 2
}