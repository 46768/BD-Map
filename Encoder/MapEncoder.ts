const fs = require('fs')
const path = require('path')

export interface FloorData {
    [Surface: string]: {x: number, y: number, sx: number, sy: number, negate: boolean}
}

export default function EncodeMapData(FilePath: string, Data: FloorData) {
    //First 32 Character Define Floor Size In Int8, Concat Together To Decode The Length
    //SX(8)|SY(8)|SZX(8)|SZY(8)|
    //32 Character After The First 16 Contains The Surface Count
    //Every 32 Character After The First 64 Define The Surface Data
    //Every 8 Sets Of Surface Data Can Be Linked To A Character To Differ From
    //Negated Surface (0) Or Walkale Surface (1)
    const DataKey: string[] = Object.keys(Data)

    let Dat = Buffer.alloc(64 + (DataKey.length << 5) + Math.ceil(DataKey.length / 4))

    let SizeX: number = 0
    let SizeY: number = 0

    let SmallestX = 0
    let SmallestY = 0
    let LargestXX = 0
    let LargestYX = 0

    Object.values(Data).forEach((SurfaceData, Idx) => {
        Dat.writeInt8(SurfaceData.x, 64+(Idx*32))
        Dat.writeInt8(SurfaceData.y, 68+(Idx*32))
        Dat.writeInt8(SurfaceData.sx, 72+(Idx*32))
        Dat.writeInt8(SurfaceData.sy, 80+(Idx*32))
        if (SurfaceData.negate) return
        SmallestX = Math.min(SmallestX, SurfaceData.x)
        SmallestY = Math.min(SmallestY, SurfaceData.y)
        LargestXX = Math.max(LargestXX, SurfaceData.x + SurfaceData.sx)
        LargestYX = Math.max(LargestYX, SurfaceData.y + SurfaceData.sy)
    })

    SizeX = LargestXX - SmallestX
    SizeY = LargestYX - SmallestY

    Dat.writeInt8(SmallestX, 0)
    Dat.writeInt8(SmallestY, 7)
    Dat.writeInt8(SizeX, 15)
    Dat.writeInt8(SizeY, 23)
    Dat.writeUInt32BE(DataKey.length, 31)

    Dat.writeInt8(1, 1)

    const FileStream = fs.createWriteStream(FilePath)
    FileStream.write(Dat)
    FileStream.close()
}

const TestData: FloorData = {
    "Test": {x: 0, y: 0, sx: 10, sy: 10, negate:false},
    "Test2": {x: 10, y: 0, sx: 10, sy: 10, negate:false},
    "Test3": {x: 0, y: 10, sx: 10, sy: 10, negate:false},
    "Test4": {x: 10, y: 10, sx: 10, sy: 10, negate:false},
    "TestNegate": { x: 5, y: 5, sx: 5, sy: 5, negate: true},
}

EncodeMapData(path.join(__dirname, "test"), TestData)

fs.readFile(path.join(__dirname, "test"), (err: any, dat: any[]) => {
    dat.forEach((val) => {
        console.log(val)
    })
})