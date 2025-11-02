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
 * Generate adjacency matrix from graph
 * Returns a 2D array where matrix[i][j] = 1 if there's an edge from vertex i to vertex j
 */
export function generateAdjacencyMatrix(graph: Graph): number[][] {
  const n = graph.vertices.length;

  // Initialize n x n matrix with zeros
  const matrix: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  // Fill matrix based on edges
  graph.edges.forEach((edge) => {
    const fromIndex = graph.vertices.findIndex((v) => v.id === edge.from);
    const toIndex = graph.vertices.findIndex((v) => v.id === edge.to);

    if (fromIndex !== -1 && toIndex !== -1) {
      matrix[fromIndex][toIndex] = 1;
      // For undirected graphs, mark both directions
      if (!graph.isDirected) {
        matrix[toIndex][fromIndex] = 1;
      }
    }
  });

  return matrix;
}

/**
 * Generate adjacency list from graph
 * Returns a map of vertex labels to their neighbor labels
 */
export function generateAdjacencyList(graph: Graph): Record<string, string[]> {
  const adjList: Record<string, string[]> = {};

  // Initialize empty list for each vertex
  graph.vertices.forEach((vertex) => {
    adjList[vertex.label] = [];
  });

  // Populate adjacency list based on edges
  graph.edges.forEach((edge) => {
    const fromVertex = graph.vertices.find((v) => v.id === edge.from);
    const toVertex = graph.vertices.find((v) => v.id === edge.to);

    if (fromVertex && toVertex) {
      adjList[fromVertex.label].push(toVertex.label);
      // For undirected graphs, add reverse edge
      if (!graph.isDirected && fromVertex.id !== toVertex.id) {
        adjList[toVertex.label].push(fromVertex.label);
      }
    }
  });

  // Sort neighbor lists for consistent display
  Object.keys(adjList).forEach((vertex) => {
    adjList[vertex].sort();
  });

  return adjList;
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
