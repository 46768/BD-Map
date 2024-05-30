export interface FloorData {
    [Surface: string]: {x: number, y: number, sx: number, sy: number}
}

export default function EncodeMapData(FilePath: string, Data: FloorData) {
    //First 16 Character Define Floor Size In Binary/Hex, Concat Together To Decode The Length
    //Every 32 Character After The First 16 Define The Surface Data
    //Every 8 Sets Of Surface Data Can Be Linked To A Character To Differ From
    //Negated Surface (0) Or Walkale Surface (1)
}