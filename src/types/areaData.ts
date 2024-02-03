import type { SpecialAreaId, Zone } from "@/enums/areaEnums"

export interface AreaData {
    areaSpecialID?: SpecialAreaId;
    customFunc?: Function;
    areaName: string;
    zone: Zone;
    description: string;
    killCount: number;
    scoutThreshold: number;
    interactable: false;
    handles: string[];
}