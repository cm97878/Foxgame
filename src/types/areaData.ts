import type { SpecialAreaId, Zone } from "@/enums/areaEnums"
import type Decimal from "break_infinity.js"

export interface AreaData {
    areaSpecialID?: SpecialAreaId
    areaName: string,
    zone: Zone,
    description: string,
    killCount: number,
    scoutThreshold: number,
    interactable: false,
    //Shouldn't have to do it this way, but it's here for now.
    nodeId: string
}