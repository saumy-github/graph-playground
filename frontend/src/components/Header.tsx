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
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{projectTitle}</h1>
            <p className="text-blue-100 text-sm mt-1">
              Interactive Graph Algorithms Visualizer
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{studentName}</p>
            <p className="text-blue-100 text-sm">{rollNumber}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
