import type { Color } from '@/mod/data/com/vertex';

export const colorToCSS = (color: Color): string =>
    `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
