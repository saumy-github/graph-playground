# Graph Playground - Project Documentation

## Overview

This is a production-ready Graph Playground application built with React, TypeScript, and Tailwind CSS following modern best practices and the NeelKadam format.

## Project Structure

```# Admin Service Port
ADMIN_PORT=3002

# Database configuration - Supabase PostgreSQL (same as main backend)
DATABASE_URL=postgresql://postgres.hwyjqputmrabjpmxwxwn:N89IxLMPCu5VUXNe@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

# JWT Configuration
JWT_SECRET=blue_carbon_registry_secret_key_2025

# Blockchain Microservice URL
BLOCKCHAIN_SERVICE_URL=http://localhost:3001

# Main Backend URL
MAIN_BACKEND_URL=http://localhost:3000

frontend/
├── src/
│   ├── components/              # React Components
│   │   ├── Header.tsx          # Top header with student info
│   │   ├── GraphCanvas.tsx     # Canvas for graph visualization
│   │   ├── ControlPanel.tsx    # Control buttons and settings
│   │   ├── RepresentationView.tsx  # Matrix and list displays
│   │   └── index.ts            # Component exports
│   │
│   ├── types/                  # TypeScript Type Definitions
│   │   └── graph.ts            # Graph, Vertex, Edge interfaces
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useGraph.ts         # Graph state management hook
│   │   └── index.ts            # Hook exports
│   │
│   ├── utils/                  # Utility Functions
│   │   ├── graphAlgorithms.ts  # DFS, BFS, cycle detection, etc.
│   │   ├── graphHelpers.ts     # Import/export, random generation
│   │   └── index.ts            # Utility exports
│   │
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles with Tailwind
│
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## Core Types

### Vertex

```typescript
interface Vertex {
  id: string; // Unique identifier
  label: string; // Display label (A, B, C, etc.)
  position: { x: number; y: number }; // Canvas position
}
```

### Edge

```typescript
interface Edge {
  from: string; // Source vertex ID
  to: string; // Target vertex ID
}
```

### Graph

```typescript
interface Graph {
  vertices: Vertex[]; // Array of vertices
  edges: Edge[]; // Array of edges
  isDirected: boolean; // Graph type flag
}
```

## Components

### 1. Header

- Displays project title and student information
- Styled with gradient background
- Props: `studentName`, `rollNumber`, `projectTitle`

### 2. GraphCanvas

- Canvas-based graph visualization
- Renders vertices as circles with labels
- Renders edges as lines (with arrows for directed graphs)
- Interactive click handling for vertices and canvas
- Props: `graph`, `onVertexClick`, `onCanvasClick`

### 3. ControlPanel

- Graph type toggle (directed/undirected)
- Add vertex/edge buttons
- Clear graph button
- Algorithm execution buttons (DFS, BFS, Dijkstra)
- Props: Various callback functions

### 4. RepresentationView

- Displays adjacency matrix as a table
- Displays adjacency list as formatted text
- Shows graph statistics (vertex count, edge count)
- Props: `graph`

## Custom Hooks

### useGraph

State management hook for graph operations:

- `addVertex(x, y)` - Add vertex at position
- `addEdge(from, to)` - Create edge between vertices
- `removeVertex(id)` - Remove vertex and connected edges
- `removeEdge(from, to)` - Remove specific edge
- `toggleDirected()` - Switch graph type
- `clearGraph()` - Remove all vertices and edges

## Utility Functions

### Graph Algorithms (`graphAlgorithms.ts`)

- `dfs(graph, startVertexId)` - Depth-first search
- `bfs(graph, startVertexId)` - Breadth-first search
- `getNeighbors(graph, vertexId)` - Get adjacent vertices
- `isConnected(graph)` - Check if graph is fully connected
- `hasCycle(graph)` - Detect cycles in graph

### Graph Helpers (`graphHelpers.ts`)

- `exportGraphToJSON(graph)` - Export graph data
- `importGraphFromJSON(jsonString)` - Import graph data
- `generateRandomGraph(numVertices, numEdges, isDirected)` - Generate random graph

## How to Use

### Adding Vertices

1. Click "Add Vertex" button - places vertex at random position
2. Or click directly on canvas - places vertex at click position

### Creating Edges

1. Click "Add Edge" button
2. Click on first vertex (source)
3. Click on second vertex (target)
4. Edge is created automatically

### Viewing Representations

- Adjacency Matrix: Auto-updates in bottom-right panel
- Adjacency List: Shows neighbors for each vertex
- Statistics: Real-time vertex and edge counts

## Development

### Running Locally

```bash
cd frontend
npm install
npm run dev
```

Access at: <http://localhost:5173> (or next available port)

### Building for Production

```bash
npm run build
npm run preview
```

### Code Quality

```bash
npm run lint
```

## Styling with Tailwind CSS

The project uses Tailwind CSS utility classes for styling:

- Responsive grid layout (`grid grid-cols-12`)
- Color schemes (blue, green, purple, etc.)
- Shadows and rounded corners
- Hover states and transitions
- Custom gradients for header

## Next Steps

1. **Implement Algorithm Visualizations**

   - Step-by-step DFS/BFS animation
   - Highlight visited vertices
   - Show traversal order

2. **Add Weighted Edges**

   - Edge weight input
   - Display weights on canvas
   - Implement Dijkstra's algorithm

3. **Enhanced Features**

   - Drag vertices to reposition
   - Delete individual vertices/edges
   - Export/import graph data
   - Undo/redo functionality
   - Preset graph templates

4. **Performance Optimizations**
   - Use React.memo for components
   - Optimize canvas rendering
   - Debounce expensive operations

## Notes

- The project follows React best practices with TypeScript
- All components are functional with hooks
- Type safety is enforced throughout
- Clean architecture with separation of concerns
- Production-ready with proper error handling
- Responsive design with Tailwind CSS
