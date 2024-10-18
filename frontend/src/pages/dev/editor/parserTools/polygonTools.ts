import { Polygon } from '@/mod/data/polygon/polygon';
import { lineToString, stringToLine } from './roomTools';

import type { Coord } from '@/mod/data/com/vertex';

// [slope, y-intercept]
export type Line = [number | false, number];

// [Line, lowerX, upperX]
export type LineSegment = [Line, Coord, Coord];

export function normalizeZero(x: number) {
    return x === 0 ? 0 : x;
}

export function getPolygonEdges(polygon: Polygon): Line[] {
    const edgeArray: Line[] = [];
    const vertices: Coord[] = polygon.vertices;

    let prevIdx: number = vertices.length - 1;
    for (let vertIdx = 0; vertIdx < vertices.length; vertIdx++) {
        const [vertX, vertY] = vertices[vertIdx];
        const [prevX, prevY] = vertices[prevIdx];

        if (prevX === vertX) {
            edgeArray.push([false, vertX]);
            prevIdx = vertIdx;
            continue;
        }
        const slope = (prevY - vertY) / (prevX - vertX);
        const base = vertY - slope * vertX;
        edgeArray.push([normalizeZero(slope), normalizeZero(base)]);
        prevIdx = vertIdx;
    }
    return edgeArray;
}

export function getPolygonLabelledEdges(polygon: Polygon): Record<string, [Coord, Coord]> {
    const edgeRecord: Record<string, [Coord, Coord]> = {};
    const edgeArray: string[] = getPolygonEdges(polygon).map(lineToString);
    const vertices: Coord[] = polygon.vertices;

    let prevIdx: number = vertices.length - 1;
    for (let vertIdx = 0; vertIdx < vertices.length; vertIdx++) {
        edgeRecord[edgeArray[vertIdx]] = [vertices[vertIdx], vertices[prevIdx]];
        prevIdx = vertIdx;
    }
    return edgeRecord;
}

export function validateLineSegmentCoincidentation(
    [line1, lowerX1, upperX1]: LineSegment,
    [line2, lowerX2, upperX2]: LineSegment
): boolean {
    if (line1[0] !== line2[0]) return false;
    if (line1[1] !== line2[1]) return false;
    for (const vertex1 of [lowerX1[0], upperX1[0]]) {
        if (lowerX2[0] > vertex1 !== upperX2[0] > vertex1) return true;
    }
    for (const vertex2 of [lowerX2[0], upperX2[0]]) {
        if (lowerX1[0] > vertex2 !== upperX1[0] > vertex2) return true;
    }
    for (const vertex1 of [lowerX1[1], upperX1[1]]) {
        if (lowerX2[1] > vertex1 !== upperX2[1] > vertex1) return true;
    }
    for (const vertex2 of [lowerX2[1], upperX2[1]]) {
        if (lowerX1[1] > vertex2 !== upperX1[1] > vertex2) return true;
    }
    return false;
}

export function getPolygonCommonEdge(
    polygon1: Polygon,
    polygon2: Polygon
): [LineSegment, LineSegment][] {
    const poly1Edges: Record<string, [Coord, Coord]> = getPolygonLabelledEdges(polygon1);
    const poly2Edges: Record<string, [Coord, Coord]> = getPolygonLabelledEdges(polygon2);
    const returnEdges: [LineSegment, LineSegment][] = [];

    for (const line of Object.keys(poly1Edges)) {
        if (Object.prototype.hasOwnProperty.call(poly2Edges, line)) {
            const commonEdge = stringToLine(line);
            if (
                validateLineSegmentCoincidentation(
                    [commonEdge, ...poly1Edges[line]],
                    [commonEdge, ...poly2Edges[line]]
                )
            ) {
                returnEdges.push([
                    [commonEdge, ...poly1Edges[line]],
                    [commonEdge, ...poly2Edges[line]],
                ]);
            }
        }
    }
    return returnEdges;
}

export function validatePolygonTouching(polygon1: Polygon, polygon2: Polygon): boolean {
    return getPolygonCommonEdge(polygon1, polygon2).length !== 0;
}

export function getPolygonCenter(polygon: Polygon): Coord {
    const [[minX, maxX], [minY, maxY]] = polygon.boundingBox;
    return [(maxX + minX) / 2, (maxY + minY) / 2];
}
