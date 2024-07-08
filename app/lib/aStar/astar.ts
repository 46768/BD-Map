import * as lib_rust from "lib-rust";

export interface JSAStarCoordinate {
  x: number;
  y: number;
}

export default function AStar (
  Graph: Int32Array,
  StartingNode: lib_rust.AStarCoordinate,
  TargetNode: lib_rust.AStarCoordinate
): JSAStarCoordinate[] {
  const result: lib_rust.AStarCoordinate[] = lib_rust.a_star(
    Graph,
    StartingNode,
    TargetNode
  );
  return result.map((rustAstar) => {
    return { x: rustAstar[0], y: rustAstar[1] };
  });
}
