import { isBehindLine } from '@/components/utils/math'
import { deepCopyArray } from '@/components/utils/array'

type coord = [number, number]

export class Polygon {

	static blank = new Polygon("blank", -1, [0,0,0,0], [[0,0]])

	_BoundingBox: coord[]
	_Highlighted: boolean
	_Alias: string[] = []
	_RoomCode: number = 0
	constructor(public _ID: string, public _Layer: number, public _Color: number[], public _Vertices: coord[]) {
		const xCoords = this._Vertices.map(coord => coord[0])
		const yCoords = this._Vertices.map(coord => coord[1])
		this._BoundingBox = [[Math.min(...xCoords), Math.max(...xCoords)], [Math.min(...yCoords), Math.max(...yCoords)]]
		this._Highlighted = false
	}

	get id() {
		return this._ID
	}

	get layer() {
		return this._Layer
	}

	get color() {
		return this._Color
	}

	get vertices() {
		return this._Vertices
	}

	get highlighted() {
		return this._Highlighted
	}

	get boundingBox() {
		return this._BoundingBox
	}

	get alias() {
		return this._Alias
	}

	get roomCode() {
		return this._RoomCode
	}

	set id(newID: string) {
		this._ID = newID
	}
		
	set layer(newLayer: number) {
		this._Layer = newLayer
	}

	set color(newColor: number[]) {
		if (newColor.length !== 4) {
			console.error(`setting color of ${this._ID} with an invalid color, ${newColor.length} RGBA property provided`)
			return
		}
		this._Color = newColor
	}

	set vertices(newVertices: coord[]) {
		this._Vertices = newVertices
		//x coordinates are stored in even indices, y coordinates are stored in odd indices
		const xCoords = this._Vertices.map(coord => coord[0])
		const yCoords = this._Vertices.map(coord => coord[1])
		this._BoundingBox = [[Math.min(...xCoords), Math.max(...xCoords)], [Math.min(...yCoords), Math.max(...yCoords)]]
	}

	set highlighted(isHighlighted: boolean) {
		this._Highlighted = isHighlighted
	}

	set alias(newAliases: string[]) {
		this._Alias = newAliases
	}

	set roomCode(newCode: number) {
		this._RoomCode = newCode
	}

	addAlias(alias: string) {
		this._Alias.push(alias)
	}

	removeAlias(alias: string) {
		this._Alias = this._Alias.filter(ali => ali !== alias)
	}

	/**
	 * Check if this polygon is overlapping the given coordinate
	 * @param {Number} x - x coordinate
	 * @param {Number} y - y coordinate
	 * @returns {Boolean} true if is overlapping, false otherwise
	*/
	isOverlapping(x: number, y: number): boolean {
		const boundingBox: coord[] = this._BoundingBox
		if ((boundingBox[0][0]>x)===(boundingBox[0][1]>x)) return false
		if ((boundingBox[1][0]>y)===(boundingBox[1][1]>y)) return false
		const Vertices: coord[] = this._Vertices
		let overlap: boolean = false
		let prevIdx: number = Vertices.length-1
		for (let vertIdx = 0; vertIdx < Vertices.length; vertIdx++) {
			const xi = Vertices[vertIdx][0], yi = Vertices[vertIdx][1]
			const xj = Vertices[prevIdx][0], yj = Vertices[prevIdx][1]
			if (xj===xi) {
				if (x < xi) overlap = !overlap
				prevIdx = vertIdx
				continue
			}
			if (yj===yi) {
				prevIdx = vertIdx
				continue
			}
			const slope = (yj-yi)/(xj-xi)
			//y is between yi and yj if its not larger or smaller than both of them
			const intersecting = isBehindLine(x, y, slope, yi-(slope*xi)) && ((yi>y) !== (yj>y))
			if (intersecting) overlap = !overlap
			prevIdx = vertIdx
		}
		return overlap
	}

	refresh() {
		const newVertices = this._Vertices
		this.vertices = newVertices
	}

	/**
	 * prune for vertices that is a part of an edge that can be formed from less vertices
	*/
	pruneVertices() {
		const cV: coord[] = this._Vertices
		let nV: coord[] = deepCopyArray(cV)
		let prev2Idx: number = cV.length-2
		let prev1Idx: number = cV.length-1
		for (let vertIdx = 0; vertIdx < cV.length-2; vertIdx++) {
			const xi = cV[prev2Idx][0], xj = cV[prev1Idx][0], xk = cV[vertIdx][0]
			const yi = cV[prev2Idx][1], yj = cV[prev1Idx][1], yk = cV[vertIdx][1]
			if (xi === xj && xj === xk) {
				nV = nV.filter((_, idx) => idx !== prev1Idx)
				console.log(`pruning vertex ${prev1Idx+1} on ${this.id}`)
			} else if (yi === yj && yj === yk) {
				nV = nV.filter((_, idx) => idx !== prev1Idx)
				console.log(`pruning vertex ${prev1Idx+1} on ${this.id}`)
			} else {
				const slope1 = (yj-yi)/(xj-xi)
				const slope2 = (yk-yi)/(xk-xi)

				if (slope1 === slope2) {
					nV = nV.filter((_, idx) => idx !== prev1Idx)
					console.log(`pruning vertex ${prev1Idx+1} on ${this.id}`)
				}
			}

			prev2Idx = prev1Idx
			prev1Idx = vertIdx
		}
		this.vertices = nV
	}

	addVertex(coord: coord) {
		this._Vertices.push(coord)
		this.refresh()
	}

	removeVertex(index: number) {
		this.vertices = this.vertices.filter((_, idx) => idx !== index)
	}
}
