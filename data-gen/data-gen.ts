import { JSAStarCoordinate } from "@/app/lib/aStar/astar";

export type SurfaceData = number[];

export function parseDrawData(InptGPS: number[]): SurfaceData[] {
  let returnData: SurfaceData[] = [];
  let currentSection: number = 0;
  let markerCount: number = InptGPS[currentSection];
  let nextSection: number = currentSection + 1 + markerCount * 2;

  const slicedSection: number[] = InptGPS.slice(currentSection+1, nextSection);
  while (nextSection < InptGPS.length) {
     returnData.push(slicedSection)
  }
  return returnData;
}

export function parseMainBus(MainBusPoint: number[][]): {
  graph: number[]
  translation: number[][]
} {
   let graph: number[] = [15, Math.ceil(MainBusPoint.length / 4), ...Array(15*Math.ceil(MainBusPoint.length / 4)).fill(0)]
   let translation: number[][] = []

   MainBusPoint.forEach((point, idx) => {
    graph[] 
   });
}
