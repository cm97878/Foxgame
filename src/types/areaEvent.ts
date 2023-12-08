import type { Zone } from "@/enums/areaEnums";

export interface AreaEvent {
    id: string,
    zone: Zone,
    eventText: string,
    choices: EventChoice[]
    //Can call cutscenes out of here for greater flexibility.
    eventCallback(choice: number): void,
}

export interface EventChoice {
    id: number,
    label: string
}