export interface FloorData {
    [Surface: string]: {x: number, y: number, sx: number, sy: number}
}

export default function EncodeMapData(FilePath: string, Data: FloorData) {
    //First 16 Character Define Floor Size In Binary/Hex, Concat Together To Decode The Length
    //Every 32 Character After The First 16 Define The Surface Data
    //Every 8 Sets Of Surface Data Can Be Linked To A Character To Differ From
    //Negated Surface (0) Or Walkale Surface (1)

    const DataKey: string[] = Object.keys(Data)
    let SizeX: number = 0
    let SizeY: number = 0

    let SmallestX = 0
    let SmallestY = 0
    let LargestXX = 0
    let LargestYX = 0

    Object.values(Data).forEach((SurfaceData) => {
        SmallestX = Math.min(SmallestX, SurfaceData.x)
        SmallestY = Math.min(SmallestY, SurfaceData.y)
        LargestXX = Math.max(LargestXX, SurfaceData.x + SurfaceData.sx)
        LargestYX = Math.max(LargestYX, SurfaceData.y + SurfaceData.sy)
    })

    SizeX = LargestXX - SmallestX
    SizeY = LargestYX - SmallestY

    
}