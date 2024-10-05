import { Polygon } from '@/components/map/polygon.class/main'

export type Line = [number, number, number, number, number, number, number, number]

export class Renderer {
	context?: CanvasRenderingContext2D
	objectArray: Polygon[] = []
	lineArray: Line[] = []
	backgroundColor: number[]

	constructor(bgColor: number[]) {
		this.backgroundColor = bgColor
	}

	fillPolygon(poly: Polygon, colorOverride?: number[]) {
		if (!this.context) {
			console.warn("Renderer Have No Canvas Context")
			return
		}
		const [r, g, b, a] = colorOverride ?? poly.color
		const vertices = poly.vertices
		const x1 = vertices[0], y1 = vertices[1]
		const ctx = this.context
		
		ctx.fillStyle = `rgba(${r},${g},${b},${a})`
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		for (let idx = 1; idx < vertices.length>>1; idx++) {
			const x = vertices[2*idx], y = vertices[(2*idx)+1]
			ctx.lineTo(x, y)
		}
		ctx.closePath()
		ctx.fill()
	}

	strokePolygon(poly: Polygon, strokeSize: number, colorOverride?: number[]) {
		if (!this.context) {
			console.warn("Renderer Have No Canvas Context")
			return
		}
		const [r, g, b, a] = colorOverride ?? poly.color
		const vertices = poly.vertices
		const x1 = vertices[0], y1 = vertices[1]
		const ctx = this.context
		
		ctx.strokeStyle = `rgba(${r},${g},${b},${a})`
		ctx.lineWidth = strokeSize
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		for (let idx = 1; idx < vertices.length>>1; idx++) {
			const x = vertices[2*idx], y = vertices[(2*idx)+1]
			ctx.lineTo(x, y)
		}
		ctx.closePath()
		ctx.stroke()
	}

	strokeLine(line: Line) {
		if (!this.context) {
			console.warn("Renderer Have No Canvas Context")
			return
		}
		const ctx = this.context
		const [xi, yi, xj ,yj, r, g, b, a] = line
		ctx.strokeStyle = `rgba(${r},${g},${b},${a})`
		ctx.beginPath()
		ctx.moveTo(xi, yi)
		ctx.lineTo(xj, yj)
		ctx.stroke()
	}

	render() {
		if (!this.context) {
			console.warn("Renderer Have No Canvas Context")
			return
		}
		const ctx = this.context
		const [bgR, bgG, bgB] = this.backgroundColor
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		for (let poly of this.objectArray) {
			this.fillPolygon(poly)
			if (poly.highlighted) this.strokePolygon(poly, 5, [39, 153, 230, 1])
		}

		for (let line of this.lineArray) {
			this.strokeLine(line)
		}
	}

	attachContext(ctx: CanvasRenderingContext2D) {
		this.context = ctx
	}

	editBGColor(r: number, g: number, b: number) {
		this.backgroundColor = [r, g, b]
	}
}
