import * as png from "pngjs"
import * as fs from "fs"
import * as path from "path"
import Jimp from "jimp"

export interface AStarCoordinate {
    x: number
    y: number
}

const ConvertString = (Coord: AStarCoordinate): string => `${Coord.x},${Coord.y}`

const ConvertCoord = (Coord: string): AStarCoordinate => {
    //console.log(Coord)
    const SplitCoord: string[] = Coord.split(",")
    return {
        x: parseInt(SplitCoord[0]),
        y: parseInt(SplitCoord[1]),
    }
}

const Dist = (StartingNode: AStarCoordinate, EndingNode: AStarCoordinate): number =>
    Math.floor(10 * (
        Math.sqrt(((StartingNode.x - EndingNode.x) ** 2) +
            ((StartingNode.y - EndingNode.y) ** 2))
    ))

function GetLowestValueIdx(Obj: { [s: string]: number }, Only: string[]) {
    let ResultIdx: string = ""
    let LowestVal: number = Infinity

    Object.entries(Obj).forEach(([Idx, Val]) => {
        if (Val < LowestVal && Only.indexOf(Idx) !== -1) {
            ResultIdx = Idx
            LowestVal = Val
        }
    })

    return ResultIdx
}

function ReconstructPath(OriginMap: { [Node: string]: string }, Target: string) {
    let Path: string[] = [Target]
    let Current: string = Target
    while (OriginMap[Current]) {
        Current = OriginMap[Current]
        Path.unshift(Current)
    }

    return Path
}

export default function AStar(Graph: Buffer, StartingNode: AStarCoordinate, TargetNode: AStarCoordinate) {
    const SX: number = Graph[0]
    const SY: number = Graph[1]
    const StartingStringNode: string = ConvertString(StartingNode)
    const TargetStringNode: string = ConvertString(TargetNode)

    let OpenArray: string[] = [StartingStringNode]
    let ClosedArray: Set<string> = new Set<string>()
    let GCost: { [Node: string]: number } = {}
    GCost[StartingStringNode] = 0
    let FCost: { [Node: string]: number } = {}
    FCost[StartingStringNode] = Dist(StartingNode, TargetNode)
    let OriginNode: { [Node: string]: string } = {}

    while (OpenArray.length !== 0) {
        const CurrentNode = GetLowestValueIdx(FCost, OpenArray)
        //console.log(CurrentNode)

        OpenArray = OpenArray.slice(0, OpenArray.indexOf(CurrentNode)).concat(
            OpenArray.slice(OpenArray.indexOf(CurrentNode) + 1)
        )
        ClosedArray.add(CurrentNode)
        if (CurrentNode === TargetStringNode) {
            console.log("Target Reached")
            return ReconstructPath(OriginNode, TargetStringNode)
        }

        const CurrentCoord: AStarCoordinate = ConvertCoord(CurrentNode)
        const CX: number = CurrentCoord.x
        const CY: number = CurrentCoord.y
        const Neighbor = [
            `${CX + 1},${CY}`,
            `${CX - 1},${CY}`,
            `${CX},${CY + 1}`,
            `${CX},${CY - 1}`,
            `${CX + 1},${CY + 1}`,
            `${CX - 1},${CY + 1}`,
            `${CX + 1},${CY - 1}`,
            `${CX - 1},${CY - 1}`,
        ]
        Neighbor.forEach((Coord, Idx) => {
            //console.log(Coord)
            if (ClosedArray.has(Coord)) return
            const NeighborCoord: AStarCoordinate = ConvertCoord(Coord)
            const NX: number = NeighborCoord.x
            const NY: number = NeighborCoord.y
            if (NX >= SX||
                NY >= SY||
                NX < 0||
                NY < 0) return
            if (Graph[2 + (NX + (NY * SX))] === 0) return
            const NeighborGCost: number = GCost[CurrentNode] +
                Idx > 3 ? 14 : 10

            if (NeighborGCost < (GCost[Coord] ?? Infinity)) {
                OriginNode[Coord] = CurrentNode
                GCost[Coord] = NeighborGCost
                FCost[Coord] = NeighborGCost + Dist(NeighborCoord, TargetNode)
                if (OpenArray.indexOf(Coord) === -1) {
                    OpenArray.push(Coord)
                }
            }
        })
    }

    return false
}

const DX = 50
const DY = 50
const TestBuffer = Buffer.alloc(2+(DX*DY))

TestBuffer.write(String.fromCharCode(DX, DY, ...new Array(DX*DY).fill(0).map(() => Math.random() < 0.75 ? 1 : 0)))

let IMG = new Jimp(DX, DY)
IMG

console.log(AStar(TestBuffer, { x: 0, y: 0 }, { x: DX-1, y: DY-1 }))
