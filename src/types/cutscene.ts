import type { EventChoice } from "./areaEvent";

export interface Cutscene {
    description: string;
    image?: string;
    choices: EventChoice[];
    cutsceneCallback?(choice: number): void;
    textReplace?: TextReplace[];
    chain?: boolean;
}

export interface TextReplace {
    toReplace: string;
    replacement(): string,
}