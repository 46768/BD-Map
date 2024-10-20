import { aStar } from '@/mod/algorithm/astar/astar';

import type { PathData } from '@/mod/algorithm/parserTools/pathTools';
import type { LineData, PointData } from '@/mod/display/map/renderer/def';

export function generatePathObjects(
    graph: PathData,
    source: number,
    target: number
): [LineData[], PointData[]] {
    const [nodes, neighbors] = graph;
    console.log(nodes);
    console.log(neighbors);
    const pathFound = aStar(nodes, neighbors, source, target);
    console.log(pathFound);
    if (pathFound.length <= 0) return [[], []];

    const lines: LineData[] = [];
    const points: PointData[] = [
        [nodes[target], 5, [23, 224, 255, 1], { zLayer: 4, tag: 'pathfind-obj' }],
    ];

    for (let i = 0; i < pathFound.length - 1; i++) {
        lines.push([
            nodes[pathFound[i]],
            nodes[pathFound[i + 1]],
            [23, 224, 255, 1],
            2,
            { zLayer: 4, tag: 'pathfind-obj' },
        ]);
        points.push([
            nodes[pathFound[i]],
            5,
            [23, 224, 255, 1],
            { zLayer: 4, tag: 'pathfind-obj' },
        ]);
    }

    console.log([lines, points]);
    return [lines, points];
}
