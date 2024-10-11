import { Polygon } from '@/mod/data/polygon/polygon';

export class Room {
    public _alias: string[] = [];
    constructor(
        public _roomCode: number,
        public _floor: number,
        public _polygon: Polygon
    ) {}

    addAlias(alias: string) {
        this._alias.push(alias);
    }

    removeAlias(alias: string) {
        this._alias = this._alias.filter((ali) => ali !== alias);
    }

    alias(): string[] {
        return this._alias;
    }

    roomCode(newCode?: number): number {
        if (newCode) this._roomCode = newCode;
        return this._roomCode;
    }

    floor(newFloor?: number): number {
        if (newFloor) this._floor = newFloor;
        return this._floor;
    }

    polygon(): Polygon {
        return this._polygon;
    }
}
