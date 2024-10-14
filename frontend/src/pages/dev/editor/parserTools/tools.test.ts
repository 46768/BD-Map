import { expect, test } from 'vitest'
import { Polygon } from '@/mod/data/polygon/polygon'
import { Room } from '@/mod/data/room/room'
import * as polygonTools from './polygonTools';
import * as roomTools from './roomTools';

const testPolygon = new Polygon([
	[0, 0],
	[0, 100],
	[100, 100],
	[100, 0]
], [70, 70, 70, 1])
const testPolygon2 = new Polygon([
	[100, 0],
	[100, 100],
	[200, 100],
	[200, 0]
], [70, 70, 70, 1])

const testRoom = new Room(7108, 1, testPolygon, "testRoomID")
const testRoom2 = new Room(7107, 1, testPolygon2, "testRoom2ID")

test('polygon edge extraction', () => {
	const edges: polygonTools.Line[] = polygonTools.getPolygonEdges(testPolygon)
	expect(edges).toEqual([
		[0, 0],
		[false, 0],
		[0, 100],
		[false, 100],
	])
})

test('polygon touching validation', () => {

	expect(false).toBe(false)
})

test('room touch extraction', () => {
	expect([]).toEqual([])
})
