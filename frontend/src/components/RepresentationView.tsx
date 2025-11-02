import { useState } from "react";
import type { Graph } from "../types/graph";
import { generateAdjacencyMatrix, generateAdjacencyList } from "../utils";

interface RepresentationViewProps {
  graph: Graph;
}

type ViewMode = "matrix" | "list";

export default function RepresentationView({ graph }: RepresentationViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("matrix");
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Generate data structures
  const matrix = generateAdjacencyMatrix(graph);
  const adjList = generateAdjacencyList(graph);

  // Handle empty graph
  const isEmpty = graph.vertices.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Graph Representations
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode === "matrix"
              ? "Matrix shows edge connections as 1s and 0s"
              : "List shows each vertex's neighbors"}
          </p>
        </div>

        {/* View Toggle Button */}
        <button
          onClick={() => setViewMode(viewMode === "matrix" ? "list" : "matrix")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isEmpty}
        >
          {viewMode === "matrix" ? "Show List View" : "Show Matrix View"}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {viewMode === "matrix" ? (
              <MatrixView
                graph={graph}
                matrix={matrix}
                hoveredCell={hoveredCell}
                onCellHover={setHoveredCell}
              />
            ) : (
              <ListView graph={graph} adjList={adjList} />
            )}
          </>
        )}
      </div>

      {/* Graph Statistics */}
      {!isEmpty && (
        <div className="border-t mt-6 pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Graph Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Vertices"
              value={graph.vertices.length}
              color="blue"
            />
            <StatCard label="Edges" value={graph.edges.length} color="green" />
            <StatCard
              label="Type"
              value={graph.isDirected ? "Directed" : "Undirected"}
              color="purple"
              isText
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Matrix View Component
interface MatrixViewProps {
  graph: Graph;
  matrix: number[][];
  hoveredCell: { row: number; col: number } | null;
  onCellHover: (cell: { row: number; col: number } | null) => void;
}

function MatrixView({
  graph,
  matrix,
  hoveredCell,
  onCellHover,
}: MatrixViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-700">
          Adjacency Matrix
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {graph.vertices.length}×{graph.vertices.length}
        </span>
      </div>

      <div className="overflow-auto max-h-[500px] border rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-indigo-50 to-purple-50 z-10">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-indigo-100 to-purple-100 sticky left-0 z-20">
                <div className="w-8 h-8 flex items-center justify-center">
                  ↓→
                </div>
              </th>
              {graph.vertices.map((v, index) => (
                <th
                  key={v.id}
                  className={`border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 min-w-[3rem] transition-colors ${
                    hoveredCell?.col === index
                      ? "bg-indigo-200"
                      : "bg-gradient-to-r from-indigo-50 to-purple-50"
                  }`}
                >
                  {v.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {graph.vertices.map((v, i) => (
              <tr
                key={v.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-indigo-100 to-purple-100 sticky left-0 z-10">
                  {v.label}
                </td>
                {matrix[i].map((val, j) => (
                  <td
                    key={j}
                    className={`border border-gray-300 px-3 py-2 text-center text-sm font-medium transition-all duration-150 cursor-default ${
                      hoveredCell?.row === i || hoveredCell?.col === j
                        ? "bg-indigo-100 scale-110"
                        : ""
                    } ${
                      val === 1
                        ? "text-green-700 bg-green-50 hover:bg-green-100"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    onMouseEnter={() => onCellHover({ row: i, col: j })}
                    onMouseLeave={() => onCellHover(null)}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        <p className="font-semibold mb-1">💡 How to read:</p>
        <p>
          Cell (i, j) = 1 means there's an edge from vertex i to vertex j.
          {!graph.isDirected && " For undirected graphs, matrix is symmetric."}
        </p>
      </div>
    </div>
  );
}

// List View Component
interface ListViewProps {
  graph: Graph;
  adjList: Record<string, string[]>;
}

function ListView({ graph, adjList }: ListViewProps) {
  const [hoveredVertex, setHoveredVertex] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-700">Adjacency List</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {graph.vertices.length} vertices
        </span>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 max-h-[500px] overflow-auto">
        <div className="space-y-2">
          {Object.entries(adjList).map(([vertex, neighbors]) => (
            <div
              key={vertex}
              className={`group p-3 rounded-md transition-all duration-200 ${
                hoveredVertex === vertex
                  ? "bg-white shadow-md scale-105 border-2 border-indigo-300"
                  : "bg-white/70 hover:bg-white hover:shadow-sm border border-gray-200"
              }`}
              onMouseEnter={() => setHoveredVertex(vertex)}
              onMouseLeave={() => setHoveredVertex(null)}
            >
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm mr-3 flex-shrink-0">
                  {vertex}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-700 font-medium mr-2">→</span>
                  {neighbors.length > 0 ? (
                    <div className="inline-flex flex-wrap gap-2">
                      {neighbors.map((neighbor, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300 transition-transform hover:scale-110"
                        >
                          {neighbor}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      [ empty ]
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-500">
                    ({neighbors.length} neighbor
                    {neighbors.length !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        <p className="font-semibold mb-1">💡 How to read:</p>
        <p>
          Each vertex lists all its neighbors (vertices it connects to).
          {!graph.isDirected &&
            " For undirected graphs, connections appear in both vertices."}
        </p>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No Graph Data
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        Start by adding vertices to the canvas. Representations will appear here
        automatically.
      </p>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number | string;
  color: "blue" | "green" | "purple";
  isText?: boolean;
}

function StatCard({ label, value, color, isText = false }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div
      className={`rounded-lg p-3 border ${colorClasses[color]} transition-transform hover:scale-105`}
    >
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p
        className={`font-bold ${colorClasses[color].split(" ")[1]} ${
          isText ? "text-base" : "text-2xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
