import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import GraphCanvas from "./components/GraphCanvas";
import ControlPanel from "./components/ControlPanel";
import RepresentationView from "./components/RepresentationView";
import { useGraph } from "./hooks/useGraph";
import type { Graph } from "./types/graph";

type InteractionMode = "normal" | "adding-edge" | "canvas-add";

function App() {
  const {
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
  } = useGraph();

  const [selectedVertices, setSelectedVertices] = useState<string[]>([]);
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("normal");
  const [notification, setNotification] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Show notification helper
  const showNotification = useCallback((message: string, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  }, []);

  // Load demo graph function
  const loadDemoGraph = useCallback(() => {
    const demoGraph: Graph = {
      vertices: [
        { id: "v0", label: "A", position: { x: 150, y: 150 } },
        { id: "v1", label: "B", position: { x: 400, y: 100 } },
        { id: "v2", label: "C", position: { x: 650, y: 150 } },
        { id: "v3", label: "D", position: { x: 550, y: 350 } },
        { id: "v4", label: "E", position: { x: 250, y: 350 } },
      ],
      edges: [
        { from: "v0", to: "v1" },
        { from: "v1", to: "v2" },
        { from: "v0", to: "v4" },
        { from: "v4", to: "v3" },
        { from: "v2", to: "v3" },
        { from: "v1", to: "v3" },
      ],
      isDirected: false,
    };
    importGraph(demoGraph);
    showNotification("✓ Demo graph loaded! Try exploring the features");
    setShowWelcome(false);
  }, [importGraph, showNotification]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Help modal: ? or F1
      if ((e.key === "?" || e.key === "F1") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelpModal((prev) => !prev);
      }
      // Undo: Ctrl+Z or Cmd+Z
      else if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
          showNotification("↶ Undone");
        }
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z or Ctrl+Shift+Z
      else if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        if (canRedo) {
          redo();
          showNotification("↷ Redone");
        }
      }
      // Toggle directed: D key
      else if (e.key === "d" && !e.ctrlKey && !e.metaKey) {
        toggleDirected();
        showNotification(
          graph.isDirected
            ? "↔ Switched to Undirected"
            : "→ Switched to Directed"
        );
      }
      // Escape: Cancel current action
      else if (e.key === "Escape") {
        setSelectedVertices([]);
        setInteractionMode("normal");
        setShowHelpModal(false);
        setShowWelcome(false);
        showNotification("✕ Action cancelled");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    toggleDirected,
    graph.isDirected,
    showNotification,
  ]);

  // Handle canvas click
  const handleCanvasClick = (x: number, y: number) => {
    if (interactionMode === "canvas-add") {
      addVertex(x, y);
      showNotification(
        `✓ Vertex ${String.fromCharCode(65 + graph.vertices.length)} added`
      );
    } else if (selectedVertices.length > 0) {
      // Cancel edge creation if clicking empty space
      setSelectedVertices([]);
      setInteractionMode("normal");
    }
  };

  // Handle vertex click
  const handleVertexClick = (vertexId: string) => {
    if (interactionMode === "adding-edge" || selectedVertices.length > 0) {
      setSelectedVertices((prev) => {
        const newSelection = [...prev, vertexId];

        // If two vertices are selected, create an edge
        if (newSelection.length === 2) {
          const fromVertex = graph.vertices.find(
            (v) => v.id === newSelection[0]
          );
          const toVertex = graph.vertices.find((v) => v.id === newSelection[1]);

          if (fromVertex && toVertex) {
            // Check if edge already exists
            const edgeExists = graph.edges.some(
              (e) => e.from === newSelection[0] && e.to === newSelection[1]
            );

            if (edgeExists) {
              showNotification("⚠ Edge already exists!");
            } else {
              addEdge(newSelection[0], newSelection[1]);
              showNotification(
                `✓ Edge ${fromVertex.label} → ${toVertex.label} created`
              );
            }
          }

          setInteractionMode("normal");
          return [];
        }

        return newSelection;
      });
    }
  };

  // Handle vertex delete
  const handleVertexDelete = (vertexId: string) => {
    const vertex = graph.vertices.find((v) => v.id === vertexId);
    removeVertex(vertexId);
    setSelectedVertices([]);
    showNotification(`✓ Vertex ${vertex?.label} deleted`);
  };

  // Handle edge delete
  const handleEdgeDelete = (from: string, to: string) => {
    const fromVertex = graph.vertices.find((v) => v.id === from);
    const toVertex = graph.vertices.find((v) => v.id === to);
    removeEdge(from, to);
    showNotification(
      `✓ Edge ${fromVertex?.label} → ${toVertex?.label} deleted`
    );
  };

  // Handle vertex drag
  const handleVertexDrag = (vertexId: string, x: number, y: number) => {
    updateVertexPosition(vertexId, x, y);
  };

  // Add vertex button handler
  const handleAddVertex = () => {
    // Add vertex at random position within canvas bounds
    const canvasWidth = 800;
    const canvasHeight = 500;
    const padding = 50;

    const x = Math.random() * (canvasWidth - padding * 2) + padding;
    const y = Math.random() * (canvasHeight - padding * 2) + padding;

    addVertex(x, y);
    const newLabel = String.fromCharCode(65 + graph.vertices.length);
    showNotification(`✓ Vertex ${newLabel} added`);
  };

  // Add edge button handler
  const handleAddEdge = () => {
    if (graph.vertices.length < 2) {
      showNotification("⚠ Need at least 2 vertices to create an edge", 4000);
      return;
    }
    setInteractionMode("adding-edge");
    setSelectedVertices([]);
    showNotification("👆 Click two vertices to connect them", 5000);
  };

  // Clear graph handler
  const handleClearGraph = () => {
    clearGraph();
    setSelectedVertices([]);
    setInteractionMode("normal");
    showNotification("✓ Graph cleared");
  };

  // Import graph handler
  const handleImportGraph = (importedGraph: typeof graph) => {
    importGraph(importedGraph);
    setSelectedVertices([]);
    setInteractionMode("normal");
    showNotification(
      `✓ Graph imported: ${importedGraph.vertices.length} vertices, ${importedGraph.edges.length} edges`
    );
  };

  // Algorithm handlers (placeholders)
  const handleRunDFS = () => {
    showNotification("🚧 DFS algorithm coming soon!", 3000);
  };

  const handleRunBFS = () => {
    showNotification("🚧 BFS algorithm coming soon!", 3000);
  };

  const handleRunDijkstra = () => {
    showNotification("🚧 Dijkstra algorithm coming soon!", 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <Header
        studentName="Saumy Bhargava"
        rollNumber="2024UCA1877"
        projectTitle="Graph Playground - Interactive Visualizer"
      />

      {/* Welcome Modal */}
      {showWelcome && graph.vertices.length === 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to Graph Playground! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                An interactive tool for learning graph theory and data
                structures
              </p>

              <div className="grid md:grid-cols-2 gap-4 text-left mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    ✨ Quick Start
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click canvas to add vertices</li>
                    <li>• Use "Add Edge" to connect</li>
                    <li>• Drag vertices to rearrange</li>
                    <li>• Toggle directed/undirected</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    ⌨️ Shortcuts
                  </h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>
                      •{" "}
                      <kbd className="px-1.5 py-0.5 bg-white rounded border">
                        ?
                      </kbd>{" "}
                      Show all shortcuts
                    </li>
                    <li>
                      •{" "}
                      <kbd className="px-1.5 py-0.5 bg-white rounded border">
                        D
                      </kbd>{" "}
                      Toggle graph type
                    </li>
                    <li>
                      •{" "}
                      <kbd className="px-1.5 py-0.5 bg-white rounded border">
                        Ctrl+Z
                      </kbd>{" "}
                      Undo
                    </li>
                    <li>
                      •{" "}
                      <kbd className="px-1.5 py-0.5 bg-white rounded border">
                        Esc
                      </kbd>{" "}
                      Cancel action
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={loadDemoGraph}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Load Demo Graph
                </button>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Start from Scratch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Keyboard Shortcuts & Help
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Graph Operations
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <ShortcutItem
                    shortcut="Click Canvas"
                    description="Add vertex at position"
                  />
                  <ShortcutItem
                    shortcut="Drag Vertex"
                    description="Move vertex"
                  />
                  <ShortcutItem
                    shortcut="Right-Click Vertex"
                    description="Delete vertex"
                  />
                  <ShortcutItem
                    shortcut="Right-Click Edge"
                    description="Delete edge"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Keyboard Shortcuts
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <ShortcutItem
                    shortcut="Ctrl + Z"
                    description="Undo last action"
                  />
                  <ShortcutItem shortcut="Ctrl + Y" description="Redo action" />
                  <ShortcutItem
                    shortcut="D"
                    description="Toggle directed/undirected"
                  />
                  <ShortcutItem
                    shortcut="Esc"
                    description="Cancel current action"
                  />
                  <ShortcutItem
                    shortcut="? or F1"
                    description="Show this help"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Features
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      <strong>Adjacency Matrix & List:</strong> Real-time graph
                      representations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      <strong>Import/Export:</strong> Save and load graphs as
                      JSON
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      <strong>Undo/Redo:</strong> Up to 50 actions stored
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>
                      <strong>Directed & Undirected:</strong> Toggle graph type
                      anytime
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Pro Tip:</strong> Try creating different graph
                  patterns like trees, cycles, or complete graphs to understand
                  their representations better!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl border border-gray-700 flex items-center space-x-2">
            <span className="text-sm font-medium">{notification}</span>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Canvas */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Graph Canvas
                </h2>
                {interactionMode !== "normal" && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium border border-amber-300">
                    {interactionMode === "adding-edge"
                      ? "Select vertices to connect"
                      : "Click canvas to add vertex"}
                  </span>
                )}
              </div>
              <GraphCanvas
                graph={graph}
                selectedVertices={selectedVertices}
                onVertexClick={handleVertexClick}
                onVertexDelete={handleVertexDelete}
                onVertexDrag={handleVertexDrag}
                onEdgeDelete={handleEdgeDelete}
                onCanvasClick={handleCanvasClick}
              />
              <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded flex items-start space-x-2">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Quick Tips:</p>
                  <ul className="mt-1 space-y-0.5">
                    <li>• Click canvas to add vertices</li>
                    <li>• Drag vertices to reposition</li>
                    <li>• Right-click vertex/edge to delete</li>
                    <li>• Press 'D' to toggle directed/undirected</li>
                    <li>• Ctrl+Z to undo, Ctrl+Y to redo</li>
                    <li>• Esc to cancel current action</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Controls and Representation */}
          <div className="lg:col-span-4 space-y-6">
            <ControlPanel
              graph={graph}
              isDirected={graph.isDirected}
              onToggleDirected={toggleDirected}
              onAddVertex={handleAddVertex}
              onAddEdge={handleAddEdge}
              onClearGraph={handleClearGraph}
              onImportGraph={handleImportGraph}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              interactionMode={interactionMode}
              onRunDFS={handleRunDFS}
              onRunBFS={handleRunBFS}
              onRunDijkstra={handleRunDijkstra}
            />

            <RepresentationView graph={graph} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 shadow-inner mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p className="mb-2 md:mb-0">
              Design and Analysis of Algorithms Project ©{" "}
              {new Date().getFullYear()}
            </p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Interactive Graph Visualizer</span>
              </span>
              <span className="text-gray-400">•</span>
              <span>Built with React & TypeScript</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Help Button (Floating) */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-40 flex items-center justify-center"
        title="Keyboard Shortcuts (Press ?)"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        kbd {
          font-family: monospace;
          font-size: 0.875em;
        }
      `}</style>
    </div>
  );
}

// Helper component for keyboard shortcuts
function ShortcutItem({
  shortcut,
  description,
}: {
  shortcut: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm font-semibold text-gray-800">
        {shortcut}
      </kbd>
      <span className="text-sm text-gray-600 ml-3">{description}</span>
    </div>
  );
}

export default App;
