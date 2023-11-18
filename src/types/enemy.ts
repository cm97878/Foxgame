import Decimal from "break_infinity.js";

export interface Enemy {
    name: string;
    attack: Decimal;
    defense: Decimal;
    hp: Decimal;
    soulAbsorb: Decimal;
    soulKill: Decimal;
  }