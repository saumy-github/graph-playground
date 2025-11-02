import {
  CircleDot,
  Link2,
  Trash2,
  GitBranch,
  Navigation,
  Shuffle,
  Settings2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

interface ControlPanelProps {
  isDirected: boolean;
  onToggleDirected: () => void;
  onAddVertex: () => void;
  onAddEdge: () => void;
  onClearGraph: () => void;
  onRunDFS?: () => void;
  onRunBFS?: () => void;
  onRunDijkstra?: () => void;
}

export default function ControlPanel({
  isDirected,
  onToggleDirected,
  onAddVertex,
  onAddEdge,
  onClearGraph,
  onRunDFS,
  onRunBFS,
  onRunDijkstra,
}: ControlPanelProps) {
  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <CardTitle>Control Panel</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Graph Type */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Directed Graph</span>
            </div>
            <Switch checked={isDirected} onCheckedChange={onToggleDirected} />
          </div>
        </div>

        <Separator />

        {/* Graph Operations */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Graph Operations
          </p>
          <div className="space-y-2">
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
            <Button
              onClick={onRunDijkstra}
              className="w-full justify-start gap-2 bg-orange-600 hover:bg-orange-700"
              size="default"
            >
              <Navigation className="h-4 w-4" />
              Dijkstra's Algorithm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
