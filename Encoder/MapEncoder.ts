const fs = require('fs')
const path = require('path')

export interface FloorData {
    [Surface: string]: {x: number, y: number, sx: number, sy: number, negate: boolean}
}

export default function EncodeMapData(FilePath: string, Data: FloorData) {
    //First 32 Bit Define Floor Size In Int8, Concat Together To Decode The Length
    //SX(8)|SY(8)|SZX(8)|SZY(8)|
    //32 Bit After The First 16 Contains The Surface Count
    //Every 32 Character After The First 64 Define The Surface Data
    //Every 8 Sets Of Surface Data Can Be Linked To A Character To Differ From
    //Negated Surface (0) Or Walkale Surface (1)
    const DataKey: string[] = Object.keys(Data)

    let Dat = Buffer.alloc(8 + (DataKey.length << 2) + Math.ceil(DataKey.length / 4))
    let NegateString = ''
    let FloorNegate = 0

    let SizeX: number = 0
    let SizeY: number = 0

    let SmallestX = 0
    let SmallestY = 0
    let LargestXX = 0
    let LargestYX = 0

    Object.values(Data).forEach((SurfaceData, Idx) => {
        Dat.writeInt8(SurfaceData.x, 8+(Idx<<2))
        Dat.writeInt8(SurfaceData.y, 9+(Idx<<2))
        Dat.writeInt8(SurfaceData.sx, 10+(Idx<<2))
        Dat.writeInt8(SurfaceData.sy, 11+(Idx<<2))
        FloorNegate += SurfaceData.negate ? 0 : 2**(Idx%4)
        if (Math.floor(Idx/4) === Idx/4 && Idx !== 0) {
            NegateString += String.fromCharCode(FloorNegate)
            FloorNegate = 0
        }
        console.log(FloorNegate)
        if (SurfaceData.negate) {
            console.log(`Surface ${Idx} Is Negating, Encoding ${2**(Idx%4)}`)
            return
        }
        SmallestX = Math.min(SmallestX, SurfaceData.x)
        SmallestY = Math.min(SmallestY, SurfaceData.y)
        LargestXX = Math.max(LargestXX, SurfaceData.x + SurfaceData.sx)
        LargestYX = Math.max(LargestYX, SurfaceData.y + SurfaceData.sy)
    })
    NegateString += String.fromCharCode(FloorNegate)

    SizeX = LargestXX - SmallestX
    SizeY = LargestYX - SmallestY

    Dat.writeUInt8(SmallestX, 0)
    Dat.writeUInt8(SmallestY, 1)
    Dat.writeUInt8(SizeX, 2)
    Dat.writeUInt8(SizeY, 3)
    Dat.writeUInt32BE(DataKey.length, 4)
    Dat.write(NegateString.split("").reverse().join(""), 8+(DataKey.length<<2))

    console.log(FloorNegate)
    console.log(NegateString)
    console.log(Dat)

    const FileStream = fs.createWriteStream(FilePath)
    FileStream.write(Dat)
    FileStream.close()
}

const TestData: FloorData = {
    "Test": {x: 0, y: 0, sx: 10, sy: 10, negate:true},
    "Test2": {x: 10, y: 0, sx: 10, sy: 10, negate:false},
    "Test3": {x: 0, y: 10, sx: 10, sy: 10, negate:false},
    "Test4": {x: 10, y: 10, sx: 10, sy: 10, negate:false},
    "TestNegate": { x: 5, y: 5, sx: 5, sy: 5, negate: false},
}

EncodeMapData(path.join(__dirname, "test"), TestData)

fs.readFile(path.join(__dirname, "test"), (err: any, dat: any[]) => {
    dat.forEach((val) => {
        console.log(val)
    })
})