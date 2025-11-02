import type { Graph } from "../types/graph";
import type { DFSStep } from "../types/algorithm";

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
 * Step-by-step DFS generator for visualization
 * Returns an array of steps showing the complete DFS traversal
 */
export function* dfsStepGenerator(
  graph: Graph,
  startVertexId: string
): Generator<DFSStep, void, unknown> {
  const visited = new Set<string>();
  const stack: string[] = [startVertexId];
  let stepNumber = 0;

  // Initial step - push start vertex
  yield {
    stepNumber: stepNumber++,
    action: "push",
    currentVertex: startVertexId,
    visitedVertices: new Set(visited),
    stack: [...stack],
    description: `Push start vertex ${getVertexLabel(
      graph,
      startVertexId
    )} onto stack`,
  };

  while (stack.length > 0) {
    const current = stack.pop()!;

    // If already visited, backtrack
    if (visited.has(current)) {
      yield {
        stepNumber: stepNumber++,
        action: "backtrack",
        currentVertex: current,
        visitedVertices: new Set(visited),
        stack: [...stack],
        description: `Backtrack from ${getVertexLabel(
          graph,
          current
        )} (already visited)`,
      };
      continue;
    }

    // Visit current vertex
    visited.add(current);
    yield {
      stepNumber: stepNumber++,
      action: "visit",
      currentVertex: current,
      visitedVertices: new Set(visited),
      stack: [...stack],
      description: `Visit vertex ${getVertexLabel(graph, current)}`,
    };

    // Get neighbors
    const neighbors = getNeighbors(graph, current);

    // Push unvisited neighbors onto stack (in reverse order for consistent traversal)
    const unvisitedNeighbors = neighbors
      .filter((n) => !visited.has(n))
      .reverse();

    for (const neighbor of unvisitedNeighbors) {
      stack.push(neighbor);
      yield {
        stepNumber: stepNumber++,
        action: "push",
        currentVertex: current,
        visitedVertices: new Set(visited),
        stack: [...stack],
        edge: { from: current, to: neighbor },
        description: `Push neighbor ${getVertexLabel(
          graph,
          neighbor
        )} onto stack`,
      };
    }

    // Pop step
    if (stack.length > 0) {
      yield {
        stepNumber: stepNumber++,
        action: "pop",
        currentVertex: stack[stack.length - 1],
        visitedVertices: new Set(visited),
        stack: [...stack],
        description: `Pop ${getVertexLabel(
          graph,
          stack[stack.length - 1]
        )} from stack`,
      };
    }
  }

  // Complete
  yield {
    stepNumber: stepNumber++,
    action: "complete",
    currentVertex: null,
    visitedVertices: new Set(visited),
    stack: [],
    description: `DFS Complete! Visited ${visited.size} vertices`,
  };
}

/**
 * Get complete DFS steps as an array
 */
export function getDFSSteps(graph: Graph, startVertexId: string): DFSStep[] {
  const steps: DFSStep[] = [];
  const generator = dfsStepGenerator(graph, startVertexId);

  for (const step of generator) {
    steps.push(step);
  }

  return steps;
}

/**
 * Get vertex label by ID
 */
function getVertexLabel(graph: Graph, vertexId: string): string {
  const vertex = graph.vertices.find((v) => v.id === vertexId);
  return vertex ? vertex.label : vertexId;
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
