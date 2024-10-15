import { Polygon } from '@/mod/data/polygon/polygon';
import { lineToString, stringToLine } from './roomTools';

import type { Coord } from '@/mod/data/com/vertex';

// [slope, y-intercept]
export type Line = [number | false, number];

// [Line, lowerX, upperX]
export type LineSegment = [Line, number, number];

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

export function getPolygonLabelledEdges(polygon: Polygon): Record<string, [number, number]> {
	const edgeRecord: Record<string, [number, number]> = {}
    const edgeArray: string[] = getPolygonEdges(polygon).map(lineToString);
    const vertices: Coord[] = polygon.vertices;

    let prevIdx: number = vertices.length - 1;
    for (let vertIdx = 0; vertIdx < vertices.length; vertIdx++) {
		edgeRecord[edgeArray[vertIdx]] = [vertices[vertIdx][0], vertices[prevIdx][0]]
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
    for (const vertex1 of [lowerX1, upperX1]) {
        if (lowerX2 > vertex1 !== upperX2 > vertex1) return true;
    }
    for (const vertex2 of [lowerX2, upperX2]) {
        if (lowerX1 > vertex2 !== upperX1 > vertex2) return true;
    }
    return false;
}

export function validatePolygonTouching(polygon1: Polygon, polygon2: Polygon): boolean {
    const polygon1Edges: Record<string, [number, number]> = getPolygonLabelledEdges(polygon1);
    const polygon2Edges: Record<string, [number, number]> = getPolygonLabelledEdges(polygon2);
    const polygon2EdgeLines: Set<string> = new Set<string>(Object.keys(polygon2Edges));

    for (const edge of Object.keys(polygon1Edges)) {
        if (!polygon2EdgeLines.has(edge)) continue;
        const commonLine = stringToLine(edge);

        if (
            validateLineSegmentCoincidentation(
                [commonLine, ...polygon1Edges[edge]],
                [commonLine, ...polygon2Edges[edge]]
            )
        )
            return true;
    }
    return false;
}
