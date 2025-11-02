# DFS Visualization - Quick Start Guide

## How to Use DFS Visualization

### Step 1: Create Your Graph

1. **Add Vertices**: Click anywhere on the canvas to add vertices
2. **Add Edges**: Click on two vertices in sequence to create an edge between them
3. **Toggle Direction**: Use the "Directed Graph" switch if needed

### Step 2: Launch DFS

1. Click the **"Depth First Search"** button in the Control Panel
2. The Algorithm Controller will appear on the right side

### Step 3: Configure (Optional)

- **Start Vertex**: Select which vertex to start from (default: first vertex)
- **Animation Speed**: Adjust slider for faster (500ms) or slower (2000ms) animation

### Step 4: Run Visualization

#### Automatic Mode

1. Click **Play** button
2. Watch the algorithm animate automatically
3. Observe:
   - Vertex colors changing (Blue → Yellow → Red → Green)
   - Stack contents updating
   - Current operation description
   - Visited vertices list

#### Manual Mode

1. Click **Next Step** to advance one step at a time
2. Click **Previous Step** to go back
3. Read the operation description for each step

#### Pause & Resume

- Click **Pause** during automatic animation
- Click **Resume** to continue from where you paused

### Step 5: Complete & Review

- When traversal completes, view statistics:
  - Total steps taken
  - Vertices visited
  - Coverage percentage
- Click **Reset** to exit and return to graph editing

## Vertex Color Guide

- 🔵 **Blue** = Unvisited (not yet encountered)
- 🟡 **Yellow** = In Stack (waiting to be visited)
- 🔴 **Red** = Current (being processed now)
- 🟢 **Green** = Visited (completely processed)

## Tips

1. **Start Simple**: Try with 3-4 vertices first
2. **Experiment**: Test directed vs undirected graphs
3. **Observe Stack**: Watch how DFS uses a stack (Last-In-First-Out)
4. **Try Different Starts**: See how different start vertices affect traversal order
5. **Manual Steps**: Use step controls to understand each action in detail

## Example Workflow

```plaintext
1. Add vertices A, B, C, D
2. Create edges: A→B, A→C, B→D
3. Click "Depth First Search"
4. Select start vertex: A
5. Set speed: 1000ms
6. Click Play
7. Watch: A(current) → push B,C → visit B → push D → visit D → backtrack → visit C
8. View completion statistics
9. Click Reset
```

## Troubleshooting

**Algorithm won't start?**

- Make sure you have at least one vertex
- Check that a start vertex is selected

**Can't see color changes?**

- Try slowing down the animation speed
- Use manual step controls for detailed observation

**Want to start over?**

- Click Reset button to return to graph editing mode
- You can modify the graph and run again

Enjoy exploring Depth-First Search! 🚀
