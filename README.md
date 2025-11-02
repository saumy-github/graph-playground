# Graph Playground - DAA Project

**Student:** Saumy Bhargava  
**Roll No:** 2024UCA1877  
**Course:** Design and Analysis of Algorithms (DAA)  
**Assignment:** Graph Representation - Interactive Playground

## Project Links

- **Live Demo:** Coming Soon
- **Source Code:** <https://github.com/saumy-github/graph-playground>
- **Video Demonstration:** Coming Soon

## Features

### Graph Operations

- ✨ Interactive graph creation and editing
- 🎯 Add/remove vertices with click-to-place functionality
- 🔗 Create edges by selecting two vertices
- 🔄 Toggle between directed and undirected graphs
- 🧹 Clear graph with one click

### Visualizations

- 📊 Real-time adjacency matrix display
- 📝 Adjacency list representation
- 📈 Graph statistics (vertices count, edges count)
- 🎨 Clean and intuitive canvas-based graph rendering

### Algorithms (Coming Soon)

- 🔍 Depth First Search (DFS)
- 🔍 Breadth First Search (BFS)
- 🛣️ Dijkstra's Shortest Path Algorithm

## Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (Coming Soon)

## Project Structure

```plaintext
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── GraphCanvas.tsx
│   │   ├── ControlPanel.tsx
│   │   └── RepresentationView.tsx
│   ├── types/             # TypeScript interfaces
│   │   └── graph.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useGraph.ts
│   ├── utils/             # Helper functions
│   │   ├── graphAlgorithms.ts
│   │   └── graphHelpers.ts
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.Clone the repository:

```bash
git clone https://github.com/saumy-github/graph-playground.git
cd graph-playground
```

2.Install dependencies:

```bash
cd frontend
npm install
```

3.Start the development server:

```bash
npm run dev
```

4.Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Adding Vertices:**

   - Click "Add Vertex" button to place vertices randomly
   - Or click anywhere on the canvas to place a vertex at that location

2. **Creating Edges:**

   - Click "Add Edge" button, then click two vertices in sequence
   - An edge will be created between the selected vertices

3. **Toggle Graph Type:**

   - Use the "Directed Graph" checkbox to switch between directed and undirected graphs

4. **View Representations:**
   - The adjacency matrix and adjacency list update automatically
   - Graph statistics are displayed in real-time

## Features Roadmap

- [ ] Implement DFS algorithm with step-by-step visualization
- [ ] Implement BFS algorithm with step-by-step visualization
- [ ] Implement Dijkstra's algorithm with weighted edges
- [ ] Add vertex labeling customization
- [ ] Export/Import graph data (JSON format)
- [ ] Generate random graphs
- [ ] Undo/Redo functionality
- [ ] Graph templates (common graph structures)

## License

This project is created for educational purposes as part of the DAA course assignment.
