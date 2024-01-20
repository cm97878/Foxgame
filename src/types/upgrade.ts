export interface Upgrade {
  show: boolean;
  bought: boolean;
  category: UpgradeCategory;
  title: string;
  flavor: string;
  effectDescription: string;
  costDescription: string;
  costFunc: (buyUpgrade: boolean) => boolean;
  effect: Function;
}

export enum UpgradeCategory {
  SOUL="soul",
  SHRINE="shrine"
}