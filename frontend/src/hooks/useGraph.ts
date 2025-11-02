import { useState, useCallback } from "react";
import type { Graph, Vertex, Edge } from "../types/graph";

export function useGraph(initialGraph?: Graph) {
  const [graph, setGraph] = useState<Graph>(
    initialGraph || {
      vertices: [],
      edges: [],
      isDirected: false,
    }
  );

  const addVertex = useCallback((x: number, y: number) => {
    setGraph((prev) => {
      const newId = `v${prev.vertices.length}`;
      const newLabel = String.fromCharCode(65 + prev.vertices.length); // A, B, C, ...

      const newVertex: Vertex = {
        id: newId,
        label: newLabel,
        position: { x, y },
      };

      return {
        ...prev,
        vertices: [...prev.vertices, newVertex],
      };
    });
  }, []);

  const addEdge = useCallback((from: string, to: string) => {
    setGraph((prev) => {
      // Check if edge already exists
      const edgeExists = prev.edges.some((e) => e.from === from && e.to === to);

      if (edgeExists) {
        return prev;
      }

      const newEdge: Edge = { from, to };

      return {
        ...prev,
        edges: [...prev.edges, newEdge],
      };
    });
  }, []);

  const removeVertex = useCallback((vertexId: string) => {
    setGraph((prev) => ({
      ...prev,
      vertices: prev.vertices.filter((v) => v.id !== vertexId),
      edges: prev.edges.filter((e) => e.from !== vertexId && e.to !== vertexId),
    }));
  }, []);

  const removeEdge = useCallback((from: string, to: string) => {
    setGraph((prev) => ({
      ...prev,
      edges: prev.edges.filter((e) => !(e.from === from && e.to === to)),
    }));
  }, []);

  const toggleDirected = useCallback(() => {
    setGraph((prev) => ({
      ...prev,
      isDirected: !prev.isDirected,
    }));
  }, []);

  const clearGraph = useCallback(() => {
    setGraph({
      vertices: [],
      edges: [],
      isDirected: graph.isDirected,
    });
  }, [graph.isDirected]);

  return {
    graph,
    addVertex,
    addEdge,
    removeVertex,
    removeEdge,
    toggleDirected,
    clearGraph,
  };
}
