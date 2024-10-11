import type { Coord, Color } from '@/mod/data/com/vertex';

/**
 * Polygon class for storing and making draw commands
 */
export class Polygon {
    /**
     * Construct a polygon
     * _vertices - array of vertices
     * _color - color of the polygon in RGBA
     * _boundingBox - bounding box of the polygon, used in hit detection
     * _drawCommand - draw command cache
     * @param {Coord[]} _vertices - vertices for the polygon, drawn in order from 0 to vertices.length-1
     * @param {Color} _color - color in RGBA for the polygon
     */
    public _boundingBox: [Coord, Coord];
    public _highlighted: boolean = false;

    constructor(
        public _vertices: Coord[],
        public _color: Color
    ) {
        const xCoord: number[] = _vertices.map((pos) => pos[0]);
        const yCoord: number[] = _vertices.map((pos) => pos[1]);
        const x: number = Math.min(...xCoord),
            y: number = Math.min(...yCoord),
            w: number = Math.max(...xCoord) - Math.min(...xCoord),
            h: number = Math.max(...yCoord) - Math.min(...yCoord);

        this._boundingBox = [
            [x, y],
            [w, h],
        ];
    }

    /**
     * Return the vertices
     * @param {Coord[]} newVertices - If provided replace the vertices with the new one and recalculate the bounding box
     * @return {Coord[]} current/new vertices of the polygon
     */
    vertices(newVertices?: Coord[]): Coord[] {
        if (newVertices) {
            this._vertices = newVertices;

            const xCoord: number[] = newVertices.map((pos) => pos[0]);
            const yCoord: number[] = newVertices.map((pos) => pos[1]);
            const x: number = Math.min(...xCoord),
                y: number = Math.min(...yCoord),
                w: number = Math.max(...xCoord) - Math.min(...xCoord),
                h: number = Math.max(...yCoord) - Math.min(...yCoord);

            this._boundingBox = [
                [x, y],
                [w, h],
            ];
        }
        return this._vertices;
    }

    /**
     * Return the color
     * @param {Color} newColor - If provided replace the color with the new one
     * @return {Color} current/new color of the polygon
     */
    color(newColor?: Color): Color {
        if (newColor) this._color = newColor;
        return this._color;
    }

    /**
     * Return the bounding box
     * @return {[Coord, Coord]} current bounding box of the polygon
     */
    getBoundingBox(): [Coord, Coord] {
        return this._boundingBox;
    }

    /**
     * Return true if the polygon is highlighted
     * @param {boolean} isHighlighted - If provdided replace the current one with this one
     * @return {boolean} true if polygon is highlighted, false otherwise
     */
    highlighted(isHighlighted?: boolean): boolean {
        if (isHighlighted) this._highlighted = isHighlighted;
        return this._highlighted;
    }
}
