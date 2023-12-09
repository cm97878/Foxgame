import type { EventChoice } from "./areaEvent";

export interface Cutscene {
    title: string;
    description: string;
    image?: string;
    choices: EventChoice[];
    cutsceneCallback(choice: number): void;
}