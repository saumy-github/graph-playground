import { useRef, useEffect } from "react";
import type { Graph } from "../types/graph";
import type { VertexState } from "../types/algorithm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Pencil } from "lucide-react";

interface GraphCanvasProps {
  graph: Graph;
  onVertexClick?: (vertexId: string) => void;
  onCanvasClick?: (x: number, y: number) => void;
  vertexStates?: Map<string, VertexState>;
  highlightedEdges?: Set<string>;
}

export default function GraphCanvas({
  graph,
  onVertexClick,
  onCanvasClick,
  vertexStates,
  highlightedEdges,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get vertex color based on state
  const getVertexColor = (
    vertexId: string
  ): { fill: string[]; stroke: string } => {
    const state = vertexStates?.get(vertexId) || "unvisited";

    switch (state) {
      case "current":
        return { fill: ["#ef4444", "#dc2626"], stroke: "#991b1b" }; // Red
      case "visiting":
        return { fill: ["#fbbf24", "#f59e0b"], stroke: "#b45309" }; // Yellow
      case "visited":
        return { fill: ["#34d399", "#10b981"], stroke: "#047857" }; // Green
      case "unvisited":
      default:
        return { fill: ["#60a5fa", "#3b82f6"], stroke: "#1e40af" }; // Blue
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with subtle grid pattern
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges with gradient
    graph.edges.forEach((edge) => {
      const fromVertex = graph.vertices.find((v) => v.id === edge.from);
      const toVertex = graph.vertices.find((v) => v.id === edge.to);

      if (fromVertex && toVertex) {
        const edgeKey = `${edge.from}-${edge.to}`;
        const isHighlighted = highlightedEdges?.has(edgeKey) || false;

        // Set line width and style based on highlight
        ctx.lineWidth = isHighlighted ? 5 : 3;

        // Create gradient for edge
        const gradient = ctx.createLinearGradient(
          fromVertex.position.x,
          fromVertex.position.y,
          toVertex.position.x,
          toVertex.position.y
        );

        if (isHighlighted) {
          gradient.addColorStop(0, "#3b82f6");
          gradient.addColorStop(1, "#1d4ed8");
          ctx.strokeStyle = gradient;
          ctx.shadowColor = "rgba(59, 130, 246, 0.5)";
          ctx.shadowBlur = 12;
        } else {
          gradient.addColorStop(0, "#6366f1");
          gradient.addColorStop(1, "#8b5cf6");
          ctx.strokeStyle = gradient;
          ctx.shadowColor = "rgba(99, 102, 241, 0.3)";
          ctx.shadowBlur = 8;
        }

        ctx.beginPath();
        ctx.moveTo(fromVertex.position.x, fromVertex.position.y);
        ctx.lineTo(toVertex.position.x, toVertex.position.y);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Draw arrow for directed graphs
        if (graph.isDirected) {
          const angle = Math.atan2(
            toVertex.position.y - fromVertex.position.y,
            toVertex.position.x - fromVertex.position.x
          );
          const arrowLength = 18;
          const arrowAngle = Math.PI / 6;

          ctx.fillStyle = "#8b5cf6";
          ctx.beginPath();
          ctx.moveTo(
            toVertex.position.x - 20 * Math.cos(angle),
            toVertex.position.y - 20 * Math.sin(angle)
          );
          ctx.lineTo(
            toVertex.position.x -
              20 * Math.cos(angle) -
              arrowLength * Math.cos(angle - arrowAngle),
            toVertex.position.y -
              20 * Math.sin(angle) -
              arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.lineTo(
            toVertex.position.x -
              20 * Math.cos(angle) -
              arrowLength * Math.cos(angle + arrowAngle),
            toVertex.position.y -
              20 * Math.sin(angle) -
              arrowLength * Math.sin(angle + arrowAngle)
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // Draw vertices with gradient and shadow
    graph.vertices.forEach((vertex) => {
      const colors = getVertexColor(vertex.id);
      const state = vertexStates?.get(vertex.id) || "unvisited";

      // Enhanced shadow for current vertex
      if (state === "current") {
        ctx.shadowColor = "rgba(239, 68, 68, 0.6)";
        ctx.shadowBlur = 20;
      } else {
        ctx.shadowColor = "rgba(59, 130, 246, 0.4)";
        ctx.shadowBlur = 15;
      }

      // Vertex circle with gradient
      const gradient = ctx.createRadialGradient(
        vertex.position.x - 5,
        vertex.position.y - 5,
        2,
        vertex.position.x,
        vertex.position.y,
        20
      );
      gradient.addColorStop(0, colors.fill[0]);
      gradient.addColorStop(1, colors.fill[1]);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(vertex.position.x, vertex.position.y, 20, 0, 2 * Math.PI);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = state === "current" ? 4 : 3;
      ctx.stroke();

      // Vertex label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(vertex.label, vertex.position.x, vertex.position.y);
    });
  }, [graph, vertexStates, highlightedEdges]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onCanvasClick) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a vertex
    const clickedVertex = graph.vertices.find((v) => {
      const dx = v.position.x - x;
      const dy = v.position.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= 20;
    });

    if (clickedVertex && onVertexClick) {
      onVertexClick(clickedVertex.id);
    } else {
      onCanvasClick(x, y);
    }
  };

  return (
    <Card className="shadow-lg border-2 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Pencil className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Graph Canvas</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onClick={handleCanvasClick}
          className="border-2 border-border rounded-md cursor-crosshair bg-muted/20 hover:bg-muted/30 transition-colors"
        />
      </CardContent>
    </Card>
  );
}
