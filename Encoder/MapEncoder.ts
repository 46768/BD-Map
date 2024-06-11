const fs = require('node:fs')
const path = require('node:path')

export interface FloorData {
    [Surface: string]: {
        x: number,
        y: number,
        sx: number,
        sy: number,
        r: number,
        z: number,
        desc: string,
        id: string,
        displayName: string[],
        negate: boolean}
}

function GenRanKey(): string {
    let ResString = ""
    const Table = [
        "a","b","c","d","e","f",
        "g","h","i","j","k","l",
        "m","o","p","q","r","s",
        "t","u","v","w","y","x",
        "z","0","1","2","3","4",
        "5","6","7","8","9","A",
        "B","C","D","E","F","G",
        "H","I","J","K","L","M",
        "O","P","Q","R","S","T",
        "U","V","W","Y","X","Z",
    ]

    for (let Idx = 0; Idx < 4; ++Idx) {
        ResString += Table[Math.floor((Table.length-1)*Math.random())]
    }

    return ResString
}


export function EncodeMapData(FDFilePath: string, RDFilePath: string, Data: FloorData) {
    //First 32 Bit Define Floor Size In Int8, Concat Together To Decode The Length
    //SX(8)|SY(8)|SZX(8)|SZY(8)|
    //32 Bit After The First 16 Contains The Surface Count
    //Every 88 Bit After The First 64 Define The Surface Data
    //Every 8 Sets Of Surface Data Can Be Linked To A Character To Differ From
    //Negated Surface (0) Or Walkale Surface (1)
    const DataKey: string[] = Object.keys(Data)
    const NameSize: number = DataKey.join("").length
    const RDSeparator: string = "&&&\n"
    const DescArray = Object.values(Data).map((Val) => Val.desc)

    let FDDat = Buffer.alloc(16 + (DataKey.length * 26) + Math.ceil(DataKey.length / 8))
    let NegateString: string = ''
    let FloorNegate: string = ''
    let RoomLink: string = ''
    let RoomDesc: string = ''
    let RoomID: string = ''
    let RoomNameAlias: string = ''

    let SizeX: number = 0
    let SizeY: number = 0

    let SmallestY: number = 0
    let SmallestX: number = 0
    let LargestXX: number = 0
    let LargestYX: number = 0

    Object.values(Data).forEach((SurfaceData, Idx) => {
        const SurfaceID: string = GenRanKey()
        FDDat.writeInt32BE(SurfaceData.x, 16+8+(Idx*26))
        FDDat.writeInt32BE(SurfaceData.y, 16+12+(Idx*26))
        FDDat.writeUInt32BE(SurfaceData.sx, 16+16+(Idx*26))
        FDDat.writeUInt32BE(SurfaceData.sy, 16+20+(Idx*26))
        FDDat.writeUInt16BE(SurfaceData.r, 16+24+(Idx*26))
        FDDat.writeUInt32BE(SurfaceData.z, 16+26+(Idx*26))
        FDDat.write(SurfaceID, 16+30+(Idx*26), "ascii")

        RoomLink += `${SurfaceID}${DataKey[Idx]}|`
        RoomDesc += `${SurfaceID}${SurfaceData.desc}|`
        RoomID += `${SurfaceID}${SurfaceData.id}|`
        RoomNameAlias += `${SurfaceID}${SurfaceData.displayName.join(")")}|`

        FloorNegate += SurfaceData.negate ? 0 : 1
        if (Idx%8 === 0 && Idx !== 0) {
            FloorNegate = FloorNegate.padEnd(8, "0")
            NegateString += String.fromCharCode(parseInt(FloorNegate, 2))
            //console.log(`Encoded ${parseInt(FloorNegate, 2)} Into Write String, Raw: ${FloorNegate.padEnd(8, "0")}`)
            FloorNegate = ''
        }
        //console.log(FloorNegate)
        if (SurfaceData.negate) {
            //console.log(`Surface ${Idx} Is Negating, Encoding 0`)
            return
        }
        SmallestX = Math.min(SmallestX, SurfaceData.x)
        SmallestY = Math.min(SmallestY, SurfaceData.y)
        LargestXX = Math.max(LargestXX, SurfaceData.x + SurfaceData.sx)
        LargestYX = Math.max(LargestYX, SurfaceData.y + SurfaceData.sy)
    })
    FloorNegate = FloorNegate.padEnd(8, "0")
    NegateString += String.fromCharCode(parseInt(FloorNegate, 2))
    //console.log(`Last Encoded ${parseInt(FloorNegate, 2)} Into Write String, Raw: ${FloorNegate}`)

    SizeX = LargestXX - SmallestX
    SizeY = LargestYX - SmallestY

    FDDat.writeInt32BE(SmallestX, 0)
    FDDat.writeInt32BE(SmallestY, 4)
    FDDat.writeUInt32BE(SizeX, 8)
    FDDat.writeUInt32BE(SizeY, 12)
    FDDat.writeUInt32BE(DataKey.length, 16)
    FDDat.write(NegateString.split("").reverse().join(""), 16+(DataKey.length*26))

    //console.log(FloorNegate)
    //console.log(NegateString)
    console.log(NameSize)
    console.log(FDDat)

    const FDFileStream = fs.createWriteStream(FDFilePath)
    FDFileStream.write(FDDat)
    FDFileStream.close()
    const RDFileStream = fs.createWriteStream(RDFilePath)
    RDFileStream.write(RoomLink+RDSeparator)
    RDFileStream.write(RoomDesc+RDSeparator)
    RDFileStream.write(RoomID+RDSeparator)
    RDFileStream.write(RoomNameAlias+RDSeparator)
    RDFileStream.close()
}

let TestData: FloorData = {
}

for (let i = 0; i < 100; i++) {
    TestData[`Test${i}`] = {
        x: Math.floor(10 + ((40)*Math.random())),
        y: Math.floor(15 + ((40)*Math.random())),
        sx: Math.floor(10 + ((127-10)*Math.random())),
        sy: Math.floor(10 + ((40)*Math.random())),
        r: Math.floor(0+(360*Math.random())),
        z: Math.floor(0+(10)*Math.random()),
        desc: "Test",
        id: '0000',
        displayName: [`Test${i}`, "TestAlias"],
        negate: Math.random() >= 0.5}
}

EncodeMapData(path.join(__dirname, "..", "public", "MDAT"), path.join(__dirname, "..", "public", "RDAT"), TestData)

// fs.readFile(path.join(__dirname, "test"), (err: any, dat: any[]) => {
    // dat.forEach((val) => {
        // console.log(val)
    // })
// })