import { Room } from '@/mod/data/room/room';
import { getTouchingRooms } from './roomTools';
import {
    getPolygonCommonEdge,
    getPolygonCenter,
    validateLineSegmentCoincidentation,
} from './polygonTools';
import { coordToString, coordCmp } from '@/mod/data/com/vertex';

import type { Coord } from '@/mod/data/com/vertex';
import type { LineSegment } from './polygonTools';

export type Nodes = Coord[];
export type Neighbors = number[][];
export type GraphData = [Nodes, Neighbors];

export function generateGraph(roomData: Room[]): GraphData {
    const touchingRooms: [Room, Room][] = getTouchingRooms(roomData);
    const commonEdges: [[LineSegment, LineSegment][], Room, Room][] = [];
    const nodes: Nodes = [];
    const neighbors: Neighbors = [];

    for (const [room1, room2] of touchingRooms) {
        const nodesCnt: number = nodes.length;
        const room1CenterCoord: Coord = getPolygonCenter(room1.polygon);
        const room2CenterCoord: Coord = getPolygonCenter(room2.polygon);
        const room1CCIdx: number =
            nodes.findIndex(
                (element) => coordToString(element) === coordToString(room1CenterCoord)
            ) !== -1
                ? nodes.findIndex(
                      (element) => coordToString(element) === coordToString(room1CenterCoord)
                  )
                : nodesCnt;
        const room2CCIdx: number =
            nodes.findIndex(
                (element) => coordToString(element) === coordToString(room2CenterCoord)
            ) !== -1
                ? nodes.findIndex(
                      (element) => coordToString(element) === coordToString(room2CenterCoord)
                  )
                : nodesCnt + 1;
        if (room1CCIdx >= nodesCnt) {
            nodes.push(room1CenterCoord);
            neighbors.push([]);
        }
        if (room2CCIdx >= nodesCnt + 1) {
            nodes.push(room2CenterCoord);
            neighbors.push([]);
        }
    }

    for (const touchingRoom of touchingRooms) {
        commonEdges.push([
            getPolygonCommonEdge(touchingRoom[0].polygon, touchingRoom[1].polygon),
            touchingRoom[0],
            touchingRoom[1],
        ]);
    }

    for (const [segmentData, room1, room2] of commonEdges) {
        const nodesCnt = nodes.length;
        const room1CenterCoord: Coord = getPolygonCenter(room1.polygon);
        const room2CenterCoord: Coord = getPolygonCenter(room2.polygon);
        const room1CCIdx: number =
            nodes.findIndex(
                (element) => coordToString(element) === coordToString(room1CenterCoord)
            ) !== -1
                ? nodes.findIndex(
                      (element) => coordToString(element) === coordToString(room1CenterCoord)
                  )
                : nodesCnt;
        const room2CCIdx: number =
            nodes.findIndex(
                (element) => coordToString(element) === coordToString(room2CenterCoord)
            ) !== -1
                ? nodes.findIndex(
                      (element) => coordToString(element) === coordToString(room2CenterCoord)
                  )
                : nodesCnt + 1;
        for (const [segment1, segment2] of segmentData) {
            const coordSelector: 0 | 1 = segment1[0][0] === false ? 1 : 0;
            const lineCoord: [Coord, Coord, Coord, Coord] = [
                segment1[1],
                segment1[2],
                segment2[1],
                segment2[2],
            ];
            lineCoord.sort((a, b) => a[coordSelector] - b[coordSelector]);
            const intersectingSegment: LineSegment = [
                [...segment1[0]],
                [...lineCoord[1]],
                [...lineCoord[2]],
            ];
            const interSegmentMid: Coord = [0, 0];
            if (coordCmp(intersectingSegment[1], intersectingSegment[2])) {
                continue;
            }
            if (intersectingSegment[0][0] === false) {
                interSegmentMid[0] = intersectingSegment[1][0];
                interSegmentMid[1] = (intersectingSegment[1][1] + intersectingSegment[2][1]) / 2;
            } else if (intersectingSegment[0][0] === 0) {
                interSegmentMid[0] = (intersectingSegment[1][0] + intersectingSegment[2][0]) / 2;
                interSegmentMid[1] = intersectingSegment[1][1];
            } else {
                interSegmentMid[0] = (intersectingSegment[1][0] + intersectingSegment[2][0]) / 2;
                interSegmentMid[1] = (intersectingSegment[1][1] + intersectingSegment[2][1]) / 2;
            }

            const interSegmentMidIdx = nodes.push(interSegmentMid) - 1;
            neighbors.push([room1CCIdx, room2CCIdx]);
            for (const connectingNode of neighbors[room1CCIdx]) {
                neighbors[connectingNode].push(interSegmentMidIdx);
                neighbors[interSegmentMidIdx].push(connectingNode);
            }
            for (const connectingNode of neighbors[room2CCIdx]) {
                neighbors[connectingNode].push(interSegmentMidIdx);
                neighbors[interSegmentMidIdx].push(connectingNode);
            }
            neighbors[room1CCIdx].push(interSegmentMidIdx);
            neighbors[room2CCIdx].push(interSegmentMidIdx);
        }
    }

    return [nodes, neighbors];
}
