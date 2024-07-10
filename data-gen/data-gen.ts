import { JSAStarCoordinate } from "@/app/lib/aStar/astar";
/*
Data Strcuture
ADAT: (8+(SX*SY))
    32BIT SX
    32BIT SY
    SX*SY BIT 2DDAT

DDAT: (9(1ID:2POS:2SIZE:1LYR:3RGB)*SCOUNT)
    ID,POSX,POSY,SX,SY,LYR,RGB_R,RGB_G,RGB_B\n

TRANSLATION: (5(2APOS:2DPOS:1LYR)*(ASX*ASY))
    APOSX,APOSY,DPOSX,DPOSY,LYR\n

METADATA: (5(1ID:1DESC:1[NAME_ALIAS]:1ADAT_LOCAT:1LYR)*SCOUNT)
    ID, DESCRIPTION, ARRAY<STRING>(NAME_ALIAS), ADAT_LOCATION, LYR\n

//Input Data For Parsing, Apply To All Below

INPT: (MARKER_COUNT, ID, [MARKER_DATA])[]
    MARKER_DATA {
        LAT:number
        LON:number
    }

//FlowChart

INPT + USR_INPT(METADATA) => (ALLOCTAB, ADAT, DDAT, TRANSLATION, METADATA).zip (PGK.zip)
PGK.zip => Github Pull Request + Approval => DATA Addition/Change
*/

//Input GPS Data
interface MarkerData {
  Latitude: number;
  Longitude: number;
}

interface InputDataSection {
  MarkerCount: number;
  ID: string;
  Markers: MarkerData[];
}

type InputData = InputDataSection[];

//Input Metadata
interface MetadataSection {
  ID: string;
  Desc: string;
  NameAlias: string[];
  AStarLocation: JSAStarCoordinate;
  Layer: number;
}

type Metadata = MetadataSection[];

//Output DDAT
interface SurfaceData {
  PosX: number;
  PosY: number;
  SizeX: number;
  SizeY: number;
  Layer: number;
  RGB_Red: number;
  RGB_Green: number;
  RGB_Blue: number;
}

//Output TRANSLATION
interface TranslationLine {
  ADATPosX: number;
  ADATPosY: number;
  DDATPosX: number;
  DDATPosY: number;
  Layer: number;
}

//Parser

function InptParser(InptData: InputData, Metadata: Metadata): {
    allocationTable: number[]  //CSV File
    mipmap: {
        X2: Buffer
        X4: Buffer
        X8: Buffer
        X16: Buffer
    } //4 Binary Files
    DrawData: SurfaceData[] //CSV File
    Translation: TranslationLine[] //CSV File
} {

    //AStar Data Parsing
    //Allocation Table Generation
        //Allocation Metadata => Floor,IdxStart,IdxEnd\n
    let allocationTable: number[] = [];
    //X16 Base Parsing
    const Precision = 10^3 //10^n where n is the amount of decimal places

    const LatitudeArray: number[] = InptData.map((Section) => Section.Markers.map((Data) => Data.Latitude)).flat()
    const LongitudeArray: number[] = InptData.map((Section) => Section.Markers.map((Data) => Data.Longitude)).flat()
    const SizeX: number = (Math.max(...LatitudeArray) - Math.min(...LatitudeArray))*16*Precision //Latitude
    const SizeY: number = (Math.max(...LongitudeArray) - Math.min(...LongitudeArray))*16*Precision //Longitude

    let X16Buffer: Buffer = Buffer.alloc((SizeX*SizeY)/8)
    InptData.forEach((Section) => {
        Section.Markers.forEach((Data) => {
            
        })
    })

    //Return Final Parsed Data TODO - Implement Data Parsing
    return {
        allocationTable: allocationTable,
        mipmap: {
            X2: Buffer.alloc(1),
            X4: Buffer.alloc(1),
            X8: Buffer.alloc(1),
            X16: X16Buffer,
        },
        DrawData: [{
            PosX: 0,
            PosY: 0,
            SizeX: 0,
            SizeY: 0,
            Layer: 0,
            RGB_Red: 0,
            RGB_Green: 0,
            RGB_Blue: 0
        }],
        Translation: [{
            ADATPosX: 0,
            ADATPosY: 0,
            DDATPosX: 0,
            DDATPosY: 0,
            Layer: 0
        }]
    }
}
