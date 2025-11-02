import { useState, useCallback, useRef } from "react";
import type { Graph, Vertex, Edge } from "../types/graph";

const MAX_HISTORY = 50; // Limit history to prevent memory issues

export function useGraph(initialGraph?: Graph) {
  const [graph, setGraph] = useState<Graph>(
    initialGraph || {
      vertices: [],
      edges: [],
      isDirected: false,
    }
  );

  // History management for undo/redo
  const [history, setHistory] = useState<Graph[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isUndoRedoAction = useRef(false);

  // Helper to push to history
  const pushToHistory = useCallback(
    (newGraph: Graph) => {
      if (isUndoRedoAction.current) {
        isUndoRedoAction.current = false;
        return;
      }

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newGraph)));
        // Keep only last MAX_HISTORY items
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
    },
    [historyIndex]
  );

  const addVertex = useCallback(
    (x: number, y: number) => {
      setGraph((prev) => {
        const newId = `v${prev.vertices.length}`;
        const newLabel = String.fromCharCode(65 + prev.vertices.length); // A, B, C, ...

        const newVertex: Vertex = {
          id: newId,
          label: newLabel,
          position: { x, y },
        };

        const newGraph = {
          ...prev,
          vertices: [...prev.vertices, newVertex],
        };

        pushToHistory(prev);
        return newGraph;
      });
    },
    [pushToHistory]
  );

  const addEdge = useCallback(
    (from: string, to: string) => {
      setGraph((prev) => {
        // Check if edge already exists
        const edgeExists = prev.edges.some(
          (e) => e.from === from && e.to === to
        );

        if (edgeExists) {
          return prev;
        }

        const newEdge: Edge = { from, to };

        const newGraph = {
          ...prev,
          edges: [...prev.edges, newEdge],
        };

        pushToHistory(prev);
        return newGraph;
      });
    },
    [pushToHistory]
  );

  const removeVertex = useCallback(
    (vertexId: string) => {
      setGraph((prev) => {
        const newGraph = {
          ...prev,
          vertices: prev.vertices.filter((v) => v.id !== vertexId),
          edges: prev.edges.filter(
            (e) => e.from !== vertexId && e.to !== vertexId
          ),
        };
        pushToHistory(prev);
        return newGraph;
      });
    },
    [pushToHistory]
  );

  const removeEdge = useCallback(
    (from: string, to: string) => {
      setGraph((prev) => {
        const newGraph = {
          ...prev,
          edges: prev.edges.filter((e) => !(e.from === from && e.to === to)),
        };
        pushToHistory(prev);
        return newGraph;
      });
    },
    [pushToHistory]
  );

  const toggleDirected = useCallback(() => {
    setGraph((prev) => {
      const newGraph = {
        ...prev,
        isDirected: !prev.isDirected,
      };
      pushToHistory(prev);
      return newGraph;
    });
  }, [pushToHistory]);

  const updateVertexPosition = useCallback(
    (vertexId: string, x: number, y: number) => {
      setGraph((prev) => ({
        ...prev,
        vertices: prev.vertices.map((v) =>
          v.id === vertexId ? { ...v, position: { x, y } } : v
        ),
      }));
    },
    []
  );

  const clearGraph = useCallback(() => {
    setGraph((prev) => {
      const newGraph = {
        vertices: [],
        edges: [],
        isDirected: prev.isDirected,
      };
      pushToHistory(prev);
      return newGraph;
    });
  }, [pushToHistory]);

  const importGraph = useCallback(
    (importedGraph: Graph) => {
      setGraph((prev) => {
        pushToHistory(prev);
        return importedGraph;
      });
    },
    [pushToHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevGraph = history[historyIndex - 1];
      setGraph(JSON.parse(JSON.stringify(prevGraph)));
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextGraph = history[historyIndex + 1];
      setGraph(JSON.parse(JSON.stringify(nextGraph)));
      setHistoryIndex((prev) => prev + 1);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    graph,
    addVertex,
    addEdge,
    removeVertex,
    removeEdge,
    updateVertexPosition,
    toggleDirected,
    clearGraph,
    importGraph,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
