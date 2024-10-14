import type { Coord } from '@/mod/data/com/vertex';

export interface MapDisplayElement extends HTMLCanvasElement {
    callRender(): void;
    canvasOffset: Coord;
}
