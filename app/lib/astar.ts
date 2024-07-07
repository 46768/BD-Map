import init, { a_star, AStarCoordinate } from "@/public/pkg/lib_rust";

let initialized: boolean = false;
export async function initializeWasm() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

export default async function AStar(
  Graph: Int32Array,
  StartingNode: AStarCoordinate,
  TargetNode: AStarCoordinate
) {
  return a_star(Graph, StartingNode, TargetNode);
}
