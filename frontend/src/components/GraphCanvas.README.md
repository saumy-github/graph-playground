# GraphCanvas Component - Interactive SVG Graph Visualizer

## Overview

The `GraphCanvas` component is a fully interactive, production-ready SVG-based graph visualization component built with React and TypeScript. It provides a smooth, intuitive interface for creating, editing, and visualizing graph structures.

## Features

### ✨ Core Interactions

1. **Add Vertices**

   - Click on empty canvas space to create a new vertex
   - Vertices are auto-labeled (A, B, C, D, ...)
   - Visual feedback with hover effects

2. **Create Edges**

   - Click on a first vertex (becomes selected)
   - Click on a second vertex to create an edge
   - Live preview line shows where edge will be created
   - Supports both directed and undirected graphs
   - Arrows automatically rendered for directed graphs

3. **Drag & Reposition**

   - Click and hold on any vertex
   - Drag to new position
   - Smooth movement with visual feedback
   - Connected edges update in real-time

4. **Delete Elements**
   - Right-click on a vertex to delete it (removes connected edges too)
   - Right-click on an edge to delete just that edge
   - Visual feedback on hover (red highlight)

### 🎨 Visual Feedback

- **Hover Effects**: Vertices and edges highlight on hover
- **Selection State**: Selected vertices show blue ring
- **Dragging State**: Darker blue while dragging
- **Edge Preview**: Dashed line shows where edge will connect
- **Color Coding**:
  - Vertices: Blue (#3b82f6)
  - Edges: Gray (#64748b)
  - Hover: Light blue (#60a5fa)
  - Delete hover: Red (#ef4444)

### 🎯 Smart Hit Detection

- **Vertex Detection**: 24px radius for easy clicking
- **Edge Detection**: 8px tolerance around edge lines
- **Precise Line-to-Point Distance**: Calculates closest point on line segment

## Props

```typescript
interface GraphCanvasProps {
  graph: Graph; // The graph data to visualize
  selectedVertices?: string[]; // IDs of currently selected vertices
  onVertexClick?: (vertexId: string) => void; // Vertex clicked
  onVertexDelete?: (vertexId: string) => void; // Vertex right-clicked
  onVertexDrag?: (vertexId: string, x: number, y: number) => void; // Vertex dragged
  onEdgeDelete?: (from: string, to: string) => void; // Edge right-clicked
  onCanvasClick?: (x: number, y: number) => void; // Empty space clicked
}
```

## Usage Example

```tsx
import GraphCanvas from "./components/GraphCanvas";
import { useGraph } from "./hooks/useGraph";

function App() {
  const {
    graph,
    addVertex,
    addEdge,
    removeVertex,
    removeEdge,
    updateVertexPosition,
  } = useGraph();
  const [selectedVertices, setSelectedVertices] = useState<string[]>([]);

  return (
    <GraphCanvas
      graph={graph}
      selectedVertices={selectedVertices}
      onVertexClick={(id) => {
        setSelectedVertices((prev) => {
          const newSelection = [...prev, id];
          if (newSelection.length === 2) {
            addEdge(newSelection[0], newSelection[1]);
            return [];
          }
          return newSelection;
        });
      }}
      onVertexDelete={(id) => removeVertex(id)}
      onVertexDrag={(id, x, y) => updateVertexPosition(id, x, y)}
      onEdgeDelete={(from, to) => removeEdge(from, to)}
      onCanvasClick={(x, y) => addVertex(x, y)}
    />
  );
}
```

## Technical Details

### SVG vs Canvas

We use SVG instead of HTML5 Canvas for several reasons:

1. **Better React Integration**: SVG elements are DOM nodes, easier to manage with React
2. **Scalability**: Vector graphics scale perfectly on any screen size
3. **Event Handling**: Each element can have its own event handlers
4. **Styling**: Easy to apply CSS classes and transitions
5. **Accessibility**: SVG is more accessible for screen readers

### Architecture

```
GraphCanvas
├── State Management
│   ├── hoveredVertex (visual feedback)
│   ├── hoveredEdge (visual feedback)
│   ├── draggedVertex (drag interaction)
│   ├── dragOffset (precise dragging)
│   └── previewEdge (edge creation preview)
│
├── Helper Functions
│   ├── getSVGCoordinates() - Mouse to SVG conversion
│   ├── getVertexAtPoint() - Hit detection for vertices
│   ├── getEdgeAtPoint() - Hit detection for edges
│   └── getArrowPoints() - Arrow calculation for directed edges
│
├── Event Handlers
│   ├── handleMouseDown - Start dragging
│   ├── handleMouseMove - Update hover/preview states
│   ├── handleMouseUp - End dragging
│   ├── handleClick - Vertex/canvas clicks
│   └── handleContextMenu - Right-click deletions
│
└── Rendering
    ├── renderEdge() - Edge with hover/direction
    └── renderVertex() - Vertex with states
```

### Performance Optimizations

1. **useCallback**: Event handlers memoized to prevent re-renders
2. **Conditional Rendering**: Only render what's needed
3. **SVG Optimization**: Invisible hit areas for easier edge clicking
4. **Smooth Transitions**: CSS transitions for visual changes

### Constants

- `VERTEX_RADIUS = 24` - Vertex circle radius in pixels
- `EDGE_HIT_TOLERANCE = 8` - Distance tolerance for edge clicking

## Styling

The component uses Tailwind CSS for styling:

- Container: White background, shadow, rounded corners
- SVG: Gray border, light gray background
- Responsive: Width adjusts to container

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (with touch support)

## Future Enhancements

- [ ] Touch/mobile gestures support
- [ ] Zoom and pan functionality
- [ ] Multi-select with Ctrl+Click
- [ ] Keyboard shortcuts
- [ ] Weighted edges with labels
- [ ] Custom vertex colors/shapes
- [ ] Animation for algorithm visualization
- [ ] Export as PNG/SVG
- [ ] Undo/redo for operations

## Tips for Extension

### Adding Weighted Edges

1. Update `Edge` interface to include `weight?: number`
2. Calculate midpoint of edge line
3. Render text element at midpoint
4. Add input for weight editing

### Adding Algorithm Animation

1. Add `highlightedVertices` state
2. Add `highlightedEdges` state
3. Update render functions to show highlights
4. Use `setTimeout` or `requestAnimationFrame` for step-by-step

### Adding Zoom/Pan

1. Add transform state for SVG viewBox
2. Handle wheel events for zoom
3. Handle drag on background for pan
4. Update coordinate conversion functions

## Troubleshooting

**Issue**: Vertices not dragging smoothly

- Check that `onVertexDrag` is updating state correctly
- Ensure no expensive operations in render

**Issue**: Right-click shows browser context menu

- Verify `onContextMenu` calls `e.preventDefault()`

**Issue**: Edges not clickable

- Check `EDGE_HIT_TOLERANCE` constant
- Verify `getEdgeAtPoint` logic

**Issue**: Preview edge not showing

- Check that `selectedVertices` prop is passed correctly
- Verify one vertex is selected

## License

MIT - Part of Graph Playground DAA Project
