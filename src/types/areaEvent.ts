import type { Zone } from "@/enums/areaEnums";

export interface AreaEvent {
    id: string,
    zone: Zone,
    eventText: string,
    choice1Label: string,
    choice2Label?: string,
    //Can call cutscenes out of here for greater flexibility.
    eventCallback(choice: number): void,
}