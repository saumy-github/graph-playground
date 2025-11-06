import {
  CircleDot,
  Link2,
  Trash2,
  GitBranch,
  Shuffle,
  Settings2,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface ControlPanelProps {
  isDirected: boolean;
  onToggleDirected: () => void;
  onAddVertex: () => void;
  onAddEdge: () => void;
  onClearGraph: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onRunDFS?: () => void;
  onRunBFS?: () => void;
}

export default function ControlPanel({
  isDirected,
  onToggleDirected,
  onAddVertex,
  onAddEdge,
  onClearGraph,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onRunDFS,
  onRunBFS,
}: ControlPanelProps) {
  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Control Panel</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Graph Type Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Graph Type
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => !isDirected || onToggleDirected()}
              variant={!isDirected ? "default" : "outline"}
              className={`justify-center gap-2 transition-all duration-200 ${
                !isDirected
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "hover:bg-muted"
              }`}
              size="sm"
            >
              Undirected
            </Button>
            <Button
              onClick={() => isDirected || onToggleDirected()}
              variant={isDirected ? "default" : "outline"}
              className={`justify-center gap-2 transition-all duration-200 ${
                isDirected
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "hover:bg-muted"
              }`}
              size="sm"
            >
              Directed
            </Button>
          </div>
        </div>

        <Separator />

        {/* Graph Operations */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Graph Operations
          </p>
          <div className="space-y-2">
            {/* Undo/Redo Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={onUndo}
                disabled={!canUndo}
                className="justify-start gap-2 bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                size="default"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
                Undo
              </Button>
              <Button
                onClick={onRedo}
                disabled={!canRedo}
                className="justify-start gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                size="default"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="h-4 w-4" />
                Redo
              </Button>
            </div>

            <Button
              onClick={onAddVertex}
              className="w-full justify-start gap-2"
              size="default"
            >
              <CircleDot className="h-4 w-4" />
              Add Vertex
            </Button>
            <Button
              onClick={onAddEdge}
              className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
              size="default"
            >
              <Link2 className="h-4 w-4" />
              Add Edge
            </Button>
            <Button
              onClick={onClearGraph}
              variant="destructive"
              className="w-full justify-start gap-2"
              size="default"
            >
              <Trash2 className="h-4 w-4" />
              Clear Graph
            </Button>
          </div>
        </div>

        <Separator />

        {/* Algorithms */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Algorithms
          </p>
          <div className="space-y-2">
            <Button
              onClick={onRunDFS}
              className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700"
              size="default"
            >
              <GitBranch className="h-4 w-4" />
              Depth First Search
            </Button>
            <Button
              onClick={onRunBFS}
              className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700"
              size="default"
            >
              <Shuffle className="h-4 w-4" />
              Breadth First Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
