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
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {projectTitle}
                </h1>
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">
                <span>Interactive Graph Algorithms Visualizer</span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  v1.0
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
            <GraduationCap className="h-5 w-5" />
            <div className="text-right">
              <p className="font-semibold">{studentName}</p>
              <p className="text-sm text-blue-100">{rollNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
