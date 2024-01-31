export interface Upgrade {
  show: boolean;
  bought: boolean;
  category: UpgradeCategory;
  title: string;
  flavor: string;
  effectDescription: string;
  costDescription: string;
  costFunc(buyCheck: boolean, level?: number): boolean;
  effect: Function;
  repeatable?: boolean;
  level?: number; //how many times the upgrade has been bought?
}

export enum UpgradeCategory {
  SOUL="soul",
  HOME="home"
}