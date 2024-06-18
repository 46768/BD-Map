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

DDAT: (6(2POS:2SIZE:1NEGATEBOOL:1LYR)*SCOUNT)
    POSX,POSY,SX,SY,NEGATEBOOL,LYR\n

TRANSLSTION: (6(2APOS:2DPOS:1LYR)*(ASX*ASY))
    APOSX,APOSY,DPOSX,DPOSY,LYR,\n
*/

