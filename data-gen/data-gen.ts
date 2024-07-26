import { JSAStarCoordinate } from "@/app/lib/aStar/astar";

export type SurfaceData = number[];

export function parseDrawData(InptGPS: number[]) {
  let returnData: SurfaceData[] = [];
  let currentSection: number = 0;
  let markerCount: number = InptGPS[currentSection];
  let nextSection: number = currentSection + 1 + markerCount * 2;

  const slicedSection: number[] = InptGPS.slice(currentSection+1, nextSection);
  while (nextSection < InptGPS.length) {
     returnData.push(slicedSection)
  }
}

export function parseMainBus(MainBusPoint: number[][]) {
  
}
