import type { SpecialAreaId, Zone } from "@/enums/areaEnums"

export interface AreaData {
    areaSpecialID?: SpecialAreaId
    areaName: string,
    zone: Zone,
    description: string
}