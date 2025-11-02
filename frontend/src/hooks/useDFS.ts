import { useState, useCallback, useEffect, useRef } from "react";
import type { Graph } from "../types/graph";
import type {
  DFSStep,
  AlgorithmStatus,
  AlgorithmVisualizationState,
  VertexState,
} from "../types/algorithm";
import { getDFSSteps } from "../utils/graphAlgorithms";

interface UseDFSOptions {
  graph: Graph;
  startVertexId: string | null;
  animationSpeed: number; // in milliseconds
}

export function useDFS({
  graph,
  startVertexId,
  animationSpeed,
}: UseDFSOptions) {
  const [steps, setSteps] = useState<DFSStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [status, setStatus] = useState<AlgorithmStatus>("idle");
  const [visualizationState, setVisualizationState] =
    useState<AlgorithmVisualizationState>({
      currentStep: 0,
      totalSteps: 0,
      vertexStates: new Map(),
      highlightedEdges: new Set(),
      stack: [],
      visited: new Set(),
      description: "Ready to start DFS",
    });

  const animationTimerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  // Initialize DFS steps when start vertex changes
  useEffect(() => {
    if (startVertexId && graph.vertices.length > 0) {
      try {
        const dfsSteps = getDFSSteps(graph, startVertexId);
        setSteps(dfsSteps);
        setCurrentStepIndex(-1);
        setStatus("idle");
        updateVisualizationState(-1, dfsSteps);
      } catch (error) {
        console.error("Error generating DFS steps:", error);
        setSteps([]);
      }
    } else {
      setSteps([]);
      setCurrentStepIndex(-1);
      setStatus("idle");
      updateVisualizationState(-1, []);
    }
  }, [startVertexId, graph]);

  // Update visualization state based on current step
  const updateVisualizationState = useCallback(
    (stepIndex: number, stepsArray: DFSStep[]) => {
      if (stepIndex < 0 || stepsArray.length === 0) {
        // Reset state
        setVisualizationState({
          currentStep: 0,
          totalSteps: stepsArray.length,
          vertexStates: new Map(),
          highlightedEdges: new Set(),
          stack: [],
          visited: new Set(),
          description:
            stepsArray.length > 0 ? "Ready to start DFS" : "No steps available",
        });
        return;
      }

      const step = stepsArray[stepIndex];
      const vertexStates = new Map<string, VertexState>();
      const highlightedEdges = new Set<string>();

      // Set vertex states
      graph.vertices.forEach((vertex) => {
        if (step.currentVertex === vertex.id) {
          vertexStates.set(vertex.id, "current");
        } else if (step.visitedVertices.has(vertex.id)) {
          vertexStates.set(vertex.id, "visited");
        } else if (step.stack.includes(vertex.id)) {
          vertexStates.set(vertex.id, "visiting");
        } else {
          vertexStates.set(vertex.id, "unvisited");
        }
      });

      // Highlight edge if present in step
      if (step.edge) {
        highlightedEdges.add(`${step.edge.from}-${step.edge.to}`);
      }

      // Collect all visited edges up to current step
      for (let i = 0; i <= stepIndex; i++) {
        if (stepsArray[i].edge) {
          highlightedEdges.add(
            `${stepsArray[i].edge!.from}-${stepsArray[i].edge!.to}`
          );
        }
      }

      setVisualizationState({
        currentStep: stepIndex + 1,
        totalSteps: stepsArray.length,
        vertexStates,
        highlightedEdges,
        stack: [...step.stack],
        visited: new Set(step.visitedVertices),
        description: step.description,
      });
    },
    [graph]
  );

  // Start/Resume DFS animation
  const start = useCallback(() => {
    if (steps.length === 0) return;

    setStatus("running");
    isPausedRef.current = false;

    const runAnimation = () => {
      if (isPausedRef.current) return;

      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;

        if (nextIndex >= steps.length) {
          setStatus("complete");
          return prev;
        }

        updateVisualizationState(nextIndex, steps);

        if (nextIndex < steps.length - 1 && !isPausedRef.current) {
          animationTimerRef.current = setTimeout(runAnimation, animationSpeed);
        } else if (nextIndex === steps.length - 1) {
          setStatus("complete");
        }

        return nextIndex;
      });
    };

    // Start from current position or beginning
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(-1);
      updateVisualizationState(-1, steps);
      setTimeout(runAnimation, 100);
    } else {
      runAnimation();
    }
  }, [steps, currentStepIndex, animationSpeed, updateVisualizationState]);

  // Pause DFS animation
  const pause = useCallback(() => {
    isPausedRef.current = true;
    setStatus("paused");
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  }, []);

  // Resume DFS animation
  const resume = useCallback(() => {
    if (status === "paused") {
      start();
    }
  }, [status, start]);

  // Go to next step
  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      updateVisualizationState(nextIndex, steps);

      if (nextIndex === steps.length - 1) {
        setStatus("complete");
      } else if (status === "idle") {
        setStatus("paused");
      }
    }
  }, [currentStepIndex, steps, status, updateVisualizationState]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      updateVisualizationState(prevIndex, steps);
      setStatus("paused");
    } else if (currentStepIndex === 0) {
      setCurrentStepIndex(-1);
      updateVisualizationState(-1, steps);
      setStatus("idle");
    }
  }, [currentStepIndex, steps, updateVisualizationState]);

  // Reset DFS to initial state
  const reset = useCallback(() => {
    isPausedRef.current = true;
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    setCurrentStepIndex(-1);
    setStatus("idle");
    updateVisualizationState(-1, steps);
  }, [steps, updateVisualizationState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  // Update animation when speed changes
  useEffect(() => {
    if (status === "running" && animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      pause();
      setTimeout(() => start(), 50);
    }
  }, [animationSpeed]);

  return {
    status,
    visualizationState,
    start,
    pause,
    resume,
    nextStep,
    previousStep,
    reset,
    canStepForward: currentStepIndex < steps.length - 1,
    canStepBackward: currentStepIndex >= 0,
  };
}
