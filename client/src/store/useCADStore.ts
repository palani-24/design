import { create } from 'zustand';
import {
  Garment,
  GarmentSize,
  GradingResult,
  MeasureToolState,
  Point2D,
  Project,
} from '@shared/types';
import {
  createDefaultBasicTShirt,
  createPoloTShirt,
  createCasualShirt,
  createChinoTrouser,
} from '@shared/constants';
import { calculateDistance, gradeGarment } from '@shared/gradingEngine';

interface CADState {
  // Project & Garment
  currentProject: Project;
  garment: Garment;
  selectedComponentId: string | 'entire' | null;

  // Sizes for grading workflow
  currentSize: GarmentSize;
  targetSize: GarmentSize;

  // Viewport & Tools
  activeTool: 'select' | 'pan' | 'measure';
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  showRulers: boolean;
  cursorPos: { x: number; y: number };

  // Measurement tool state
  measureState: MeasureToolState;

  // Grading execution & results
  isGrading: boolean;
  activeGradingStep: 'idle' | 'neck' | 'shoulder' | 'bust' | 'waist' | 'hip' | 'hem';
  gradingNotification: string | null;
  lastGradingResult: GradingResult | null;

  // Active Modals
  activeModal:
    | 'none'
    | 'new'
    | 'open'
    | 'save'
    | 'export'
    | 'gradeTables'
    | 'jsonInspector'
    | 'dbConnect'
    | 'nesting'
    | 'techPack'
    | 'library';

  // Real Undo/Redo History Stack
  history: Garment[];
  future: Garment[];

  // Actions
  setTool: (tool: 'select' | 'pan' | 'measure') => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPanOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetView: () => void;
  fitToScreen: () => void;
  toggleGrid: () => void;
  toggleRulers: () => void;
  setCursorPos: (pos: { x: number; y: number }) => void;

  setSelectedComponent: (id: string | 'entire' | null) => void;
  selectEntireGarment: () => void;

  setCurrentSize: (size: GarmentSize) => void;
  setTargetSize: (size: GarmentSize) => void;

  // Moving Entire Garment moves Front, Back and Sleeve together
  moveEntireGarment: (dx: number, dy: number) => void;

  // Grading Action: S -> M
  executeGrading: (customTargetSize?: GarmentSize) => Promise<GradingResult>;

  // Measure Tool actions
  handleMeasureClick: (point: Point2D) => void;
  clearMeasure: () => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Project Management
  loadProject: (project: Project) => void;
  createNewProject: (title?: string) => void;
  loadGarmentTemplate: (templateId: 'basic-tshirt' | 'polo' | 'shirt' | 'trouser') => void;
  setGarment: (garment: Garment) => void;
  setActiveModal: (modal: CADState['activeModal']) => void;
  setNotification: (msg: string | null) => void;
}

const initialGarment = createDefaultBasicTShirt();
const initialProject: Project = {
  id: 'proj-basic-tshirt-001',
  title: 'Basic T-Shirt — Size S to M v1.4',
  description: '1-Object Parametric Nest with Front, Back and Sleeve components.',
  garment: initialGarment,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useCADStore = create<CADState>((set, get) => ({
  currentProject: initialProject,
  garment: initialGarment,
  selectedComponentId: 'entire', // Default to 1-Object Entire Garment!
  currentSize: initialGarment.currentSize,
  targetSize: 'M',

  activeTool: 'select',
  zoom: 1.0,
  panOffset: { x: 40, y: 30 },
  showGrid: true,
  showRulers: true,
  cursorPos: { x: 0, y: 0 },

  measureState: {
    active: false,
    startPoint: null,
    endPoint: null,
    currentDistanceMm: null,
    currentDistanceCm: null,
  },

  isGrading: false,
  activeGradingStep: 'idle',
  gradingNotification: null,
  lastGradingResult: null,
  activeModal: 'none',

  history: [],
  future: [],

  setTool: (tool) => {
    set({
      activeTool: tool,
      measureState: {
        active: tool === 'measure',
        startPoint: null,
        endPoint: null,
        currentDistanceMm: null,
        currentDistanceCm: null,
      },
    });
  },

  setZoom: (updater) => {
    set((state) => {
      const nextZoom = typeof updater === 'function' ? updater(state.zoom) : updater;
      return { zoom: Math.min(3.5, Math.max(0.2, nextZoom)) };
    });
  },

  setPanOffset: (updater) => {
    set((state) => ({
      panOffset: typeof updater === 'function' ? updater(state.panOffset) : updater,
    }));
  },

  resetView: () => {
    set({ zoom: 1.0, panOffset: { x: 40, y: 30 } });
  },

  fitToScreen: () => {
    set({ zoom: 0.85, panOffset: { x: 60, y: 40 } });
  },

  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
  setCursorPos: (pos) => set({ cursorPos: pos }),

  setSelectedComponent: (id) => set({ selectedComponentId: id }),
  selectEntireGarment: () => set({ selectedComponentId: 'entire' }),

  setCurrentSize: (size) => set({ currentSize: size }),
  setTargetSize: (size) => set({ targetSize: size }),

  moveEntireGarment: (dx, dy) => {
    const { garment, history } = get();
    // Record history snapshot before move
    const updatedGarment: Garment = {
      ...garment,
      position: {
        x: garment.position.x + dx,
        y: garment.position.y + dy,
      },
    };
    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
    });
  },

  executeGrading: async (customTargetSize) => {
    const state = get();
    const fromSize = state.currentSize;
    const toSize = customTargetSize || state.targetSize;

    if (fromSize === toSize) {
      set({ gradingNotification: `Garment is already size ${toSize}` });
      setTimeout(() => set({ gradingNotification: null }), 3000);
      throw new Error(`Garment is already size ${toSize}`);
    }

    set({
      isGrading: true,
      activeGradingStep: 'neck',
      gradingNotification: `Grading sequence in progress: Neck → Shoulder → Bust → Waist → Hip → Hem...`,
    });

    try {
      // Step sequentially through the 6 nodes: Neck -> Shoulder -> Bust -> Waist -> Hip -> Hem
      await new Promise((res) => setTimeout(res, 80));
      set({ activeGradingStep: 'shoulder' });
      await new Promise((res) => setTimeout(res, 80));
      set({ activeGradingStep: 'bust' });
      await new Promise((res) => setTimeout(res, 80));
      set({ activeGradingStep: 'waist' });
      await new Promise((res) => setTimeout(res, 80));
      set({ activeGradingStep: 'hip' });
      await new Promise((res) => setTimeout(res, 80));
      set({ activeGradingStep: 'hem' });
      await new Promise((res) => setTimeout(res, 80));

      // Execute 1-Object proportional vector grading
      const result = gradeGarment(state.garment, toSize, fromSize);

      // Push current garment to Undo stack
      const nextHistory = [...state.history.slice(-25), state.garment];

      set({
        garment: result.gradedGarment,
        currentSize: toSize,
        currentProject: {
          ...state.currentProject,
          garment: result.gradedGarment,
          updatedAt: new Date().toISOString(),
        },
        lastGradingResult: result,
        history: nextHistory,
        future: [],
        isGrading: false,
        activeGradingStep: 'idle',
        gradingNotification: `Grading Complete — ${fromSize} → ${toSize}`,
      });

      // Auto dismiss success toast after 5s
      setTimeout(() => {
        if (get().gradingNotification?.includes('Grading Complete')) {
          set({ gradingNotification: null });
        }
      }, 5000);

      return result;
    } catch (err) {
      set({ isGrading: false, activeGradingStep: 'idle', gradingNotification: `Grading failed: ${(err as Error).message}` });
      throw err;
    }
  },

  handleMeasureClick: (pt) => {
    const { measureState } = get();
    if (!measureState.startPoint || (measureState.startPoint && measureState.endPoint)) {
      // First point of new measurement
      set({
        measureState: {
          active: true,
          startPoint: pt,
          endPoint: null,
          currentDistanceMm: null,
          currentDistanceCm: null,
        },
      });
    } else {
      // Second point
      const distMm = calculateDistance(measureState.startPoint, pt);
      set({
        measureState: {
          active: true,
          startPoint: measureState.startPoint,
          endPoint: pt,
          currentDistanceMm: +distMm.toFixed(1),
          currentDistanceCm: +(distMm / 10).toFixed(2),
        },
      });
    }
  },

  clearMeasure: () => {
    set({
      measureState: {
        active: false,
        startPoint: null,
        endPoint: null,
        currentDistanceMm: null,
        currentDistanceCm: null,
      },
    });
  },

  undo: () => {
    const { history, garment, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    set({
      garment: previous,
      currentSize: previous.currentSize,
      history: newHistory,
      future: [garment, ...future],
      gradingNotification: `Undone action. Current size: ${previous.currentSize}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  redo: () => {
    const { history, garment, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      garment: next,
      currentSize: next.currentSize,
      history: [...history, garment],
      future: newFuture,
      gradingNotification: `Redone action. Current size: ${next.currentSize}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,

  loadProject: (project) => {
    set({
      currentProject: project,
      garment: project.garment,
      currentSize: project.garment.currentSize,
      history: [],
      future: [],
      lastGradingResult: null,
      gradingNotification: `Loaded project: ${project.title}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 3000);
  },

  createNewProject: (title) => {
    const freshGarment = createDefaultBasicTShirt();
    const freshProject: Project = {
      id: `proj-${Date.now()}`,
      title: title || 'Untitled Garment Pattern',
      garment: freshGarment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({
      currentProject: freshProject,
      garment: freshGarment,
      currentSize: freshGarment.currentSize,
      targetSize: 'M',
      history: [],
      future: [],
      lastGradingResult: null,
      gradingNotification: 'Created new project',
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  loadGarmentTemplate: (templateId) => {
    const { history, garment, currentProject } = get();
    let newGarment: Garment;
    if (templateId === 'polo') {
      newGarment = createPoloTShirt();
    } else if (templateId === 'shirt') {
      newGarment = createCasualShirt();
    } else if (templateId === 'trouser') {
      newGarment = createChinoTrouser();
    } else {
      newGarment = createDefaultBasicTShirt();
    }
    set({
      garment: newGarment,
      currentSize: newGarment.currentSize,
      targetSize: newGarment.currentSize === 'S' ? 'M' : 'L',
      selectedComponentId: 'entire',
      currentProject: {
        ...currentProject,
        title: `${newGarment.name} — Size ${newGarment.currentSize} to ${newGarment.currentSize === 'S' ? 'M' : 'L'}`,
        garment: newGarment,
        updatedAt: new Date().toISOString(),
      },
      history: [...history.slice(-25), garment],
      future: [],
      lastGradingResult: null,
      gradingNotification: `Loaded template: ${newGarment.name}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 3000);
  },

  setGarment: (garment) => {
    const { currentProject } = get();
    set({
      garment,
      currentSize: garment.currentSize,
      currentProject: {
        ...currentProject,
        garment,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  setActiveModal: (modal) => set({ activeModal: modal }),
  setNotification: (msg) => set({ gradingNotification: msg }),
}));
