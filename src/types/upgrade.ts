import type { UpgradePurchaseType } from "@/enums/upgradePurchaseType";
import Decimal from "break_infinity.js";

//TODO: Possible add a zone field here later.
export interface Upgrade {
    show: boolean;
    bought: boolean;
    type: UpgradePurchaseType; //currency used to purchase upgrade
    title: string;
    description: string;
    cost: Decimal|number;
    effect: Function;
  }