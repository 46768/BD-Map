import { Polygon } from '@/mod/data/polygon/polygon'
import { Room } from '@/mod/data/room/room'
import { getPolygonEdges, validatePolygonTouching } from './polygonTools'

import type { Line } from './polygonTools'

export function lineToString(line: Line): string {
	return line.join(',')
}

export function stringToLine(lineStr: string): Line {
	const [slope, base] = lineStr.split(',')
	return [slope === "false" ? false : parseFloat(slope), parseFloat(base)]
}

export function getTouchingRooms(roomArray: Room[]): [string, string][] {
	const slopeArray: Record<string, Set<string>> = {}
	const verticalArray: Record<string, Set<string>> = {}

	for (let room of roomArray) {
		const roomID: string = room.id
		const roomPoly: Polygon = room.polygon;
		const polyEdges: Line[] = getPolygonEdges(roomPoly);

		for (let edge of polyEdges) {
			const stringEdge: string = lineToString(edge)
			if (typeof edge[0] === "boolean") {
				if (!verticalArray[stringEdge]) {
					verticalArray[stringEdge] = new Set<string>([roomID])
				} else {
					verticalArray[stringEdge].add(roomID)
				}
			} else {
				if (!slopeArray[stringEdge]) {
					slopeArray[stringEdge] = new Set<string>([roomID])
				} else {
					slopeArray[stringEdge].add(roomID)
				}
			}
		}
	}

	return []
}
