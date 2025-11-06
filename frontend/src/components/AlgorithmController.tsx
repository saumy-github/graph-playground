import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  PlayCircle,
  Activity,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { AlgorithmType, AlgorithmStatus } from "../types/algorithm";
import type { Graph } from "../types/graph";

interface AlgorithmControllerProps {
  graph: Graph;
  algorithmType: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  startVertex: string | null;
  onStartVertexChange: (vertexId: string | null) => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  status: AlgorithmStatus;
  currentStep: number;
  totalSteps: number;
  description: string;
  stack: string[];
  visited: Set<string>;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onReset: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
}

export default function AlgorithmController({
  graph,
  algorithmType,
  onAlgorithmChange,
  startVertex,
  onStartVertexChange,
  animationSpeed,
  onSpeedChange,
  status,
  currentStep,
  totalSteps,
  description,
  stack,
  visited,
  onStart,
  onPause,
  onResume,
  onNextStep,
  onPreviousStep,
  onReset,
  canStepForward,
  canStepBackward,
}: AlgorithmControllerProps) {
  // Get vertex label by ID
  const getVertexLabel = (vertexId: string) => {
    const vertex = graph.vertices.find((v) => v.id === vertexId);
    return vertex ? vertex.label : vertexId;
  };

  // Status badge color
  const getStatusBadgeVariant = () => {
    switch (status) {
      case "running":
        return "default";
      case "paused":
        return "secondary";
      case "complete":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "running":
        return "Running";
      case "paused":
        return "Paused";
      case "complete":
        return "Complete";
      default:
        return "Ready";
    }
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Algorithm Controller</CardTitle>
          </div>
          <Badge variant={getStatusBadgeVariant()} className="font-semibold">
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {/* Algorithm Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Algorithm
          </label>
          <select
            value={algorithmType || ""}
            onChange={(e) =>
              onAlgorithmChange((e.target.value as AlgorithmType) || null)
            }
            className="w-full px-3 py-2 border-2 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={status === "running"}
          >
            <option value="">Select Algorithm</option>
            <option value="DFS">Depth First Search (DFS)</option>
            <option value="BFS">Breadth First Search (BFS)</option>
          </select>
        </div>

        {/* Start Vertex Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Start Vertex
          </label>
          <select
            value={startVertex || ""}
            onChange={(e) => onStartVertexChange(e.target.value || null)}
            className="w-full px-3 py-2 border-2 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={graph.vertices.length === 0 || status === "running"}
          >
            <option value="">Select Start Vertex</option>
            {graph.vertices.map((vertex) => (
              <option key={vertex.id} value={vertex.id}>
                Vertex {vertex.label}
              </option>
            ))}
          </select>
        </div>

        {/* Animation Speed */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Animation Speed
            </label>
            <span className="text-xs font-medium">{animationSpeed}ms</span>
          </div>
          <input
            type="range"
            min="500"
            max="2000"
            step="100"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Controls
          </label>
          <div className="grid grid-cols-2 gap-2">
            {status !== "running" ? (
              <Button
                onClick={status === "paused" ? onResume : onStart}
                disabled={
                  !algorithmType ||
                  !startVertex ||
                  graph.vertices.length === 0 ||
                  status === "complete"
                }
                className="gap-2"
                size="sm"
              >
                <Play className="h-4 w-4" />
                {status === "paused" ? "Resume" : "Play"}
              </Button>
            ) : (
              <Button
                onClick={onPause}
                className="gap-2 bg-yellow-600 hover:bg-yellow-700"
                size="sm"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button
              onClick={onReset}
              variant="outline"
              disabled={status === "idle"}
              className="gap-2"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onPreviousStep}
              disabled={!canStepBackward || status === "running"}
              variant="outline"
              className="gap-2"
              size="sm"
            >
              <SkipBack className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={onNextStep}
              disabled={!canStepForward || status === "running"}
              variant="outline"
              className="gap-2"
              size="sm"
            >
              <SkipForward className="h-4 w-4" />
              Next
            </Button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="bg-muted/50 p-2 rounded-lg border">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Progress
            </span>
            <span className="text-sm font-bold">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${
                  totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Current Operation Description */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded">
          <p className="text-xs font-semibold text-blue-800 mb-0.5">
            Current Operation
          </p>
          <p className="text-sm text-blue-900">{description}</p>
        </div>

        {/* DFS Stack Visualization */}
        {algorithmType === "DFS" && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Stack State
            </label>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-2 min-h-[50px]">
              {stack.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {stack.map((vertexId, index) => (
                    <Badge
                      key={`${vertexId}-${index}`}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                    >
                      {getVertexLabel(vertexId)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-1">
                  Stack is empty
                </p>
              )}
            </div>
          </div>
        )}

        {/* Visited Vertices */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Visited Vertices ({visited.size})
          </label>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-2 min-h-[50px]">
            {visited.size > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {Array.from(visited).map((vertexId) => (
                  <Badge
                    key={vertexId}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  >
                    {getVertexLabel(vertexId)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-1">
                No vertices visited yet
              </p>
            )}
          </div>
        </div>

        {/* Statistics */}
        {status === "complete" && (
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-bold text-green-800">
                Traversal Complete!
              </p>
            </div>
            <div className="space-y-1 text-sm text-green-700">
              <p>• Total Steps: {totalSteps}</p>
              <p>
                • Vertices Visited: {visited.size} / {graph.vertices.length}
              </p>
              <p>
                • Coverage:{" "}
                {graph.vertices.length > 0
                  ? Math.round((visited.size / graph.vertices.length) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
