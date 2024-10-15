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

    _getOffset(opts: ClosureOptions, options: ClosureConfig): Coord {
        if (options.static) {
            return [0, 0];
        }
        if (options.repeating) {
            return [
                opts.coordinateOffset[0] % options.repeating,
                opts.coordinateOffset[1] % options.repeating,
            ];
        }
        return opts.coordinateOffset;
    }

    createLine(start: Coord, end: Coord, color: Color, thickness: number, options: ClosureConfig) {
        const [sx, sy]: Coord = start;
        const [ex, ey]: Coord = end;
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = this._getOffset(opts, options);
            ctx.strokeStyle = colorToCSS(color);
            ctx.lineWidth = thickness;
            ctx.beginPath();
            ctx.moveTo(sx + offX, sy + offY);
            ctx.lineTo(ex + offX, ey + offY);
            ctx.stroke();
        }, options.zLayer);
    }

    createDot(pos: Coord, radius: number, color: Color, options: ClosureConfig) {
        const [x, y]: Coord = pos;
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = this._getOffset(opts, options);
            ctx.fillStyle = colorToCSS(color);
            ctx.beginPath();
            ctx.arc(x + offX, y + offY, radius, 0, Math.PI * 2);
            ctx.fill();
        }, options.zLayer);
    }

    createPolygon(poly: Polygon, color: Color, options: ClosureConfig) {
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const vertices: Coord[] = poly.vertices;
            const [[lx, ux], [ly, uy]] = poly.boundingBox;
            const [offX, offY] = this._getOffset(opts, options);
            const [xBegin, yBegin] = vertices[0];
            ctx.fillStyle = colorToCSS(color);
            ctx.beginPath();
            ctx.moveTo(xBegin + offX, yBegin + offY);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i][0] + offX, vertices[i][1] + offY);
            }
            ctx.closePath();
            ctx.fill();
            if (poly.highlighted) {
                ctx.strokeStyle = 'rgba(39, 153, 230, 1)';
                ctx.lineWidth = 5;
                ctx.stroke();
            }
            ctx.strokeStyle = 'rgb(0, 0, 0)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lx + offX, ly + offY);
            ctx.lineTo(lx + offX, uy + offY);
            ctx.lineTo(ux + offX, uy + offY);
            ctx.lineTo(ux + offX, ly + offY);
            ctx.closePath();
            ctx.stroke();
        }, options.zLayer);
    }

    createOutline(poly: Polygon, color: Color, options: ClosureConfig) {
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const vertices: Coord[] = poly.vertices;
            const [offX, offY] = this._getOffset(opts, options);
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

    createText(text: string, pos: Coord, options: ClosureConfig) {
        const [x, y]: Coord = pos;
        this._insertObject((ctx: CanvasRenderingContext2D, opts: ClosureOptions) => {
            const [offX, offY] = this._getOffset(opts, options);
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
