import { useState } from "react";
import Header from "./components/Header";
import GraphCanvas from "./components/GraphCanvas";
import ControlPanel from "./components/ControlPanel";
import RepresentationView from "./components/RepresentationView";
import AlgorithmController from "./components/AlgorithmController";
import { useGraph } from "./hooks/useGraph";
import { useDFS } from "./hooks/useDFS";
import type { AlgorithmType } from "./types/algorithm";

function App() {
  const {
    graph,
    addVertex,
    addEdge,
    toggleDirected,
    clearGraph,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useGraph();

  const [selectedVertices, setSelectedVertices] = useState<string[]>([]);
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>(null);
  const [startVertex, setStartVertex] = useState<string | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [showAlgorithmController, setShowAlgorithmController] = useState(false);

  // DFS Hook
  const dfs = useDFS({
    graph,
    startVertexId: startVertex,
    animationSpeed,
  });

  const handleCanvasClick = (x: number, y: number) => {
    addVertex(x, y);
    setSelectedVertices([]);
  };

  const handleVertexClick = (vertexId: string) => {
    setSelectedVertices((prev) => {
      const newSelection = [...prev, vertexId];

      // If two vertices are selected, create an edge
      if (newSelection.length === 2) {
        addEdge(newSelection[0], newSelection[1]);
        return [];
      }

      return newSelection;
    });
  };

  const handleAddVertex = () => {
    // Add vertex at random position
    const x = Math.random() * 700 + 50;
    const y = Math.random() * 400 + 50;
    addVertex(x, y);
  };

  const handleAddEdge = () => {
    alert(
      "Click on two vertices in the canvas to create an edge between them."
    );
    setSelectedVertices([]);
  };

  const handleRunDFS = () => {
    if (graph.vertices.length === 0) {
      alert("Please add some vertices to the graph first!");
      return;
    }
    setAlgorithmType("DFS");
    setStartVertex(graph.vertices[0].id);
    setShowAlgorithmController(true);
  };

  const handleRunBFS = () => {
    alert("BFS algorithm will be implemented in future updates!");
  };

  const handleAlgorithmChange = (algorithm: AlgorithmType) => {
    setAlgorithmType(algorithm);
    dfs.reset();
  };

  const handleStartVertexChange = (vertexId: string | null) => {
    setStartVertex(vertexId);
    dfs.reset();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header
        studentName="Saumy Bhargava"
        rollNumber="2024UCA1877"
        projectTitle="Graph Playground - DAA Project"
      />

      <main className="flex-1 container mx-auto px-6 py-4 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-10rem)]">
          {/* Left Column - Canvas */}
          <div className="col-span-8 space-y-3 overflow-y-auto">
            <GraphCanvas
              graph={graph}
              onVertexClick={handleVertexClick}
              onCanvasClick={handleCanvasClick}
              vertexStates={
                showAlgorithmController
                  ? dfs.visualizationState.vertexStates
                  : undefined
              }
              highlightedEdges={
                showAlgorithmController
                  ? dfs.visualizationState.highlightedEdges
                  : undefined
              }
            />
            {selectedVertices.length > 0 && !showAlgorithmController && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {selectedVertices.length === 1
                    ? "Click another vertex to create an edge"
                    : "Creating edge..."}
                </p>
              </div>
            )}
            {showAlgorithmController && (
              <div className="bg-white/80 backdrop-blur-sm border-2 border-border rounded-lg p-3 shadow-sm">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Vertex States Legend
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-800"></div>
                    <span className="text-sm">Unvisited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-700"></div>
                    <span className="text-sm">In Stack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-900"></div>
                    <span className="text-sm">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-700"></div>
                    <span className="text-sm">Visited</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Controls and Representation */}
          <div className="col-span-4 overflow-y-auto pr-2">
            <div className="space-y-4 pb-4">
              {!showAlgorithmController ? (
                <>
                  <ControlPanel
                    isDirected={graph.isDirected}
                    onToggleDirected={toggleDirected}
                    onAddVertex={handleAddVertex}
                    onAddEdge={handleAddEdge}
                    onClearGraph={clearGraph}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onRunDFS={handleRunDFS}
                    onRunBFS={handleRunBFS}
                  />

                  <RepresentationView graph={graph} />
                </>
              ) : (
                <AlgorithmController
                  graph={graph}
                  algorithmType={algorithmType}
                  onAlgorithmChange={handleAlgorithmChange}
                  startVertex={startVertex}
                  onStartVertexChange={handleStartVertexChange}
                  animationSpeed={animationSpeed}
                  onSpeedChange={setAnimationSpeed}
                  status={dfs.status}
                  currentStep={dfs.visualizationState.currentStep}
                  totalSteps={dfs.visualizationState.totalSteps}
                  description={dfs.visualizationState.description}
                  stack={dfs.visualizationState.stack}
                  visited={dfs.visualizationState.visited}
                  onStart={dfs.start}
                  onPause={dfs.pause}
                  onResume={dfs.resume}
                  onNextStep={dfs.nextStep}
                  onPreviousStep={dfs.previousStep}
                  onReset={() => {
                    dfs.reset();
                    setShowAlgorithmController(false);
                    setAlgorithmType(null);
                    setStartVertex(null);
                  }}
                  canStepForward={dfs.canStepForward}
                  canStepBackward={dfs.canStepBackward}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="container mx-auto px-6 py-2 text-center text-muted-foreground text-xs">
          <p className="flex items-center justify-center gap-2">
            <span>Design and Analysis of Algorithms Project ©</span>
            <span className="font-semibold text-foreground">
              {new Date().getFullYear()}
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
