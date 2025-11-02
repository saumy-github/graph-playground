import { useState, useRef } from "react";
import type { Graph } from "../types/graph";
import { exportGraphToJSON, importGraphFromJSON } from "../utils";

interface ControlPanelProps {
  graph: Graph;
  isDirected: boolean;
  onToggleDirected: () => void;
  onAddVertex: () => void;
  onAddEdge: () => void;
  onClearGraph: () => void;
  onImportGraph: (graph: Graph) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  interactionMode?: string;
  onRunDFS?: () => void;
  onRunBFS?: () => void;
  onRunDijkstra?: () => void;
}

export default function ControlPanel({
  graph,
  isDirected,
  onToggleDirected,
  onAddVertex,
  onAddEdge,
  onClearGraph,
  onImportGraph,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  interactionMode = "normal",
  onRunDFS,
  onRunBFS,
  onRunDijkstra,
}: ControlPanelProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get next vertex label
  const getNextVertexLabel = () => {
    return String.fromCharCode(65 + graph.vertices.length);
  };

  // Handle export
  const handleExport = () => {
    try {
      const jsonString = exportGraphToJSON(graph);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `graph-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export graph");
    }
  };

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedGraph = importGraphFromJSON(content);
        onImportGraph(importedGraph);
        setImportError(null);
      } catch (error) {
        setImportError(
          error instanceof Error ? error.message : "Failed to import graph"
        );
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be imported again
    event.target.value = "";
  };

  // Handle clear with confirmation
  const handleClearClick = () => {
    if (graph.vertices.length === 0) {
      return;
    }
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    onClearGraph();
    setShowClearConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Control Panel</h2>
        {interactionMode !== "normal" && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            {interactionMode}
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Statistics Dashboard */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Graph Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-md p-2 shadow-sm">
              <p className="text-xs text-gray-600">Vertices</p>
              <p className="text-2xl font-bold text-indigo-600">
                {graph.vertices.length}
              </p>
            </div>
            <div className="bg-white rounded-md p-2 shadow-sm">
              <p className="text-xs text-gray-600">Edges</p>
              <p className="text-2xl font-bold text-green-600">
                {graph.edges.length}
              </p>
            </div>
          </div>
        </div>

        {/* Graph Type Toggle */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Graph Type
          </h3>
          <button
            onClick={onToggleDirected}
            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
              isDirected
                ? "border-blue-500 bg-blue-50 hover:bg-blue-100"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  isDirected ? "bg-blue-600" : "bg-gray-400"
                }`}
              >
                {isDirected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="font-medium text-gray-800">
                {isDirected ? "Directed" : "Undirected"}
              </span>
            </div>
            <span className="text-xl">{isDirected ? "→" : "↔"}</span>
          </button>
        </div>

        {/* Graph Operations */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Graph Operations
          </h3>
          <div className="space-y-2">
            <button
              onClick={onAddVertex}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              title="Add new vertex (A, B, C...)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Add Vertex</span>
              <span className="bg-blue-800 text-xs px-2 py-0.5 rounded">
                {getNextVertexLabel()}
              </span>
            </button>

            <button
              onClick={onAddEdge}
              disabled={graph.vertices.length < 2}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              title="Click two vertices to connect"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Add Edge</span>
            </button>
          </div>
        </div>

        {/* History Controls */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">History</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm"
              title="Undo (Ctrl+Z)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Undo</span>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm"
              title="Redo (Ctrl+Y)"
            >
              <span>Redo</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* File Operations */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            File Operations
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              disabled={graph.vertices.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              title="Export graph as JSON"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Export JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              title="Import graph from JSON"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Import JSON</span>
            </button>

            {importError && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {importError}
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Danger Zone
          </h3>

          {!showClearConfirm ? (
            <button
              onClick={handleClearClick}
              disabled={graph.vertices.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Clear Graph</span>
            </button>
          ) : (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3">
              <p className="text-sm text-red-800 font-medium mb-2">
                Are you sure? This cannot be undone!
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={confirmClear}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded text-sm"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Algorithms (Optional) */}
        {(onRunDFS || onRunBFS || onRunDijkstra) && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Algorithms (Coming Soon)
            </h3>
            <div className="space-y-2 opacity-60">
              {onRunDFS && (
                <button
                  onClick={onRunDFS}
                  disabled
                  className="w-full bg-purple-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed text-sm"
                >
                  Run DFS
                </button>
              )}
              {onRunBFS && (
                <button
                  onClick={onRunBFS}
                  disabled
                  className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed text-sm"
                >
                  Run BFS
                </button>
              )}
              {onRunDijkstra && (
                <button
                  onClick={onRunDijkstra}
                  disabled
                  className="w-full bg-orange-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed text-sm"
                >
                  Run Dijkstra
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
