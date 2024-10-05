import { isBehindLine } from '@/components/utils/math'

export class Polygon {

	static blank = new Polygon("blank", -1, [0,0,0,0], [0,0])

	_BoundingBox: number[]
	_Highlighted: boolean
	constructor(public _ID: string, public _Layer: number, public _Color: number[], public _Vertices: number[]) {
		//x coordinates are stored in even indices, y coordinates are stored in odd indices
		const xCoords = this._Vertices.filter((_, idx) => !(idx & 1))
		const yCoords = this._Vertices.filter((_, idx) => (idx & 1))
		this._BoundingBox = [Math.min(...xCoords), Math.max(...xCoords), Math.min(...yCoords), Math.max(...yCoords)]
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

	set vertices(newVertices: number[]) {
		if (newVertices.length & 1) {
			console.error(`setting vertices of ${this._ID} with an invalid vertices, ${newVertices.length} Vertices Provided, Need Even Amount`)
		}
		this._Vertices = newVertices
		//x coordinates are stored in even indices, y coordinates are stored in odd indices
		const xCoords: number[] = newVertices.filter((_, idx) => !(idx & 1))
		const yCoords: number[] = newVertices.filter((_, idx) => (idx & 1))
		this._BoundingBox = [Math.min(...xCoords), Math.max(...xCoords), Math.min(...yCoords), Math.max(...yCoords)]
	}

	set highlighted(isHighlighted: boolean) {
		this._Highlighted = isHighlighted
	}

	/**
	 * Check if this polygon is overlapping the given coordinate
	 * @param {Number} x - x coordinate
	 * @param {Number} y - y coordinate
	 * @returns {Boolean} true if is overlapping, false otherwise
	*/
	isOverlapping(x: number, y: number): boolean {
		const Vertices: number[] = this._Vertices
		let overlap: boolean = false
		let prevIdx: number = (Vertices.length>>1)-1
		for (let vertIdx = 0; vertIdx < Vertices.length>>1; vertIdx++) {
			const xi: number = Vertices[vertIdx<<1]
			const xj: number = Vertices[prevIdx<<1]
			const yi: number = Vertices[(vertIdx<<1)+1]
			const yj: number = Vertices[(prevIdx<<1)+1]
			const slope: number = (xj-xi)/(yj-yi)
			//y is between yi and yj if its not larger or smaller than both of them
			if (isBehindLine(x, y, slope, yi-(slope*xi)) && ((yj>y) !== (yi>y))) overlap = !overlap
			prevIdx = vertIdx
		}
		return overlap
	}
}
