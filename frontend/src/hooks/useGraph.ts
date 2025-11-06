import { useState, useCallback, useEffect } from "react";
import type { Graph, Vertex, Edge } from "../types/graph";

export function useGraph(initialGraph?: Graph) {
  const [graph, setGraph] = useState<Graph>(
    initialGraph || {
      vertices: [],
      edges: [],
      isDirected: false,
    }
  );

  // History management for undo/redo
  const [history, setHistory] = useState<Graph[]>([graph]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Update history whenever graph changes
  useEffect(() => {
    // Only add to history if this is a new change (not from undo/redo)
    if (JSON.stringify(graph) !== JSON.stringify(history[historyIndex])) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(graph);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [graph]);

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

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGraph(history[newIndex]);
    }
  }, [historyIndex, history]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGraph(history[newIndex]);
    }
  }, [historyIndex, history]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Calculate whether undo/redo is available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    graph,
    addVertex,
    addEdge,
    removeVertex,
    removeEdge,
    toggleDirected,
    clearGraph,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
