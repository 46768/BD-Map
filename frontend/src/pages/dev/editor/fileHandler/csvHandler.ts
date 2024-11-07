import { Room } from '@/mod/data/room/room';
import { Polygon } from '@/mod/data/polygon/polygon';

import type { Coord } from '@/mod/data/com/vertex';

export function parseCSV(fileData: string) {
    const nestedArrayData: string[][] = fileData.split('\n').map((line) => line.split(';'));
    // Remove the last line due to trailing \n
    nestedArrayData.pop();

    const roomDataArray: Room[] = [];

    for (const dataLine of nestedArrayData) {
        const id: string = dataLine[0];
        const vertices: Coord[] = [];
        for (let idx = 1; idx < dataLine.length; idx++) {
			const splitCoord = dataLine[idx].split(',')
            vertices.push([parseFloat(splitCoord[0]), parseFloat(splitCoord[1])]);
        }
        const roomPolygon: Polygon = new Polygon(vertices, [70, 70, 70, 0.4]);
        const roomData: Room = new Room(0, 0, roomPolygon, id);
        roomDataArray.push(roomData);
    }

    return roomDataArray;
}
