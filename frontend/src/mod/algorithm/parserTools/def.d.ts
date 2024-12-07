import type { Coord } from '@/mod/data/com/vertex'
import { Room } from '@/mod/data/room/room'

export interface GPSMetadata {
	gpsOffset: Coord
	roomData: Room[]
}
