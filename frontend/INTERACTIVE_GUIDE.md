# 🎨 Interactive GraphCanvas - User Guide

## 🚀 Quick Start

Your Graph Playground now features a **fully interactive SVG-based canvas** with smooth, intuitive controls for building and editing graphs.

**Development Server**: http://localhost:5173/

---

## 🎯 Interactive Features

### 1️⃣ **Adding Vertices**

**Method 1: Click on Canvas**

- Simply click anywhere on the empty canvas
- A new vertex appears at your click position
- Vertices are auto-labeled: A, B, C, D, E, F...

**Method 2: Random Position**

- Click the "Add Vertex" button in the control panel
- Vertex appears at a random position

**Visual Feedback:**

- Hover over vertices to see light blue highlight
- Each vertex has a 24px clickable area for easy interaction

---

### 2️⃣ **Creating Edges**

**Step-by-Step:**

1. Click on the **first vertex** (you'll see a blue ring around it)
2. A dashed preview line follows your mouse
3. Click on the **second vertex**
4. Edge is created instantly!

**Features:**

- Works for both directed and undirected graphs
- Preview line shows where edge will connect
- Can't create duplicate edges
- Status message shows: "Click another vertex to create an edge"

**Directed vs Undirected:**

- Toggle "Directed Graph" checkbox in control panel
- Directed: Shows arrows pointing to target vertex
- Undirected: Simple lines between vertices

---

### 3️⃣ **Dragging & Repositioning**

**How to Drag:**

1. Click and **hold** on any vertex
2. Drag to desired position
3. Release mouse button

**Smart Features:**

- Vertex turns darker blue while dragging
- Connected edges update in real-time
- Smooth movement with no lag
- Works perfectly with multiple edges

**Pro Tip:** Use dragging to organize your graph layout for better visualization!

---

### 4️⃣ **Deleting Elements**

**Delete a Vertex:**

- **Right-click** on any vertex
- Vertex and ALL connected edges are removed
- Vertex highlights red on hover before deletion

**Delete an Edge:**

- **Right-click** on any edge line
- Only that specific edge is removed
- Edge highlights red on hover before deletion

**Safety Features:**

- Clear visual feedback (red highlight)
- Only deletes what you click on
- No accidental deletions

---

## 🎨 Visual Feedback System

### Colors & States

| Element | State         | Color                | Meaning                 |
| ------- | ------------- | -------------------- | ----------------------- |
| Vertex  | Normal        | Blue (#3b82f6)       | Default state           |
| Vertex  | Hover         | Light Blue (#60a5fa) | Mouse over              |
| Vertex  | Selected      | Blue ring            | Ready for edge creation |
| Vertex  | Dragging      | Dark Blue (#2563eb)  | Being moved             |
| Edge    | Normal        | Gray (#64748b)       | Default state           |
| Edge    | Hover         | Red (#ef4444)        | Ready to delete         |
| Preview | Edge Creation | Dashed Blue          | Where edge will connect |

### Interactive Indicators

**Top Right of Canvas:**

- 🔵 Blue dot: "Click to add"
- 🟣 Purple dot: "Right-click to delete"

---

## 🎮 Complete Interaction Guide

### Mouse Controls

| Action        | Control                | Effect                    |
| ------------- | ---------------------- | ------------------------- |
| Add Vertex    | Left-click empty space | Creates new vertex        |
| Select Vertex | Left-click vertex      | Selects for edge creation |
| Drag Vertex   | Click + hold + drag    | Repositions vertex        |
| Delete Vertex | Right-click vertex     | Removes vertex + edges    |
| Delete Edge   | Right-click edge       | Removes only that edge    |

### Keyboard Shortcuts

Currently using button controls. Future enhancements:

- `Delete` key: Remove selected vertex
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Escape`: Clear selection

---

## 📐 Canvas Features

### Technical Specs

- **Canvas Size**: 100% width × 500px height
- **Vertex Radius**: 24px
- **Edge Thickness**: 2px
- **Hit Tolerance**: 8px (edges are easier to click)
- **Format**: SVG (vector graphics, scales perfectly)

### Benefits of SVG

✅ **Crisp on any screen** - No pixelation  
✅ **Smooth animations** - Hardware accelerated  
✅ **Precise interactions** - Each element is clickable  
✅ **Responsive design** - Adapts to container

---

## 🎯 Common Workflows

### Building a Simple Graph

1. **Add vertices** by clicking on canvas (3-5 clicks)
2. **Connect them** by clicking vertex pairs
3. **Adjust layout** by dragging vertices
4. **View representations** in the right panel

### Creating a Tree Structure

1. Add root vertex (click top-center)
2. Add child vertices (click below root)
3. Connect parent to children
4. Drag vertices to align vertically

### Building a Complete Graph (K₅)

1. Add 5 vertices in a circle pattern
2. Click "Add Edge" button
3. Connect each vertex to every other vertex
4. Drag to adjust spacing

---

## 🔄 Graph Type Switching

### Undirected Graph (Default)

- Simple lines between vertices
- Bidirectional by default
- Good for: Networks, social graphs, maps

### Directed Graph

- Lines with arrows
- Shows direction explicitly
- Good for: Dependencies, workflows, hierarchies

**Toggle:** Use checkbox in Control Panel

---

## 🎨 Best Practices

### Layout Tips

1. **Spread out vertices** - Prevents overlapping edges
2. **Use circular layouts** - For complete graphs
3. **Hierarchical layouts** - Top-to-bottom for trees
4. **Grid layouts** - For regular structures

### Interaction Tips

1. **Hover before clicking** - See what you're selecting
2. **Use preview line** - Ensure correct edge creation
3. **Drag to organize** - After adding many vertices
4. **Right-click carefully** - Only when ready to delete

---

## 🐛 Troubleshooting

### Issue: Can't Click on Vertex

**Solution:**

- Ensure you're clicking directly on the circle
- 24px radius should be easy to hit
- Try hovering first to confirm

### Issue: Edge Not Creating

**Solution:**

- Make sure exactly 2 vertices are selected
- Check status message at bottom
- Edge might already exist

### Issue: Can't Drag Vertex

**Solution:**

- Click and hold, don't just click
- Drag while holding mouse button
- Release to drop at new position

### Issue: Accidental Deletion

**Solution:**

- Currently no undo (coming soon!)
- Use "Clear Graph" to start over
- Be careful with right-click

---

## 🚀 What's New

### Latest Features (Just Added!)

✅ **Full SVG Rendering** - Replaced canvas with scalable vector graphics  
✅ **Drag & Drop** - Move vertices anywhere smoothly  
✅ **Right-Click Delete** - Quick vertex/edge removal  
✅ **Edge Preview** - See where edge will connect  
✅ **Hover Highlights** - Visual feedback on all elements  
✅ **Smart Hit Detection** - Easy clicking on edges  
✅ **Selection Indicators** - Blue rings show selected vertices  
✅ **Status Messages** - Know what to do next

---

## 📊 Current Capabilities

- ✅ Interactive vertex creation
- ✅ Interactive edge creation
- ✅ Drag & drop repositioning
- ✅ Right-click deletion
- ✅ Directed/undirected graphs
- ✅ Real-time adjacency matrix
- ✅ Real-time adjacency list
- ✅ Graph statistics
- ✅ Hover effects
- ✅ Selection states

---

## 🔜 Coming Soon

- [ ] Algorithm visualization (DFS, BFS, Dijkstra)
- [ ] Weighted edges with labels
- [ ] Zoom and pan
- [ ] Undo/redo
- [ ] Keyboard shortcuts
- [ ] Export as image
- [ ] Load/save graph data
- [ ] Touch support for mobile

---

## 💡 Pro Tips

1. **Organize as you build** - Drag vertices to clean positions early
2. **Use the preview** - Watch the dashed line when creating edges
3. **Right-click to clean up** - Remove mistakes quickly
4. **Check representations** - Verify your graph structure in the panels
5. **Toggle graph type** - Switch between directed/undirected to see differences

---

## 🎓 Educational Use

Perfect for learning:

- Graph theory concepts
- Data structures
- Algorithm visualization
- Network topologies
- Dependency graphs
- State machines

---

## 📞 Need Help?

- Check `GraphCanvas.README.md` for technical details
- See `DOCUMENTATION.md` for full project architecture
- Review code comments in `src/components/GraphCanvas.tsx`

---

**Happy Graph Building! 🎉**

Made with ❤️ for Design and Analysis of Algorithms Project
