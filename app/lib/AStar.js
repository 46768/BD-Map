"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var png = require("pngjs");
var fs = require("fs");
var path = require("path");
var ConvertString = function (Coord) { return "".concat(Coord.x, ",").concat(Coord.y); };
var ConvertCoord = function (Coord) {
    //console.log(Coord)
    var SplitCoord = Coord.split(",");
    return {
        x: parseInt(SplitCoord[0]),
        y: parseInt(SplitCoord[1]),
    };
};
var Dist = function (StartingNode, EndingNode) {
    return Math.floor(10 * (Math.sqrt((Math.pow((StartingNode.x - EndingNode.x), 2)) +
        (Math.pow((StartingNode.y - EndingNode.y), 2)))));
};
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
function AStar(Graph, StartingNode, TargetNode) {
    var SX = Graph[0];
    var SY = Graph[1];
    var StartingStringNode = ConvertString(StartingNode);
    var TargetStringNode = ConvertString(TargetNode);
    var OpenArray = [StartingStringNode];
    var ClosedArray = new Set();
    var GCost = {};
    GCost[StartingStringNode] = 0;
    var FCost = {};
    FCost[StartingStringNode] = Dist(StartingNode, TargetNode);
    var OriginNode = {};
    var _loop_1 = function () {
        var CurrentNode = GetLowestValueIdx(FCost, OpenArray);
        //console.log(CurrentNode)
        OpenArray = OpenArray.slice(0, OpenArray.indexOf(CurrentNode)).concat(OpenArray.slice(OpenArray.indexOf(CurrentNode) + 1));
        ClosedArray.add(CurrentNode);
        if (CurrentNode === TargetStringNode) {
            console.log("Target Reached");
            return { value: ReconstructPath(OriginNode, TargetStringNode) };
        }
        var CurrentCoord = ConvertCoord(CurrentNode);
        var CX = CurrentCoord.x;
        var CY = CurrentCoord.y;
        var Neighbor = [
            "".concat(CX + 1, ",").concat(CY),
            "".concat(CX - 1, ",").concat(CY),
            "".concat(CX, ",").concat(CY + 1),
            "".concat(CX, ",").concat(CY - 1),
            "".concat(CX + 1, ",").concat(CY + 1),
            "".concat(CX - 1, ",").concat(CY + 1),
            "".concat(CX + 1, ",").concat(CY - 1),
            "".concat(CX - 1, ",").concat(CY - 1),
        ];
        Neighbor.forEach(function (Coord, Idx) {
            var _a;
            //console.log(Coord)
            if (ClosedArray.has(Coord))
                return;
            var NeighborCoord = ConvertCoord(Coord);
            var NX = NeighborCoord.x;
            var NY = NeighborCoord.y;
            if (NX >= SX ||
                NY >= SY ||
                NX < 0 ||
                NY < 0)
                return;
            if (Graph[2 + (NX + (NY * SX))] === 0)
                return;
            var NeighborGCost = GCost[CurrentNode] +
                Idx > 3 ? 14 : 10;
            if (NeighborGCost < ((_a = GCost[Coord]) !== null && _a !== void 0 ? _a : Infinity)) {
                OriginNode[Coord] = CurrentNode;
                GCost[Coord] = NeighborGCost;
                FCost[Coord] = NeighborGCost + Dist(NeighborCoord, TargetNode);
                if (OpenArray.indexOf(Coord) === -1) {
                    OpenArray.push(Coord);
                }
            }
        });
    };
    while (OpenArray.length !== 0) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
exports.default = AStar;
var DX = 50;
var DY = 50;
var TestBuffer = Buffer.alloc(2 + (DX * DY));
TestBuffer.write(String.fromCharCode.apply(String, __spreadArray([DX, DY], new Array(DX * DY).fill(0).map(function () { return Math.random() < 0.75 ? 1 : 0; }), false)));
var Dat = new png.PNG({ height: DY, width: DX });
Dat.parse(TestBuffer.subarray(2));
fs.writeFileSync(path.join(__dirname, "Dat.png"), Dat.read());
console.log(AStar(TestBuffer, { x: 0, y: 0 }, { x: DX - 1, y: DY - 1 }));
