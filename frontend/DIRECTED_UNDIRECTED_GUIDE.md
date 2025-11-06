# Directed vs Undirected Graphs - Complete Guide

## ✅ Feature Status: FULLY IMPLEMENTED

Your Graph Playground **already supports both directed and undirected graphs**! Here's how it works:

---

## 🎯 How to Switch Between Directed and Undirected Graphs

### **In the Frontend UI:**

1. **Locate the Toggle Switch**

   - Look at the **Control Panel** on the right side of the screen
   - At the top, you'll see a switch labeled:
     - "**Undirected Graph**" (when OFF/left)
     - "**Directed Graph**" (when ON/right)

2. **Toggle the Switch**

   - Click the switch to toggle between modes
   - **OFF (Left)** = Undirected Graph (no arrows on edges)
   - **ON (Right)** = Directed Graph (arrows showing direction)

3. **Visual Feedback**
   - The label text changes dynamically
   - Edges update in real-time to show/hide arrows

---

## 🔧 How It Works Internally

### **1. Graph State** (`src/types/graph.ts`)

```typescript
export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
  isDirected: boolean; // ← This controls directed/undirected mode
}
```

### **2. Toggle Function** (`src/hooks/useGraph.ts`)

```typescript
const toggleDirected = useCallback(() => {
  setGraph((prev) => ({
    ...prev,
    isDirected: !prev.isDirected, // Flips between true/false
  }));
}, []);
```

### **3. Visual Rendering** (`src/components/GraphCanvas.tsx`)

```typescript
// Draw arrow for directed graphs ONLY
if (graph.isDirected) {
  // Calculate arrow position and angle
  const angle = Math.atan2(
    toVertex.position.y - fromVertex.position.y,
    toVertex.position.x - fromVertex.position.x
  );
  const arrowLength = 18;
  const arrowAngle = Math.PI / 6;

  // Draw arrow head at end of edge
  ctx.fillStyle = "#8b5cf6";
  ctx.beginPath();
  ctx.moveTo(/* arrow tip */);
  ctx.lineTo(/* arrow left side */);
  ctx.lineTo(/* arrow right side */);
  ctx.closePath();
  ctx.fill();
}
```

### **4. Adjacency Matrix** (`src/components/RepresentationView.tsx`)

```typescript
matrix[fromIndex][toIndex] = 1;

// For undirected graphs, also set reverse direction
if (!graph.isDirected) {
  matrix[toIndex][fromIndex] = 1; // Symmetrical
}
```

### **5. Adjacency List**

```typescript
adjList[fromVertex.label].push(toVertex.label);

// For undirected graphs, add reverse edge
if (!graph.isDirected) {
  adjList[toVertex.label].push(fromVertex.label);
}
```

---

## 📊 Differences Between Modes

### **Directed Graph (isDirected = true)**

- **Edges**: Have arrows showing direction (A → B)
- **Meaning**: A→B does NOT mean B→A
- **Matrix**: Can be asymmetric

  ```plaintext

      A  B  C
  A [ 0  1  0 ]
  B [ 0  0  1 ]  ← Not symmetrical
  C [ 1  0  0 ]
  ```

- **List**: One-way relationships

  ```plaintext

  A → [B]
  B → [C]
  C → [A]
  ```

- **Use Cases**:
  - Social media followers (A follows B ≠ B follows A)
  - Web page links
  - Task dependencies

### **Undirected Graph (isDirected = false)**

- **Edges**: No arrows (A — B)
- **Meaning**: A—B means B—A (bidirectional)
- **Matrix**: Always symmetrical

  ```plaintext
      A  B  C
  A [ 0  1  1 ]
  B [ 1  0  1 ]  ← Symmetrical
  C [ 1  1  0 ]
  ```

- **List**: Two-way relationships

```plaintext
  A → [B, C]
  B → [A, C]
  C → [A, B]
```

- **Use Cases**:
  - Friendship networks (mutual)
  - Road networks (two-way streets)
  - Molecular structures

---

## 🎨 Visual Indicators

### **Control Panel UI:**

```tsx
<div className="flex items-center justify-between rounded-lg border p-2 bg-muted/50">
  <div className="flex items-center gap-2">
    <GitBranch className="h-4 w-4 text-muted-foreground" />
    <span className="text-sm font-medium">
      {isDirected ? "Directed Graph" : "Undirected Graph"}
    </span>
  </div>
  <Switch checked={isDirected} onCheckedChange={onToggleDirected} />
</div>
```

### **What You See:**

| Mode       | Toggle Position | Label              | Edge Appearance |
| ---------- | --------------- | ------------------ | --------------- |
| Undirected | ◯━━━ (OFF)      | "Undirected Graph" | Lines only      |
| Directed   | ━━━◯ (ON)       | "Directed Graph"   | Lines + Arrows  |

---

## 🚀 Testing It Out

### **Step-by-Step:**

1. **Open the app** (localhost:5173)

2. **Add some vertices** (A, B, C, D)

3. **Add edges** by clicking two vertices

4. **Start with Undirected** (default):

   - Toggle should be OFF (left)
   - Label says "Undirected Graph"
   - Edges have no arrows
   - Matrix is symmetrical

5. **Switch to Directed**:

   - Click the toggle switch
   - Toggle moves to ON (right)
   - Label changes to "Directed Graph"
   - Arrows appear on all edges
   - Matrix becomes asymmetrical

6. **Switch back to Undirected**:
   - Click toggle again
   - Arrows disappear
   - Matrix becomes symmetrical again

---

## 💡 Important Notes

### **Graph Type Affects:**

1. ✅ **Edge visualization** (arrows vs lines)
2. ✅ **Adjacency matrix** (symmetric vs asymmetric)
3. ✅ **Adjacency list** (bidirectional vs unidirectional)
4. ✅ **Algorithm behavior** (DFS/BFS traversal)
5. ✅ **Neighbor relationships** (getNeighbors function)

### **Graph Type Does NOT Affect:**

- Vertex placement or appearance
- Number of edges
- Edge colors or highlights
- Undo/redo history
- Algorithm controller

---

## 🔍 Code Files Involved

| File                                    | Purpose                                |
| --------------------------------------- | -------------------------------------- |
| `src/types/graph.ts`                    | Defines `isDirected` property          |
| `src/hooks/useGraph.ts`                 | Implements `toggleDirected()` function |
| `src/components/ControlPanel.tsx`       | UI toggle switch and dynamic label     |
| `src/components/GraphCanvas.tsx`        | Renders arrows for directed graphs     |
| `src/components/RepresentationView.tsx` | Generates matrix/list differently      |
| `src/utils/graphAlgorithms.ts`          | Handles neighbors based on direction   |
| `src/App.tsx`                           | Passes toggle handler to ControlPanel  |

---

## 🎯 Quick Reference

**To make a directed graph:**

```plaintext
Toggle Switch → ON (Right) → See arrows on edges
```

**To make an undirected graph:**

```plaintext
Toggle Switch → OFF (Left) → No arrows, just lines
```

**Current state is shown by:**

- Toggle position (left/right)
- Label text ("Directed" or "Undirected")
- Presence/absence of arrows on edges

---

## 📝 Summary

✅ **Fully implemented** - Both modes work perfectly!  
✅ **Easy switching** - Just click the toggle in Control Panel  
✅ **Visual feedback** - Label and arrows update instantly  
✅ **Affects everything** - Matrix, list, algorithms all respect the mode  
✅ **No code changes needed** - It's ready to use right now!

Just toggle the switch and watch your graph transform! 🎉

---

**Created:** November 6, 2025  
**Project:** Graph Playground - DAA Project  
**Author:** Saumy Bhargava (2024UCA1877)
