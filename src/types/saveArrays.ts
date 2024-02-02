export interface SaveUpgradeArray {
    key: number,
    unlocked: boolean,
    bought: boolean,
    level: number
}

export interface SaveKillsArray {
    key: string,
    kills: number,
}

export interface SavedGameFlags {
    key: number,
    state: boolean
}