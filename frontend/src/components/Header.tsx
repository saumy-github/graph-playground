import { Network, GraduationCap, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

interface HeaderProps {
  studentName?: string;
  rollNumber?: string;
  projectTitle?: string;
}

export default function Header({
  studentName = "Your Name",
  rollNumber = "Roll No.",
  projectTitle = "Graph Playground - DAA Project",
}: HeaderProps) {
  return (
    <header className="border-b bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <Network className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {projectTitle}
                </h1>
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </div>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-blue-100">
                <span>Interactive Graph Algorithms Visualizer</span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 text-xs"
                >
                  v1.0
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
            <GraduationCap className="h-4 w-4" />
            <div className="text-right">
              <p className="font-semibold text-sm">{studentName}</p>
              <p className="text-xs text-blue-100">{rollNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
