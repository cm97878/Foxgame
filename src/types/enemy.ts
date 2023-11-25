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