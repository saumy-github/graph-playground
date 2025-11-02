# Quick Start Guide - Graph Playground

## What You Have Now

✅ **Complete Project Structure**

- `src/components/` - All UI components (Header, Canvas, Controls, Representations)
- `src/types/` - TypeScript interfaces for Graph, Vertex, Edge
- `src/hooks/` - Custom useGraph hook for state management
- `src/utils/` - Graph algorithms and helper functions

✅ **Tailwind CSS Configured**

- Full utility-first CSS framework set up
- PostCSS configured
- Production-ready styling

✅ **Production-Ready Features**

- Interactive graph canvas
- Add/remove vertices
- Create edges by clicking vertices
- Toggle directed/undirected graphs
- Real-time adjacency matrix
- Real-time adjacency list
- Graph statistics display

## Development Server

The server is currently running on: **<http://localhost:5174/>**

To start again later:

```bash
cd frontend
npm run dev
```

## Project Customization

### Update Student Information

Edit `src/App.tsx` line 44-46:

```typescript
<Header
  studentName="Saumy Bhargava"
  rollNumber="2024UCA1877"
  projectTitle="Graph Playground - DAA Project"
/>
```

### Change Color Scheme

All colors use Tailwind CSS classes. Main colors:

- Header: `bg-gradient-to-r from-blue-600 to-purple-600`
- Add Vertex: `bg-blue-600`
- Add Edge: `bg-green-600`
- Clear: `bg-red-600`
- DFS: `bg-purple-600`
- BFS: `bg-indigo-600`
- Dijkstra: `bg-orange-600`

## File Structure Overview

```c
frontend/src/
├── components/
│   ├── Header.tsx              ← Top banner
│   ├── GraphCanvas.tsx         ← Main canvas (left side)
│   ├── ControlPanel.tsx        ← Buttons (top right)
│   └── RepresentationView.tsx  ← Matrix/List (bottom right)
│
├── types/
│   └── graph.ts               ← Vertex, Edge, Graph types
│
├── hooks/
│   └── useGraph.ts            ← Graph state management
│
├── utils/
│   ├── graphAlgorithms.ts     ← DFS, BFS, etc.
│   └── graphHelpers.ts        ← Import/export, random gen
│
└── App.tsx                    ← Main layout
```

## Key Features to Implement Next

### 1. Algorithm Visualization

Currently, algorithms just show alerts. To implement:

- Add animation state to `useGraph` hook
- Create step-by-step traversal
- Highlight vertices during traversal
- Show order of visitation

### 2. Weighted Edges

Add weight property to Edge interface:

```typescript
interface Edge {
  from: string;
  to: string;
  weight?: number; // Add this
}
```

### 3. Drag and Drop Vertices

Add drag handlers to GraphCanvas:

```typescript
const [draggedVertex, setDraggedVertex] = useState<string | null>(null);
// Add onMouseDown, onMouseMove, onMouseUp handlers
```

### 4. Delete Individual Elements

Add delete mode to control panel:

```typescript
const [deleteMode, setDeleteMode] = useState(false);
// Right-click or click in delete mode removes element
```

## Common Tasks

### Add a New Component

1. Create file in `src/components/`
2. Export from `src/components/index.ts`
3. Import in `App.tsx`

### Add a New Algorithm

1. Add function to `src/utils/graphAlgorithms.ts`
2. Add button in `ControlPanel.tsx`
3. Add handler in `App.tsx`

### Style Changes

Use Tailwind utility classes:

- Spacing: `p-4`, `m-2`, `space-y-4`
- Colors: `bg-blue-500`, `text-white`
- Layout: `flex`, `grid`, `grid-cols-12`
- Size: `w-full`, `h-64`, `text-xl`

## Testing Checklist

- [ ] Add vertices by clicking canvas
- [ ] Add vertices by button click
- [ ] Create edges by selecting two vertices
- [ ] Toggle directed/undirected mode
- [ ] View adjacency matrix updates
- [ ] View adjacency list updates
- [ ] Check graph statistics
- [ ] Clear graph works
- [ ] Responsive layout (resize window)

## Deployment

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Deploy!

## Troubleshooting

### Port Already in Use

If port 5173 is busy, Vite auto-selects next port (5174, 5175, etc.)

### Tailwind Not Working

Check `index.css` has these lines:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### TypeScript Errors

Run type check:

```bash
npm run build
```

### Hot Reload Not Working

Restart dev server:

```bash
# Stop with Ctrl+C
npm run dev
```

## Resources

- **React Docs:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite:** https://vite.dev/guide

## Questions?

Check `DOCUMENTATION.md` for detailed technical documentation.
