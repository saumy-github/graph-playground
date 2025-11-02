import type { Graph } from "../types/graph";

/**
 * Export graph data to JSON
 */
export function exportGraphToJSON(graph: Graph): string {
  return JSON.stringify(graph, null, 2);
}

/**
 * Import graph data from JSON
 */
export function importGraphFromJSON(jsonString: string): Graph {
  try {
    const graph = JSON.parse(jsonString);

    // Validate structure
    if (!graph.vertices || !Array.isArray(graph.vertices)) {
      throw new Error("Invalid graph structure: missing vertices array");
    }
    if (!graph.edges || !Array.isArray(graph.edges)) {
      throw new Error("Invalid graph structure: missing edges array");
    }
    if (typeof graph.isDirected !== "boolean") {
      throw new Error("Invalid graph structure: isDirected must be boolean");
    }

    return graph as Graph;
  } catch (error) {
    throw new Error(
      `Failed to import graph: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Generate a random graph
 */
export function generateRandomGraph(
  numVertices: number,
  numEdges: number,
  isDirected: boolean = false,
  canvasWidth: number = 800,
  canvasHeight: number = 500
): Graph {
  const vertices = [];
  const edges = [];

  // Create vertices with random positions
  for (let i = 0; i < numVertices; i++) {
    vertices.push({
      id: `v${i}`,
      label: String.fromCharCode(65 + i),
      position: {
        x: Math.random() * (canvasWidth - 100) + 50,
        y: Math.random() * (canvasHeight - 100) + 50,
      },
    });
  }

  // Create random edges
  const maxPossibleEdges = isDirected
    ? numVertices * (numVertices - 1)
    : (numVertices * (numVertices - 1)) / 2;

  const actualEdges = Math.min(numEdges, maxPossibleEdges);
  const edgeSet = new Set<string>();

  while (edgeSet.size < actualEdges) {
    const from = Math.floor(Math.random() * numVertices);
    const to = Math.floor(Math.random() * numVertices);

    if (from !== to) {
      const edgeKey = isDirected
        ? `${from}-${to}`
        : [from, to].sort().join("-");

      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        edges.push({
          from: `v${from}`,
          to: `v${to}`,
        });
      }
    }
  }

  return {
    vertices,
    edges,
    isDirected,
  };
}
