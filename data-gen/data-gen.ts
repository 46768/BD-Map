import { JSAStarCoordinate } from "@/app/lib/aStar/astar"
import * as fs from "fs"
import * as path from "path"

const ADATPath = path.join(__dirname, "..", "public", "ADAT")
const DDATPath = path.join(__dirname, "..", "public", "DDAT.csv")
const TRANSLATIONPath = path.join(__dirname, "..", "public", "TRANSLATION.csv")

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

INPT + USR_INPT(METADATA) => (ADAT, DDAT, TRANSLATION, METADATA).zip (PGK.zip)
PGK.zip => Github Pull Request + Approval => DATA Addition/Change
*/

//Input GPS Data
interface MarkerData {
    Latitude: number
    Longitude: number
}

interface InputDataSection {
    MarkerCount: number
    ID: string
    Markers: MarkerData[]
}

type InputData = InputDataSection[]

//Input Metadata
interface MetadataSection {
    ID: string
    Desc: string
    NameAlias: string[]
    AStarLocation: JSAStarCoordinate
    Layer: number
}

type Metadata = MetadataSection[]

//Output DDAT
interface SurfaceData {
    PosX: number
    PosY: number
    SizeX: number
    SizeY: number
    Layer: number
    RGB_Red: number
    RGB_Green: number
    RGB_Blue: number
}

//Output TRANSLATION
interface TranslationLine {
    ADATPosX: number
    ADATPosY: number
    DDATPosX: number
    DDATPosY: number
    Layer: number
}

//Parser

//Parser Input/Variable

//ADAT Parser

//DDAT Parser

//TRANSLATION Parser
