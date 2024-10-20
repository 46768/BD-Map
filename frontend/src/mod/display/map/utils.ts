import type { LineData } from './renderer/def';
import type { Color } from '@/mod/data/com/vertex';

export function generateDivider(lineGap: number) {
    const lineData: LineData[] = [];
    const dividerColor: Color = [20, 20, 20, 0.2];
    const dividerThickness: number = 1;

    for (let x = 0; x < window.outerWidth + lineGap; x += lineGap) {
        lineData.push([
            [x, -lineGap],
            [x, window.outerHeight + lineGap],
            dividerColor,
            dividerThickness,
            { zLayer: 0, tag: 'divider', repeating: lineGap },
        ]);
    }
    for (let y = 0; y < window.outerHeight + lineGap; y += lineGap) {
        lineData.push([
            [-lineGap, y],
            [window.outerWidth + lineGap, y],
            dividerColor,
            dividerThickness,
            { zLayer: 0, tag: 'divider', repeating: lineGap },
        ]);
    }

    return lineData;
}
