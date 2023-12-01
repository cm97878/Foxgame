import type { SpecialAreaId, Zone } from "@/enums/areaEnums"
import type Decimal from "break_infinity.js"

export interface AreaData {
    areaSpecialID?: SpecialAreaId
    areaName: string,
    zone: Zone,
    description: string,
    killCount: Decimal,
    scoutThreshold: Decimal,
}