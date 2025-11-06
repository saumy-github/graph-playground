export type AlgorithmType = "DFS" | "BFS" | null;

export type AlgorithmStatus = "idle" | "running" | "paused" | "complete";

export type VertexState = "unvisited" | "visiting" | "visited" | "current";

export interface DFSStep {
  stepNumber: number;
  action: "push" | "pop" | "visit" | "backtrack" | "complete";
  currentVertex: string | null;
  visitedVertices: Set<string>;
  stack: string[];
  edge?: { from: string; to: string };
  description: string;
}

export interface AlgorithmVisualizationState {
  currentStep: number;
  totalSteps: number;
  vertexStates: Map<string, VertexState>;
  highlightedEdges: Set<string>;
  stack: string[];
  visited: Set<string>;
  description: string;
}
