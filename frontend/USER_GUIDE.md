# 🚀 Graph Playground - User Guide

## Welcome!

Graph Playground is an interactive educational tool for visualizing and manipulating graph data structures. This guide will help you get started quickly.

---

## 🎯 Quick Start

### Creating Your First Graph

1. **Add Vertices**

   - Click the **"Add Vertex"** button in the Control Panel
   - OR click directly on the canvas
   - Vertices are labeled automatically (A, B, C, D...)

2. **Create Edges**

   - Click the **"Add Edge"** button
   - Click on the first vertex
   - Click on the second vertex
   - Edge is created automatically!

3. **View Representations**
   - Scroll down to see **Adjacency Matrix** and **Adjacency List**
   - Toggle between views using the button

---

## 🎮 Controls & Interactions

### Mouse Actions

| Action                   | Description                       |
| ------------------------ | --------------------------------- |
| **Left Click (Canvas)**  | Add new vertex at click position  |
| **Left Click (Vertex)**  | Select vertex (for edge creation) |
| **Right Click (Vertex)** | Delete vertex                     |
| **Right Click (Edge)**   | Delete edge                       |
| **Drag (Vertex)**        | Move vertex to new position       |

### Keyboard Shortcuts

| Shortcut               | Action                     |
| ---------------------- | -------------------------- |
| **Ctrl+Z** / **Cmd+Z** | Undo last action           |
| **Ctrl+Y** / **Cmd+Y** | Redo action                |
| **D**                  | Toggle Directed/Undirected |
| **Esc**                | Cancel current action      |

---

## 🎛️ Control Panel Features

### 📊 Statistics Dashboard

- **Vertices Count**: Shows number of vertices in graph
- **Edges Count**: Shows number of edges in graph

### 🔄 Graph Type

- **Toggle Button**: Switch between Directed (→) and Undirected (↔)
- Visual indicator shows current mode
- Affects how edges are displayed and represented

### ➕ Graph Operations

#### Add Vertex

- Adds vertex at random position
- Shows next label in badge (A, B, C...)
- Instant visual feedback

#### Add Edge

- Requires at least 2 vertices
- Two-step process: click first vertex, then second vertex
- Prevents duplicate edges
- Works with both directed and undirected graphs

### ⏮️ History Controls

#### Undo

- Reverts last action
- Up to 50 actions stored
- Grayed out when no history

#### Redo

- Re-applies undone action
- Grayed out when at latest state

### 💾 File Operations

#### Export JSON

- Downloads graph as JSON file
- Includes all vertices, edges, and settings
- Timestamped filename
- Disabled when graph is empty

#### Import JSON

- Click to select JSON file
- Validates structure
- Shows error if invalid
- Replaces current graph (can undo)

### 🗑️ Clear Graph

- **Danger Zone**: Deletes entire graph
- **Two-step confirmation** prevents accidents
- Keeps graph type (directed/undirected)
- Can be undone

---

## 📊 Graph Representations

### Adjacency Matrix

- **Table format**: Rows and columns represent vertices
- **Values**: 1 = edge exists, 0 = no edge
- **Hover**: Highlights corresponding row/column
- **Symmetric**: For undirected graphs, matrix is symmetric
- **Scrollable**: Handles large graphs

### Adjacency List

- **List format**: Each vertex shows its neighbors
- **Visual**: Color-coded vertex badges and neighbor pills
- **Empty**: Shows "[ empty ]" for isolated vertices
- **Hover**: Highlights individual vertex entries
- **Sorted**: Neighbors displayed in alphabetical order

### Toggle Views

- Switch between Matrix and List views
- Button in top-right of Representations panel
- Smooth transition
- Educational descriptions for each view

---

## 💡 Tips & Best Practices

### Graph Creation

1. Start with a few vertices (3-5)
2. Add edges to create simple patterns
3. Observe how representations change
4. Experiment with directed vs undirected

### Learning Concepts

- **Adjacency Matrix**: Good for dense graphs, O(1) edge lookup
- **Adjacency List**: Space-efficient for sparse graphs
- **Directed**: Arrows show direction of relationship
- **Undirected**: Connections work both ways

### Avoiding Mistakes

- Use **Undo** if you make a mistake
- Press **Esc** to cancel edge creation
- **Confirm** before clearing graph
- **Export** your work before major changes

### Performance

- Works smoothly with 10-20 vertices
- Large graphs (50+) may scroll
- Export large graphs and reload later

---

## 🎨 Visual Feedback

### Notifications

Toast messages appear at top of screen:

- ✓ Success: "Vertex A added"
- ⚠ Warning: "Edge already exists"
- ↶ Undo: "Undone"
- ✕ Cancel: "Action cancelled"

### Mode Indicators

- **Adding Edge**: Badge shows "Select vertices to connect"
- **Normal Mode**: No indicator
- Visual cues help track current state

### Button States

- **Disabled**: Grayed out when action not available
- **Hover**: Subtle scale and shadow effects
- **Active**: Brighter colors and shadows

---

## 🎓 Educational Use Cases

### Learning Graph Theory

1. Create different graph types (tree, cycle, complete)
2. Compare matrix vs list representations
3. Understand directed vs undirected
4. Explore graph properties (connected, complete, etc.)

### Teaching Examples

1. **Tree**: Create hierarchical structure
2. **Cycle**: Connect vertices in loop
3. **Complete Graph**: Every vertex connects to every other
4. **Disconnected**: Multiple separate components

### Experiment Ideas

- What happens to matrix when you add edge?
- How does adjacency list change?
- Compare space usage: matrix vs list
- Draw a graph, toggle directed/undirected

---

## 🐛 Troubleshooting

### "Can't add edge"

- Need at least 2 vertices
- Check if button is enabled

### "Import failed"

- Ensure JSON file is valid
- Check file format matches export

### Vertex disappeared

- May have deleted accidentally
- Use **Undo** to restore

### Canvas not responding

- Try pressing **Esc** to reset mode
- Check browser console for errors

---

## 🔮 Coming Soon

The following features are planned:

- **Algorithm Visualizations**

  - Depth-First Search (DFS)
  - Breadth-First Search (BFS)
  - Dijkstra's Shortest Path

- **Advanced Features**
  - Weighted edges
  - Graph templates
  - Auto-layout algorithms
  - Dark mode
  - Export as image

---

## 📱 Browser Compatibility

### Recommended Browsers

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Screen Sizes

- 📱 Mobile: Basic functionality (limited)
- 📱 Tablet: Good experience
- 💻 Desktop: Full features (recommended)

---

## 🆘 Need Help?

### Common Questions

**Q: How do I create a directed edge?**
A: First toggle to Directed mode, then add edges normally.

**Q: Can I undo after clearing?**
A: Yes! Clear is added to history and can be undone.

**Q: How many vertices can I add?**
A: Up to 26 (A-Z), but 10-20 is optimal for visibility.

**Q: Why can't I see my edge?**
A: Check if vertices overlap, try dragging them apart.

**Q: Export not working?**
A: Ensure you have at least one vertex in the graph.

---

## 🎉 Have Fun!

Graph Playground is designed to make learning graph theory **interactive and enjoyable**. Experiment freely, make mistakes, and discover patterns!

**Remember**: You can always **undo**, **clear**, or **import** to start fresh!

---

Made with ❤️ for Design and Analysis of Algorithms students
