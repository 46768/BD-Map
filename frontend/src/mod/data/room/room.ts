import { Polygon } from '@/mod/data/polygon/polygon';

export class Room {
    static blank = new Room(-1, -1, Polygon.blank, '');

    public alias: string[] = [];
	public tag: Set<string> = new Set<string>();
    constructor(
        public roomCode: number,
        public floor: number,
        public readonly polygon: Polygon,
        public readonly id: string
    ) {}

    updateCode(newCode: number) {
        this.roomCode = newCode;
    }

    updateFloor(newFloor: number) {
        this.floor = newFloor;
    }


    addAlias(alias: string) {
        this.alias.push(alias);
    }
    removeAlias(aliasIdx: number) {
        this.alias = this.alias.filter((_, idx) => idx !== aliasIdx);
    }
    updateAlias(newAlias: string[]) {
        this.alias = newAlias;
    }


	addTag(tag: string) {
		this.tag.add(tag);
	}
	removeTag(tag: string) {
		this.tag.delete(tag);
	}
	updateTag(newTags: Set<string>) {
		this.tag = newTags;
	}
}
