export interface AStarCoordinate {
    x: number
    y: number
}

export default function AStar(Graph: Buffer, StartingNode: AStarCoordinate, TargetNode: AStarCoordinate) {
    function ConvertString(Coord: AStarCoordinate) {
        return `${Coord.x},${Coord.y}`
    }

    function Dist(StartingNode: AStarCoordinate, EndingNode: AStarCoordinate) {
        return 10*(Math.sqrt(((StartingNode.x-EndingNode.x)**2)+((StartingNode.y-EndingNode.y)**2)))
    }

    const SX: number = Graph[0]
    const SY: number = Graph[1]
    const StartingStringNode: string = ConvertString(StartingNode)

    let OpenArray: string[] = [ConvertString(StartingNode)]
    let GCost: {[Node:string]: number} = {}
    GCost[StartingStringNode] = 0
    let FCost: {[Node:string]: number} = {}
    FCost[StartingStringNode] = Dist(StartingNode, TargetNode)
    let OriginNode: {[Node: string]: string} = {}

    while (OpenArray.length !== 0) {
        const CurrentNode = Object.keys(FCost)[
            Object.values(FCost).reduce((LowestIdx, Val, CurrentIdx, Arr) => 
                Val < Arr[LowestIdx] ? CurrentIdx : LowestIdx
            )
        ]

        if (CurrentNode === ConvertString(TargetNode)) {
            return true
        }

        OpenArray = OpenArray.slice(0, OpenArray.indexOf(CurrentNode)).concat(
            OpenArray.slice(OpenArray.indexOf(CurrentNode)+1)
        )

        
    }
}