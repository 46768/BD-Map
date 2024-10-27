import { Room } from '@/mod/data/room/room'

export function searchTag(roomArray: Room[], searchingTag: string): Room[] {
	return roomArray.filter(room => room.tag.has(searchingTag));
}

export function searchAlias(roomArray: Room[], searchingAlias: string): Room[] {
	return roomArray.filter(room => room.alias.indexOf(searchingAlias) !== -1);
}
