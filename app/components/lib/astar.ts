export interface AStarCoordinate {
    x: number;
    y: number;
  }
  
  export default function AStar(
    Graph: Buffer,
    StartingNode: AStarCoordinate,
    TargetNode: AStarCoordinate
  ) {
    function ConvertString(Coord: AStarCoordinate): string {
      return `${Coord.x},${Coord.y}`;
    }
  
    function ConvertCoord(Coord: string): AStarCoordinate {
      //console.log(Coord)
      return {
        x: parseInt(Coord.split(",")[0]),
        y: parseInt(Coord.split(",")[1]),
      };
    }
  
    function Dist(
      StartingNode: AStarCoordinate,
      EndingNode: AStarCoordinate
    ): number {
      return Math.floor(
        10 *
          Math.sqrt(
            (StartingNode.x - EndingNode.x) ** 2 +
              (StartingNode.y - EndingNode.y) ** 2
          )
      );
    }
  
    function GetLowestValueIdx(Obj: { [s: string]: number }, Only: string[]) {
      let ResultIdx: string = "";
      let LowestVal: number = Infinity;
  
      Object.entries(Obj).forEach(([Idx, Val]) => {
        if (Val < LowestVal && Only.indexOf(Idx) !== -1) {
          ResultIdx = Idx;
          LowestVal = Val;
        }
      });
  
      return ResultIdx;
    }
  
    function ReconstructPath(
      OriginMap: { [Node: string]: string },
      Target: string
    ) {
      let Path: string[] = [Target];
      let Current: string = Target;
      while (OriginMap[Current]) {
        Current = OriginMap[Current];
        Path.unshift(Current);
      }
  
      return Path;
    }
  
    Graph.forEach((Val, Idx) => console.log(`${Val} at ${Idx}`));
  
    const SX: number = Graph[0];
    const SY: number = Graph[1];
    const StartingStringNode: string = ConvertString(StartingNode);
  
    let OpenArray: string[] = [ConvertString(StartingNode)];
    let ClosedArray: Set<string> = new Set<string>();
    let GCost: { [Node: string]: number } = {};
    GCost[StartingStringNode] = 0;
    let FCost: { [Node: string]: number } = {};
    FCost[StartingStringNode] = Dist(StartingNode, TargetNode);
    let OriginNode: { [Node: string]: string } = {};
  
    let Limit: number = 0;
  
    while (OpenArray.length !== 0 && Limit <= 100000) {
      const CurrentNode = GetLowestValueIdx(FCost, OpenArray);
      console.log(CurrentNode);
  
      OpenArray = OpenArray.slice(0, OpenArray.indexOf(CurrentNode)).concat(
        OpenArray.slice(OpenArray.indexOf(CurrentNode) + 1)
      );
      ClosedArray.add(CurrentNode);
      if (CurrentNode === ConvertString(TargetNode)) {
        console.log("Target Reached");
        return ReconstructPath(OriginNode, ConvertString(TargetNode));
      }
  
      const CurrentCoord: AStarCoordinate = ConvertCoord(CurrentNode);
      const Neighbor = [
        `${CurrentCoord.x + 1},${CurrentCoord.y}`,
        `${CurrentCoord.x - 1},${CurrentCoord.y}`,
        `${CurrentCoord.x},${CurrentCoord.y + 1}`,
        `${CurrentCoord.x},${CurrentCoord.y - 1}`,
        `${CurrentCoord.x + 1},${CurrentCoord.y + 1}`,
        `${CurrentCoord.x - 1},${CurrentCoord.y + 1}`,
        `${CurrentCoord.x + 1},${CurrentCoord.y - 1}`,
        `${CurrentCoord.x - 1},${CurrentCoord.y - 1}`,
      ];
      Neighbor.forEach((Coord) => {
        //console.log(Coord)
        if (ClosedArray.has(Coord)) return;
        const NeighborCoord: AStarCoordinate = ConvertCoord(Coord);
        if (
          NeighborCoord.x >= SX ||
          NeighborCoord.y >= SY ||
          NeighborCoord.x < 0 ||
          NeighborCoord.y < 0
        )
          return;
        console.log(
          `Pos: ${NeighborCoord.x},${NeighborCoord.y} Is ${
            Graph[2 + (NeighborCoord.x + NeighborCoord.y * SX)]
          }`
        );
        if (Graph[2 + (NeighborCoord.x + NeighborCoord.y * SX)] === 0) return;
        const NeighborGCost: number =
          GCost[CurrentNode] + Dist(CurrentCoord, NeighborCoord);
  
        if (NeighborGCost < (GCost[Coord] ? GCost[Coord] : Infinity)) {
          OriginNode[Coord] = CurrentNode;
          GCost[Coord] = NeighborGCost;
          FCost[Coord] = NeighborGCost + Dist(NeighborCoord, TargetNode);
          if (OpenArray.indexOf(Coord) === -1) {
            OpenArray.push(Coord);
          }
        }
      });
      //console.log(Limit)
      Limit++;
    }
  
    return false;
  }
  
  const TestBuffer = Buffer.alloc(27);
  
  TestBuffer.write(
    String.fromCharCode(
      5,
      5,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    )
  );
  
  console.log(AStar(TestBuffer, { x: 0, y: 2 }, { x: 4, y: 2 }));
  