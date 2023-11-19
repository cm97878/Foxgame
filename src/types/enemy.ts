import Decimal from "break_infinity.js";

export interface Enemy {
    name: string;
    attack: Decimal;
    defense: Decimal;
    hp: Decimal;
    spd: number;
    soulAbsorb: Decimal;
    soulKill: Decimal;
  }