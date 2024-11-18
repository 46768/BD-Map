import { Polygon } from '@/mod/data/polygon/polygon';
import { Room } from '@/mod/data/room/room';
import { coordToString, stringToCoord } from '@/mod/data/com/vertex';

import type { PathData, Nodes, Neighbors } from './pathTools';
import type { Coord, Color } from '@/mod/data/com/vertex';

export function parseMappyCSV(fileData: string) {
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
        const roomData: Room = new Room(0, 1, roomPolygon, id);
        roomDataArray.push(roomData);
    }

    return roomDataArray;
}

export function generatePathFileData([nodes, neighbors]: PathData): string {
    if (nodes.length !== neighbors.length) {
        console.error('invalid nodes and neighbors data');
        return '';
    }
    const fileData: string[] = [];
    for (let i = 0; i < nodes.length; i++) {
        const [nodeCoord, nodeNeighbors] = [nodes[i], neighbors[i]];
        fileData.push([coordToString(nodeCoord), ...nodeNeighbors].join('|'));
    }

    return fileData.join('/');
}

export function parsePathFileData(fileData: string): PathData {
    const nodeNeighborsPairs: string[] = fileData.split('/');
    const nodeNeighborsData: string[][] = nodeNeighborsPairs.map((pairs) => pairs.split('|'));
    const nodeCoords: Nodes = nodeNeighborsData.map((data) => stringToCoord(data[0]));
    const neighbors: Neighbors = nodeNeighborsData.map((data) =>
        data.slice(1).map((nebor) => parseInt(nebor))
    );
    return [nodeCoords, neighbors];
}

export function generateRoomFileData(rooms: Room[]): string {
    const fileData: string[] = [];
    for (let room of rooms) {
        const roomData: string[] = [`${room.id}`, `${room.floor}`, `${room.roomCode}`];
        const roomAliases: string[] = room.alias;
        const polygonVertices = room.polygon.vertices;
        const polygonColor = room.polygon.color;

        roomData.push(roomAliases.join(';'));
        roomData.push(polygonVertices.map((coord) => coord.join(':')).join(';'));
        roomData.push(polygonColor.join(';'));
        fileData.push(roomData.join('/'));
    }
    return fileData.join('>');
}

export function parseRoomFileData(fileData: string): Room[] {
    const roomStringData: string[] = fileData.split('>');
    const roomData: Room[] = [];

    for (let stringData of roomStringData) {
        const splittedString: string[] = stringData.split('/');
        const [id, floor, roomCode] = splittedString.slice(0, 3);
        const [aliases, vertices, color] = splittedString.slice(3, 6);
        const parsedVertices: Coord[] = vertices
            .split(';')
            .map((coord) => coord.split(':').map(parseFloat) as Coord);
        const parsedColor: Color = color.split(';').map(parseFloat) as Color;
        const parsedAliases: string[] = aliases.split(';');

        const constructedPolygon: Polygon = new Polygon(parsedVertices, parsedColor);
        const constructedRoom: Room = new Room(
            parseInt(roomCode),
            parseInt(floor),
            constructedPolygon,
            id
        );
        if (aliases !== '') constructedRoom.updateAlias(parsedAliases);
        roomData.push(constructedRoom);
    }

    return roomData;
}

export function joinFileData(pathData: string, roomData: string): string {
    return pathData.concat('[[]]', roomData);
}

// whole data is path and room data joined together
export function parseWholeData(wholeData: string): [PathData, Room[]] {
    const [pathData, roomData] = wholeData.split('[[]]') as [string, string];
    return [parsePathFileData(pathData), parseRoomFileData(roomData)];
}
