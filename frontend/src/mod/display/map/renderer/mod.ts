import type { Closure, ClosureConfig, ClosureOptions } from './def';
import type { Coord, Color } from '@/mod/data/com/vertex';
import { Polygon } from '@/mod/data/polygon/polygon';
import { colorToCSS } from '@/utils/dataConverter';
/**
 * Canvas renderer component
 */
export class Renderer {
    public _objectBuffer: Closure[][] = [];
    public _background: Color = [255, 255, 255, 1];
    public _closureOption: ClosureOptions = {
        coordinateOffset: [0, 0],
        canvasSize: [window.innerWidth, window.innerHeight],
    };
    /**
     * Construct a renderer with object caching
     * @param {CanvasRenderingContext2D} _context - canvas 2d context for drawing
     */
    constructor(public _context: CanvasRenderingContext2D) {
        this._context.canvas.width = this._closureOption.canvasSize[0];
        this._context.canvas.height = this._closureOption.canvasSize[1];
    }

    /**
     * Inset a closure at a z layer
     * @param {Closure} object - a closure to insert
     * @param {number} zLayer - the layer to insert to
     */
    _insertObject(object: Closure, zLayer: number): void {
        if (!this._objectBuffer[zLayer]) this._objectBuffer[zLayer] = [];
        this._objectBuffer[zLayer].push(object);
    }

    /**
     * Create a line object and insert into object buffer
     * @param {Coord} start - start of the line
     * @param {Coord} end - end of the line
     * @param {Color} color - color of the line
     * @param {number} thickness - thickness of the line
     * @param {ClosureConfig} options - options of the object
     */
    createLine(start: Coord, end: Coord, color: Color, thickness: number, options: ClosureConfig) {
        const [sx, sy]: Coord = start;
        const [ex, ey]: Coord = end;
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = options.static
                ? [0, 0]
                : options.repeating
                  ? [
                        opts.coordinateOffset[0] % options.repeating,
                        opts.coordinateOffset[1] % options.repeating,
                    ]
                  : opts.coordinateOffset;
            ctx.strokeStyle = colorToCSS(color);
            ctx.lineWidth = thickness;
            ctx.beginPath();
            ctx.moveTo(sx + offX, sy + offY);
            ctx.lineTo(ex + offX, ey + offY);
            ctx.stroke();
        }, options.zLayer);
    }

    /**
     * Create a dot object and insert into object buffer
     * @param {Coord} pos - position of the dot
     * @param {number} radius - radius of the dot
     * @param {Color} color - color of the dot
     * @param {ClosureConfig} options - options of the object
     */
    createDot(pos: Coord, radius: number, color: Color, options: ClosureConfig) {
        const [x, y]: Coord = pos;
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = options.static
                ? [0, 0]
                : options.repeating
                  ? [
                        opts.coordinateOffset[0] % opts.canvasSize[0],
                        opts.coordinateOffset[1] % opts.canvasSize[1],
                    ]
                  : opts.coordinateOffset;
            ctx.fillStyle = colorToCSS(color);
            ctx.beginPath();
            ctx.arc(x + offX, y + offY, radius, 0, Math.PI * 2);
            ctx.fill();
        }, options.zLayer);
    }

    /**
     * Create a polygon object and insert into object buffer
     * @param {Polygon} poly - the polygon
     * @param {Color} color - color of the polygon
     * @param {ClosureConfig} options - options of the object
     */
    createPolygon(poly: Polygon, color: Color, options: ClosureConfig) {
        const vertices: Coord[] = poly.vertices();
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = options.static
                ? [0, 0]
                : options.repeating
                  ? [
                        opts.coordinateOffset[0] % opts.canvasSize[0],
                        opts.coordinateOffset[1] % opts.canvasSize[1],
                    ]
                  : opts.coordinateOffset;
            const [xBegin, yBegin] = vertices[0];
            ctx.fillStyle = colorToCSS(color);
            ctx.beginPath();
            ctx.moveTo(xBegin + offX, yBegin + offY);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i][0] + offX, vertices[i][1] + offY);
            }
            ctx.closePath();
            ctx.fill();
            if (poly.highlighted()) {
                ctx.strokeStyle = 'rgba(39, 153, 230, 1)';
                ctx.lineWidth = 5;
                ctx.stroke();
            }
        }, options.zLayer);
    }

    /**
     * Create a polygon outline object and insert into object buffer
     * @param {Polygon} poly - the polygon to create an outline
     * @param {Color} color - color of the outline
     * @param {ClosureConfig} options - options of the object
     */
    createOutline(poly: Polygon, color: Color, options: ClosureConfig) {
        const vertices: Coord[] = poly.vertices();
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = options.static
                ? [0, 0]
                : options.repeating
                  ? [
                        opts.coordinateOffset[0] % opts.canvasSize[0],
                        opts.coordinateOffset[1] % opts.canvasSize[1],
                    ]
                  : opts.coordinateOffset;
            const [xBegin, yBegin] = vertices[0];
            ctx.strokeStyle = colorToCSS(color);
            ctx.beginPath();
            ctx.moveTo(xBegin + offX, yBegin + offY);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i][0] + offX, vertices[i][1] + offY);
            }
            ctx.closePath();
            ctx.stroke();
        }, options.zLayer);
    }

    /**
     * Create a line object and insert into object buffer
     * @param {string} text - the text to render
     * @param {Coord} pos - position of the text
     * @param {ClosureConfig} options - options of the object
     */
    createText(text: string, pos: Coord, options: ClosureConfig) {
        const [x, y]: Coord = pos;
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = options.static
                ? [0, 0]
                : options.repeating
                  ? [
                        opts.coordinateOffset[0] % opts.canvasSize[0],
                        opts.coordinateOffset[1] % opts.canvasSize[1],
                    ]
                  : opts.coordinateOffset;
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillText(text, x + offX, y + offY);
        }, options.zLayer);
    }

    /**
     * Render a frame from object buffer
     */
    render() {
        const [sx, sy] = this._closureOption.canvasSize;
        const objects = this._objectBuffer;
        const ctx = this._context;
        const opts = this._closureOption;
        ctx.clearRect(0, 0, sx, sy);
        ctx.fillStyle = colorToCSS(this._background);
        ctx.fillRect(0, 0, sx, sy);
        for (const zLayer of objects) {
            for (const obj of zLayer) {
                obj(ctx, opts);
            }
        }
    }

    backgroundColor(newColor?: Color) {
        if (newColor) this._background = newColor;
        return this._background;
    }

    /**
     * Update coordinate offset
     * @param {Coord} newOffset - new set of coordinate for offset
     */
    updateOffset(newOffset: Coord) {
        this._closureOption.coordinateOffset = newOffset;
    }

    /**
     * Update canvas size
     * @param {Coord} newSize - new set of size
     */
    updateSize(newSize: Coord) {
        this._closureOption.canvasSize = newSize;
        this._context.canvas.width = newSize[0];
        this._context.canvas.height = newSize[1];
    }
}
