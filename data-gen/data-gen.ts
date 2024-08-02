import { JSAStarCoordinate } from "@/app/lib/aStar/astar";

type GPSImport = [string, ...number[]];

export function parseDrawData(InptGPS: GPSImport[]): (number | string)[][] {
    let returnData: (number | string)[][] = [];
    InptGPS.forEach(surface => {
        if ((surface.length-1) % 2 == 1) return;
        returnData.push([...surface.slice(1), surface.length-1 == 4 ? "s" : "f"])
    })

    return returnData;
}

export function parseAStarSubGrid(InptGPS: GPSImport[]): number[] {
    let wholeGraph: number[] = []
    let xCoordArray: number[] = []
    let yCoordArray: number[] = []

    //Size Preparation
    InptGPS.forEach((val, idx) => {
        if (idx == 0) return;
        if (idx % 2 == 0 && idx != 0) {
            yCoordArray.push(val as unknown as number);
        } else {
            xCoordArray.push(val as unknown as number);
        }
    })

    let xSize: number = Math.max(...xCoordArray) - Math.min(...xCoordArray);
    let ySize: number = Math.max(...yCoordArray) - Math.min(...yCoordArray);
    const floatMult: number = Math.max(
        xSize.toString().split(".").length == 1 ? 1 : xSize.toString().split(".")[1].length,
        ySize.toString().split(".").length == 1 ? 1 : ySize.toString().split(".")[1].length
    )
    xSize = xSize.toString().split(".").length == 1 ? xSize : xSize * (Math.pow(10, floatMult))
    ySize = ySize.toString().split(".").length == 1 ? ySize : ySize * (Math.pow(10, floatMult))
    wholeGraph.push(xSize, ySize, ...Array(xSize*ySize).fill(1));

    return wholeGraph
}
