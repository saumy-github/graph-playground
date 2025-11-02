import type { Graph } from "../types/graph";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table2, List, BarChart3 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";

interface RepresentationViewProps {
  graph: Graph;
}

export default function RepresentationView({ graph }: RepresentationViewProps) {
  // Generate adjacency matrix
  const generateAdjacencyMatrix = () => {
    const n = graph.vertices.length;
    const matrix: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0));

    graph.edges.forEach((edge) => {
      const fromIndex = graph.vertices.findIndex((v) => v.id === edge.from);
      const toIndex = graph.vertices.findIndex((v) => v.id === edge.to);

      if (fromIndex !== -1 && toIndex !== -1) {
        matrix[fromIndex][toIndex] = 1;
        if (!graph.isDirected) {
          matrix[toIndex][fromIndex] = 1;
        }
      }
    });

    return matrix;
  };

  // Generate adjacency list
  const generateAdjacencyList = () => {
    const adjList: { [key: string]: string[] } = {};

    graph.vertices.forEach((vertex) => {
      adjList[vertex.label] = [];
    });

    graph.edges.forEach((edge) => {
      const fromVertex = graph.vertices.find((v) => v.id === edge.from);
      const toVertex = graph.vertices.find((v) => v.id === edge.to);

      if (fromVertex && toVertex) {
        adjList[fromVertex.label].push(toVertex.label);
        if (!graph.isDirected) {
          adjList[toVertex.label].push(fromVertex.label);
        }
      }
    });

    return adjList;
  };

  const matrix = generateAdjacencyMatrix();
  const adjList = generateAdjacencyList();

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Graph Representations</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Adjacency Matrix */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Table2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Adjacency Matrix
            </h3>
          </div>
          {graph.vertices.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-3 py-2 text-sm font-semibold"></th>
                    {graph.vertices.map((v) => (
                      <th
                        key={v.id}
                        className="border border-border px-3 py-2 text-sm font-semibold text-primary"
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
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="border border-border px-3 py-2 text-sm font-semibold bg-muted/50 text-primary">
                        {v.label}
                      </td>
                      {matrix[i].map((val, j) => (
                        <td
                          key={j}
                          className={cn(
                            "border border-border px-3 py-2 text-center text-sm font-medium",
                            val === 1
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                              : "bg-background"
                          )}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No vertices in graph</p>
          )}
        </div>

        {/* Adjacency List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <List className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Adjacency List
            </h3>
          </div>
          {graph.vertices.length > 0 ? (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              {Object.entries(adjList).map(([vertex, neighbors]) => (
                <div key={vertex} className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="font-semibold">
                    {vertex}
                  </Badge>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-foreground">
                    {neighbors.length > 0 ? (
                      neighbors.map((n, i) => (
                        <Badge key={i} variant="secondary" className="mr-1">
                          {n}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground italic">
                        No neighbors
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No vertices in graph
            </p>
          )}
        </div>

        {/* Graph Stats */}
        <div>
          <Separator className="my-4" />
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Graph Statistics
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
              <p className="text-sm text-muted-foreground">Vertices</p>
              <p className="text-3xl font-bold text-blue-600">
                {graph.vertices.length}
              </p>
              <Badge variant="secondary" className="mt-2">
                Total Nodes
              </Badge>
            </div>
            <div className="rounded-lg border bg-emerald-50 p-4 dark:bg-emerald-950">
              <p className="text-sm text-muted-foreground">Edges</p>
              <p className="text-3xl font-bold text-emerald-600">
                {graph.edges.length}
              </p>
              <Badge variant="secondary" className="mt-2">
                Total Connections
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
