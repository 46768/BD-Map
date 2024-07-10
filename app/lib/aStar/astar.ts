import * as lib_rust from "lib-rust.a-star";

export interface JSAStarCoordinate {
  x: number;
  y: number;
}

export default function AStar (
  Graph: Int32Array,
  SizeX: number,
  SizeY: number,
  StartingNode: lib_rust.AStarCoordinate,
  TargetNode: lib_rust.AStarCoordinate
): JSAStarCoordinate[] {
  let FullBuffer = new Int32Array(2+Graph.length)
  FullBuffer.set([SizeX, SizeY])
  FullBuffer.set(Graph, 2)
  const result: lib_rust.AStarCoordinate[] = lib_rust.a_star(
    FullBuffer,
    StartingNode,
    TargetNode
  );
  return result.map((rustAstar) => {
    return { x: rustAstar[0], y: rustAstar[1] };
  });
}
