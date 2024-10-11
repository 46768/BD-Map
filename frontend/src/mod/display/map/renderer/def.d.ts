import type { Coord, Color } from '@/mod/data/com/vertex';

export interface ClosureOptions {
    coordinateOffset: Coord;
    canvasSize: Coord;
}
export interface ClosureConfig {
    zLayer: number;
    static?: boolean;
    repeating?: number;
}
export type Closure = (ctx: CanvasRenderingContext2D, options: closureOptions) => void;

export type LineData = [Coord, Coord, Color, number, ClosureConfig];
