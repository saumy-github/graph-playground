export interface Vertex {
  id: string;
  label: string;
  position: { x: number; y: number };
}

export interface Edge {
  from: string;
  to: string;
}

export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
  isDirected: boolean;
}
