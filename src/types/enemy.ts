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

export interface Enemy2 {
    name: string;
    attack: Decimal;
    physDef: Decimal;
    magRes: Decimal
    maxHP: Decimal;
    spd: number;
    soulAbsorb: Decimal;
    soulKill: Decimal;
    aiType: AI_Type;
    moveList: string[];
}

export enum AI_Type {
    AGGRO = "aggro",
    DEFENSIVE = "defensive",
    BOSS = "boss"
}

export enum MoveType {
    DEBUFF = "debuff",
    ATTACK = "attack",
    DEFENSE = "defense"
}

export interface Move {
    type: MoveType;
}

export interface Debuff extends Move {

}

export interface Attack extends Move {
    baseDmg: Decimal;
    multi?: number;
    extra?: Function;
}

export interface Defense extends Move {
    
}