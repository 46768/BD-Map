import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import { getPolygonEdges, validatePolygonTouching } from './polygonTools';

import type { Line } from './polygonTools';

export function lineToString(line: Line): string {
    return line.join(',');
}

export function stringToLine(lineStr: string): Line {
    const [slope, base] = lineStr.split(',');
    return [slope === 'false' ? false : parseFloat(slope), parseFloat(base)];
}

export function getTouchingRooms(roomArray: Room[]): [string, string][] {
    const roomRecord: Record<string, Room> = {};
    const slopeRecord: Record<number, Set<string>> = {};
    const verticalRecord: Record<number, Set<string>> = {};

    const returnArray: [string, string][] = [];

    for (const room of roomArray) {
        const roomID: string = room.id;
        const roomPoly: Polygon = room.polygon;
        const polyEdges: Line[] = getPolygonEdges(roomPoly);

        roomRecord[roomID] = room;
        for (const edge of polyEdges) {
            let record: Record<string, Set<string>> = verticalRecord;
            let edgeKey: number = edge[1];
            if (typeof edge[0] === 'number') {
                record = slopeRecord;
                edgeKey = edge[0];
            }
            if (!record.hasOwnProperty(edgeKey)) {
                record[edgeKey] = new Set<string>([roomID]);
            } else {
                record[edgeKey].add(roomID);
            }
        }
    }

    const checked: Record<string, Set<string>> = {};

    function checkRoomList(roomList: Set<string>) {
        const roomIDArray: string[] = Array.from(roomList);
        for (let i = 0; i < roomIDArray.length - 1; i++) {
            for (let j = i + 1; j < roomIDArray.length; j++) {
                const id1: string = roomIDArray[i];
                const id2: string = roomIDArray[j];
                if (validatePolygonTouching(roomRecord[id1].polygon, roomRecord[id2].polygon)) {
                    if (!checked.hasOwnProperty(id1)) checked[id1] = new Set<string>();
                    if (!checked.hasOwnProperty(id2)) checked[id2] = new Set<string>();
                    checked[id1].add(id2);
                    checked[id2].add(id1);
                }
            }
        }
    }

    for (const roomList of Object.values(slopeRecord)) {
        if (roomList.size <= 1) continue;
        checkRoomList(roomList);
    }
    for (const roomList of Object.values(verticalRecord)) {
        if (roomList.size <= 1) continue;
        checkRoomList(roomList);
    }

	const insertedMap: Map<string, string> = new Map<string, string>()
    for (const [key, value] of Object.entries(checked)) {
        for (const roomID of value) {
			if (insertedMap.get(roomID) === key) continue;
            returnArray.push([key, roomID]);
			insertedMap.set(key, roomID);
        }
    }

    return returnArray;
}
