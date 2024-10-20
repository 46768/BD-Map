import { test, expect } from 'vitest';

import * as pathTools from '../pathTools';
import * as parser from '../parser';
import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';

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
const testPolygon4 = new Polygon(
    [
        [25, 100],
        [75, 100],
        [75, 200],
        [25, 200],
    ],
    [70, 70, 70, 1]
);
const testPolygon5 = new Polygon(
    [
        [125, 100],
        [175, 100],
        [175, 200],
        [125, 200],
    ],
    [70, 70, 70, 1]
);
const testPolygon6 = new Polygon(
    [
        [225, 100],
        [275, 100],
        [275, 200],
        [225, 200],
    ],
    [70, 70, 70, 1]
);
const testPolygon7 = new Polygon(
    [
        [0, 200],
        [0, 300],
        [300, 300],
        [300, 200],
    ],
    [70, 70, 70, 1]
);

const testRoom = new Room(7108, 1, testPolygon, 'testRoomID');
const testRoom2 = new Room(7107, 1, testPolygon2, 'testRoom2ID');
const testRoom3 = new Room(7109, 1, testPolygon3, 'testRoom3ID');
const testRoom4 = new Room(7101, 1, testPolygon4, 'testRoom4ID');
const testRoom5 = new Room(7102, 1, testPolygon5, 'testRoom5ID');
const testRoom6 = new Room(7103, 1, testPolygon6, 'testRoom6ID');
const testRoom7 = new Room(7104, 1, testPolygon7, 'testRoom7ID');

const testData = [testRoom, testRoom2, testRoom3, testRoom4, testRoom5, testRoom6, testRoom7];

test('path parser', () => {
    const resultPath: pathTools.PathData = pathTools.generatePath(testData);
    expect(parser.parsePathFileData(parser.generatePathFileData(resultPath))).toEqual(resultPath);
});
test('room parser', () => {
    expect(parser.parseRoomFileData(parser.generateRoomFileData(testData))).toEqual(testData);
});

test('whole parser', () => {
    const resultPath: pathTools.PathData = pathTools.generatePath(testData);
    expect(
        parser.parseWholeData(
            parser.joinFileData(
                parser.generatePathFileData(resultPath),
                parser.generateRoomFileData(testData)
            )
        )
    ).toEqual([resultPath, testData]);
});
