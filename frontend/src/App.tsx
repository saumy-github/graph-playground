import { useState } from "react";
import Header from "./components/Header";
import GraphCanvas from "./components/GraphCanvas";
import ControlPanel from "./components/ControlPanel";
import RepresentationView from "./components/RepresentationView";
import { useGraph } from "./hooks/useGraph";

function App() {
  const { graph, addVertex, addEdge, toggleDirected, clearGraph } = useGraph();

  const [selectedVertices, setSelectedVertices] = useState<string[]>([]);

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
    alert("DFS algorithm will be implemented here!");
  };

  const handleRunBFS = () => {
    alert("BFS algorithm will be implemented here!");
  };

  const handleRunDijkstra = () => {
    alert("Dijkstra algorithm will be implemented here!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header
        studentName="Saumy Bhargava"
        rollNumber="2024UCA1877"
        projectTitle="Graph Playground - DAA Project"
      />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Left Column - Canvas */}
          <div className="col-span-8 space-y-4">
            <GraphCanvas
              graph={graph}
              onVertexClick={handleVertexClick}
              onCanvasClick={handleCanvasClick}
            />
            {selectedVertices.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {selectedVertices.length === 1
                    ? "Click another vertex to create an edge"
                    : "Creating edge..."}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Controls and Representation */}
          <div className="col-span-4 space-y-6">
            <ControlPanel
              isDirected={graph.isDirected}
              onToggleDirected={toggleDirected}
              onAddVertex={handleAddVertex}
              onAddEdge={handleAddEdge}
              onClearGraph={clearGraph}
              onRunDFS={handleRunDFS}
              onRunBFS={handleRunBFS}
              onRunDijkstra={handleRunDijkstra}
            />

            <RepresentationView graph={graph} />
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-border mt-8 shadow-lg">
        <div className="container mx-auto px-6 py-4 text-center text-muted-foreground text-sm">
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
