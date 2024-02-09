import type { SpecialAreaId, Zone } from "@/enums/areaEnums"

export interface AreaData {
    areaSpecialID?: SpecialAreaId;
    customFunc?: string;
    areaName: string;
    zone: Zone;
    description: string;
    killCount: number;
    scoutThreshold: number;
    interactable: false;
    handles: string[];
}

export interface HandleRef {
    top: boolean;
    right: boolean;
    left: boolean;
    bottom: boolean;
}