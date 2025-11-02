import { useState, useRef, useCallback } from "react";
import type { Graph, Vertex, Edge } from "../types/graph";

interface GraphCanvasProps {
  graph: Graph;
  selectedVertices?: string[];
  onVertexClick?: (vertexId: string) => void;
  onVertexDelete?: (vertexId: string) => void;
  onVertexDrag?: (vertexId: string, x: number, y: number) => void;
  onEdgeDelete?: (from: string, to: string) => void;
  onCanvasClick?: (x: number, y: number) => void;
}

const VERTEX_RADIUS = 24;
const EDGE_HIT_TOLERANCE = 8;

export default function GraphCanvas({
  graph,
  selectedVertices = [],
  onVertexClick,
  onVertexDelete,
  onVertexDrag,
  onEdgeDelete,
  onCanvasClick,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredVertex, setHoveredVertex] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [draggedVertex, setDraggedVertex] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [previewEdge, setPreviewEdge] = useState<{
    from: Vertex;
    x: number;
    y: number;
  } | null>(null);

  // Get SVG coordinates from mouse event
  const getSVGCoordinates = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  // Check if point is near a vertex
  const getVertexAtPoint = useCallback(
    (x: number, y: number): Vertex | null => {
      return (
        graph.vertices.find((v) => {
          const dx = v.position.x - x;
          const dy = v.position.y - y;
          return Math.sqrt(dx * dx + dy * dy) <= VERTEX_RADIUS;
        }) || null
      );
    },
    [graph.vertices]
  );

  // Check if point is near an edge
  const getEdgeAtPoint = useCallback(
    (x: number, y: number): { from: string; to: string } | null => {
      for (const edge of graph.edges) {
        const fromVertex = graph.vertices.find((v) => v.id === edge.from);
        const toVertex = graph.vertices.find((v) => v.id === edge.to);

        if (!fromVertex || !toVertex) continue;

        // Calculate distance from point to line segment
        const x1 = fromVertex.position.x;
        const y1 = fromVertex.position.y;
        const x2 = toVertex.position.x;
        const y2 = toVertex.position.y;

        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;

        if (param < 0) {
          xx = x1;
          yy = y1;
        } else if (param > 1) {
          xx = x2;
          yy = y2;
        } else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= EDGE_HIT_TOLERANCE) {
          return { from: edge.from, to: edge.to };
        }
      }
      return null;
    },
    [graph.edges, graph.vertices]
  );

  // Handle mouse down on SVG
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only left click

    const { x, y } = getSVGCoordinates(e);
    const vertex = getVertexAtPoint(x, y);

    if (vertex) {
      // Start dragging
      setDraggedVertex(vertex.id);
      setDragOffset({
        x: x - vertex.position.x,
        y: y - vertex.position.y,
      });
      e.preventDefault();
    }
  };

  // Handle mouse move on SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = getSVGCoordinates(e);

    // Handle dragging
    if (draggedVertex) {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;
      onVertexDrag?.(draggedVertex, newX, newY);
      return;
    }

    // Show preview edge when a vertex is selected
    if (selectedVertices.length === 1) {
      const fromVertex = graph.vertices.find(
        (v) => v.id === selectedVertices[0]
      );
      if (fromVertex) {
        setPreviewEdge({ from: fromVertex, x, y });
      }
    } else {
      setPreviewEdge(null);
    }

    // Handle hover states
    const vertex = getVertexAtPoint(x, y);
    setHoveredVertex(vertex?.id || null);

    if (!vertex) {
      const edge = getEdgeAtPoint(x, y);
      setHoveredEdge(edge);
    } else {
      setHoveredEdge(null);
    }
  };

  // Handle mouse up on SVG
  const handleMouseUp = () => {
    setDraggedVertex(null);
  };

  // Handle click on SVG
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = getSVGCoordinates(e);
    const vertex = getVertexAtPoint(x, y);

    if (vertex) {
      onVertexClick?.(vertex.id);
    } else {
      // Click on empty space - add new vertex
      onCanvasClick?.(x, y);
    }
  };

  // Handle right click (context menu)
  const handleContextMenu = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    const { x, y } = getSVGCoordinates(e);

    // Check for vertex deletion
    const vertex = getVertexAtPoint(x, y);
    if (vertex) {
      onVertexDelete?.(vertex.id);
      return;
    }

    // Check for edge deletion
    const edge = getEdgeAtPoint(x, y);
    if (edge) {
      onEdgeDelete?.(edge.from, edge.to);
    }
  };

  // Calculate arrow points for directed edges
  const getArrowPoints = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): string => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLength = 12;
    const arrowAngle = Math.PI / 6;

    // Position arrow at the edge of the target vertex
    const arrowBaseX = x2 - VERTEX_RADIUS * Math.cos(angle);
    const arrowBaseY = y2 - VERTEX_RADIUS * Math.sin(angle);

    const point1X = arrowBaseX - arrowLength * Math.cos(angle - arrowAngle);
    const point1Y = arrowBaseY - arrowLength * Math.sin(angle - arrowAngle);
    const point2X = arrowBaseX - arrowLength * Math.cos(angle + arrowAngle);
    const point2Y = arrowBaseY - arrowLength * Math.sin(angle + arrowAngle);

    return `${arrowBaseX},${arrowBaseY} ${point1X},${point1Y} ${point2X},${point2Y}`;
  };

  // Render an edge
  const renderEdge = (edge: Edge) => {
    const fromVertex = graph.vertices.find((v) => v.id === edge.from);
    const toVertex = graph.vertices.find((v) => v.id === edge.to);

    if (!fromVertex || !toVertex) return null;

    const isHovered =
      hoveredEdge?.from === edge.from && hoveredEdge?.to === edge.to;
    const x1 = fromVertex.position.x;
    const y1 = fromVertex.position.y;
    const x2 = toVertex.position.x;
    const y2 = toVertex.position.y;

    // Calculate edge endpoint to stop at vertex boundary
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const endX = x2 - VERTEX_RADIUS * Math.cos(angle);
    const endY = y2 - VERTEX_RADIUS * Math.sin(angle);
    const startX = x1 + VERTEX_RADIUS * Math.cos(angle);
    const startY = y1 + VERTEX_RADIUS * Math.sin(angle);

    return (
      <g key={`${edge.from}-${edge.to}`}>
        {/* Invisible thick line for easier clicking */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="transparent"
          strokeWidth={EDGE_HIT_TOLERANCE * 2}
          className="cursor-pointer"
        />
        {/* Visible edge line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={isHovered ? "#ef4444" : "#64748b"}
          strokeWidth={isHovered ? 3 : 2}
          className="transition-all duration-200"
        />
        {/* Arrow for directed graphs */}
        {graph.isDirected && (
          <polygon
            points={getArrowPoints(x1, y1, x2, y2)}
            fill={isHovered ? "#ef4444" : "#64748b"}
            className="transition-all duration-200"
          />
        )}
      </g>
    );
  };

  // Render a vertex
  const renderVertex = (vertex: Vertex) => {
    const isSelected = selectedVertices.includes(vertex.id);
    const isHovered = hoveredVertex === vertex.id;
    const isDragging = draggedVertex === vertex.id;

    return (
      <g key={vertex.id} className="cursor-pointer">
        {/* Hover/Selection ring */}
        {(isSelected || isHovered) && (
          <circle
            cx={vertex.position.x}
            cy={vertex.position.y}
            r={VERTEX_RADIUS + 4}
            fill="none"
            stroke={isSelected ? "#3b82f6" : "#60a5fa"}
            strokeWidth={3}
            className="transition-all duration-200"
          />
        )}
        {/* Vertex circle */}
        <circle
          cx={vertex.position.x}
          cy={vertex.position.y}
          r={VERTEX_RADIUS}
          fill={isDragging ? "#2563eb" : isHovered ? "#60a5fa" : "#3b82f6"}
          stroke="#1e40af"
          strokeWidth={2}
          className="transition-all duration-200"
        />
        {/* Vertex label */}
        <text
          x={vertex.position.x}
          y={vertex.position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          className="select-none pointer-events-none"
        >
          {vertex.label}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Graph Canvas</h2>
        <div className="text-sm text-gray-600 space-x-4">
          <span className="inline-flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            Click to add
          </span>
          <span className="inline-flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-1"></span>
            Right-click to delete
          </span>
        </div>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height="500"
        className="border-2 border-gray-300 rounded bg-gray-50 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {/* Render edges first (behind vertices) */}
        {graph.edges.map(renderEdge)}

        {/* Preview edge when selecting second vertex */}
        {previewEdge && (
          <line
            x1={previewEdge.from.position.x}
            y1={previewEdge.from.position.y}
            x2={previewEdge.x}
            y2={previewEdge.y}
            stroke="#60a5fa"
            strokeWidth={2}
            strokeDasharray="5,5"
            className="pointer-events-none"
          />
        )}

        {/* Render vertices */}
        {graph.vertices.map(renderVertex)}
      </svg>
      {selectedVertices.length > 0 && (
        <p className="mt-2 text-sm text-blue-600 font-medium">
          {selectedVertices.length === 1
            ? "Click another vertex to create an edge"
            : "Creating edge..."}
        </p>
      )}
    </div>
  );
}
