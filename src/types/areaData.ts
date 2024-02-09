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
    topNode: string;
    right: boolean;
    rightNode: string;
    left: boolean;
    leftNode: string;
    bottom: boolean;
    bottomNode:string;
}