import type { Graph } from "../types/graph";

/**
 * Depth First Search traversal
 */
export function dfs(graph: Graph, startVertexId: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function dfsHelper(vertexId: string) {
    visited.add(vertexId);
    result.push(vertexId);

    const edges = graph.edges.filter((e) => e.from === vertexId);

    for (const edge of edges) {
      if (!visited.has(edge.to)) {
        dfsHelper(edge.to);
      }
    }
  }

  dfsHelper(startVertexId);
  return result;
}

/**
 * Breadth First Search traversal
 */
export function bfs(graph: Graph, startVertexId: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [startVertexId];
  const result: string[] = [];

  visited.add(startVertexId);

  while (queue.length > 0) {
    const vertexId = queue.shift()!;
    result.push(vertexId);

    const edges = graph.edges.filter((e) => e.from === vertexId);

    for (const edge of edges) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }
    }
  }

  return result;
}

/**
 * Get neighbors of a vertex
 */
export function getNeighbors(graph: Graph, vertexId: string): string[] {
  const neighbors: string[] = [];

  graph.edges.forEach((edge) => {
    if (edge.from === vertexId) {
      neighbors.push(edge.to);
    }
    if (!graph.isDirected && edge.to === vertexId) {
      neighbors.push(edge.from);
    }
  });

  return neighbors;
}

/**
 * Check if graph is connected
 */
export function isConnected(graph: Graph): boolean {
  if (graph.vertices.length === 0) return true;

  const visited = new Set<string>();
  const queue: string[] = [graph.vertices[0].id];
  visited.add(graph.vertices[0].id);

  while (queue.length > 0) {
    const vertexId = queue.shift()!;
    const neighbors = getNeighbors(graph, vertexId);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return visited.size === graph.vertices.length;
}

/**
 * Detect if graph has a cycle
 */
export function hasCycle(graph: Graph): boolean {
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycleHelper(vertexId: string): boolean {
    visited.add(vertexId);
    recStack.add(vertexId);

    const edges = graph.edges.filter((e) => e.from === vertexId);

    for (const edge of edges) {
      if (!visited.has(edge.to)) {
        if (hasCycleHelper(edge.to)) {
          return true;
        }
      } else if (recStack.has(edge.to)) {
        return true;
      }
    }

    recStack.delete(vertexId);
    return false;
  }

  for (const vertex of graph.vertices) {
    if (!visited.has(vertex.id)) {
      if (hasCycleHelper(vertex.id)) {
        return true;
      }
    }
  }

  return false;
}
