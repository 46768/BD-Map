"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AStar(Graph, StartingNode, TargetNode) {
    function ConvertString(Coord) {
        return "".concat(Coord.x, ",").concat(Coord.y);
    }
    function ConvertCoord(Coord) {
        //console.log(Coord)
        return {
            x: parseInt(Coord.split(",")[0]),
            y: parseInt(Coord.split(",")[1]),
        };
    }
    function Dist(StartingNode, EndingNode) {
        return Math.floor(10 * (Math.sqrt((Math.pow((StartingNode.x - EndingNode.x), 2)) + (Math.pow((StartingNode.y - EndingNode.y), 2)))));
    }
    function GetLowestValueIdx(Obj, Only) {
        var ResultIdx = "";
        var LowestVal = Infinity;
        Object.entries(Obj).forEach(function (_a) {
            var Idx = _a[0], Val = _a[1];
            if (Val < LowestVal && Only.indexOf(Idx) !== -1) {
                ResultIdx = Idx;
                LowestVal = Val;
            }
        });
        return ResultIdx;
    }
    function ReconstructPath(OriginMap, Target) {
        var Path = [Target];
        var Current = Target;
        while (OriginMap[Current]) {
            Current = OriginMap[Current];
            Path.unshift(Current);
        }
        return Path;
    }
    Graph.forEach(function (Val, Idx) { return console.log("".concat(Val, " at ").concat(Idx)); });
    var SX = Graph[0];
    var SY = Graph[1];
    var StartingStringNode = ConvertString(StartingNode);
    var OpenArray = [ConvertString(StartingNode)];
    var ClosedArray = new Set();
    var GCost = {};
    GCost[StartingStringNode] = 0;
    var FCost = {};
    FCost[StartingStringNode] = Dist(StartingNode, TargetNode);
    var OriginNode = {};
    var Limit = 0;
    var _loop_1 = function () {
        var CurrentNode = GetLowestValueIdx(FCost, OpenArray);
        console.log(CurrentNode);
        OpenArray = OpenArray.slice(0, OpenArray.indexOf(CurrentNode)).concat(OpenArray.slice(OpenArray.indexOf(CurrentNode) + 1));
        ClosedArray.add(CurrentNode);
        if (CurrentNode === ConvertString(TargetNode)) {
            console.log("Target Reached");
            return { value: ReconstructPath(OriginNode, ConvertString(TargetNode)) };
        }
        var CurrentCoord = ConvertCoord(CurrentNode);
        var Neighbor = [
            "".concat(CurrentCoord.x + 1, ",").concat(CurrentCoord.y),
            "".concat(CurrentCoord.x - 1, ",").concat(CurrentCoord.y),
            "".concat(CurrentCoord.x, ",").concat(CurrentCoord.y + 1),
            "".concat(CurrentCoord.x, ",").concat(CurrentCoord.y - 1),
            "".concat(CurrentCoord.x + 1, ",").concat(CurrentCoord.y + 1),
            "".concat(CurrentCoord.x - 1, ",").concat(CurrentCoord.y + 1),
            "".concat(CurrentCoord.x + 1, ",").concat(CurrentCoord.y - 1),
            "".concat(CurrentCoord.x - 1, ",").concat(CurrentCoord.y - 1),
        ];
        Neighbor.forEach(function (Coord) {
            //console.log(Coord)
            if (ClosedArray.has(Coord))
                return;
            var NeighborCoord = ConvertCoord(Coord);
            if (NeighborCoord.x >= SX || NeighborCoord.y >= SY || NeighborCoord.x < 0 || NeighborCoord.y < 0)
                return;
            console.log("Pos: ".concat(NeighborCoord.x, ",").concat(NeighborCoord.y, " Is ").concat(Graph[2 + (NeighborCoord.x + (NeighborCoord.y * SX))]));
            if (Graph[2 + (NeighborCoord.x + (NeighborCoord.y * SX))] === 0)
                return;
            var NeighborGCost = GCost[CurrentNode] +
                Dist(CurrentCoord, NeighborCoord);
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
    };
    while (OpenArray.length !== 0 && Limit <= 100000) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
exports.default = AStar;
var TestBuffer = Buffer.alloc(27);
TestBuffer.write(String.fromCharCode(5, 5, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1));
console.log(AStar(TestBuffer, { x: 0, y: 2 }, { x: 4, y: 2 }));
