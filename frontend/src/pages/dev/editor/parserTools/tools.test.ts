import { expect, test } from 'vitest';
import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import * as polygonTools from './polygonTools';
import * as roomTools from './roomTools';

const testPolygon = new Polygon(
    [
        [0, 0],
        [0, 100],
        [100, 100],
        [100, 0],
    ],
    [70, 70, 70, 1]
);
const testPolygon2 = new Polygon(
    [
        [100, 0],
        [100, 100],
        [200, 100],
        [200, 0],
    ],
    [70, 70, 70, 1]
);
const testPolygon3 = new Polygon(
    [
        [200, 0],
        [200, 100],
        [300, 100],
        [300, 0],
    ],
    [70, 70, 70, 1]
);

const testRoom = new Room(7108, 1, testPolygon, 'testRoomID');
const testRoom2 = new Room(7107, 1, testPolygon2, 'testRoom2ID');
const testRoom3 = new Room(7109, 1, testPolygon3, 'testRoom3ID');

test('polygon edge extraction', () => {
    const edges: polygonTools.Line[] = polygonTools.getPolygonEdges(testPolygon);
    expect(edges).toEqual([
        [0, 0],
        [false, 0],
        [0, 100],
        [false, 100],
    ]);
});

test('polygon touching validation', () => {
    const testResult: boolean = polygonTools.validatePolygonTouching(testPolygon, testPolygon2);
    const testResult2: boolean = polygonTools.validatePolygonTouching(testPolygon, testPolygon3);
    expect(testResult).toBe(true);
    expect(testResult2).toBe(false);
});

test('room touch extraction', () => {
    const testResult: [string, string][] = roomTools.getTouchingRooms([testRoom, testRoom2]);
    const testResult2: [string, string][] = roomTools.getTouchingRooms([testRoom, testRoom3]);
    const testResult3: [string, string][] = roomTools.getTouchingRooms([
        testRoom,
        testRoom2,
        testRoom3,
    ]);
    expect(testResult).toEqual([['testRoomID', 'testRoom2ID']]);
    expect(testResult2).toEqual([]);
    expect(testResult3).toEqual([
        ['testRoomID', 'testRoom2ID'],
        ['testRoom2ID', 'testRoom3ID'],
    ]);
});
