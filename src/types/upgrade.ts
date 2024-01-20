import Decimal from "break_infinity.js";

//TODO: Possible add a zone field here later.
export interface Upgrade {
  show: boolean;
  bought: boolean;
  category: UpgradeCategory;
  cost_type: UpgradePurchaseType; //currency used to purchase upgrade
  title: string;
  flavor: string;
  effectDescription: string;
  cost: Decimal|number;
  effect: Function;
}

export enum UpgradePurchaseType {
  SOUL="soul",
  AREAS_SCOUTED="areas_scouted",
  AREAS_MASTERED="areas_mastered",
  ENEMIES_KILLED="enemies_killed"
}

export enum UpgradeCategory {
  SOUL="soul",
  SHRINE="shrine"
}