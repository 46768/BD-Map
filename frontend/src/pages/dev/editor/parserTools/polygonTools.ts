import { Polygon } from '@/mod/data/polygon/polygon'

import type { Coord } from '@/mod/data/com/vertex'

// [slope, y-intercept]
export type Line = [number | false, number]

export function normalizeZero(x: number) {
	return x === 0 ? 0 : x;
}

export function getPolygonEdges(polygon: Polygon): Line[]  {
	const edgeArray: Line[] = []
	const vertices: Coord[] = polygon.vertices

	let prevIdx: number = vertices.length - 1
	for (let vertIdx = 0; vertIdx < vertices.length; vertIdx++) {
		const [vertX, vertY] = vertices[vertIdx]
		const [prevX, prevY] = vertices[prevIdx]

		if (prevX === vertX) {
			edgeArray.push([false, vertX])
			prevIdx = vertIdx
			continue
		}
		const slope = (prevY-vertY)/(prevX-vertX)
		const base = vertY - (slope * vertX)
		edgeArray.push([normalizeZero(slope), normalizeZero(base)])
		prevIdx = vertIdx
	}
	return edgeArray
}

export function validatePolygonTouching(polygon1: Polygon, polygon2: Polygon): boolean {
	return false	
}

