import { create } from 'zustand';
import {
  Garment,
  GarmentSize,
  GradingResult,
  MeasureToolState,
  Point2D,
  Project,
  CADTheme,
  CADUnit,
  CADEngineMode,
  CloViewMode,
  Language,
  SurfaceMode,
  AvatarPose,
  FabricPhysics,
  PatternComponent,
  InternalContour,
  CustomGarmentInput,
  EasyPatternStep,
  TukacadWorkflowStep,
  EasyPatternTool,
  TukacadTool,
} from '@shared/types';
import {
  createBasicBodice,
  EASY_PATTERN_GRADING_RULES,
  SIZE_COLOR_PALETTE,
  TUKACAD_GRADING_MATRIX,
  BASIC_BODICE_SIZE_TABLE,
} from '@shared/easyPatternConstants';
import {
  createDefaultBasicTShirt,
  createPoloTShirt,
  createCasualShirt,
  createChinoTrouser,
  createWomensBootCutPant,
  createMensTailoredSuitJacket,
  createDoubleBreastedBlazer,
  createDenimJeans,
  createFlaredSkirt,
  createSheathDress,
  createTrenchCoat,
  createBomberJacket,
  generateBlankGarmentFromInput,
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

  // TUKAcad Options & Display Settings
  cadTheme: CADTheme; // 'tukacad-black' | 'cad-slate' | 'blueprint-light'
  cadUnit: CADUnit; // 'in' | 'cm'
  showSeamAllowance: boolean;
  seamAllowanceWidthMm: number;
  showInternals: boolean;
  showGrainlines: boolean;
  showNotches: boolean;
  showPointLabels: boolean;

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
    | 'library'
    | 'walkSeam'
    | 'eFit'
    | 'seamAllowance'
    | 'dartPleat'
    | 'manualGarment'
    | 'editGarment'
    | 'editComponent'
    | 'addComponent';

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

  // TUKA Options actions
  setCADTheme: (theme: CADTheme) => void;
  setCADUnit: (unit: CADUnit) => void;
  toggleSeamAllowance: () => void;
  setSeamAllowanceWidth: (widthMm: number) => void;
  toggleInternals: () => void;
  toggleGrainlines: () => void;
  toggleNotches: () => void;
  togglePointLabels: () => void;

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

  // CLO 3D Standalone Studio States
  cadEngineMode: CADEngineMode;
  cloViewMode: CloViewMode;
  language: Language;
  isSimulating: boolean;
  windEnabled: boolean;
  surfaceMode: SurfaceMode;
  selectedAvatarPose: AvatarPose;
  avatarVisible: boolean;
  garmentVisible: boolean;
  activeFabric: FabricPhysics;
  activeLibraryTab: string;
  activeRightTab: 'none' | 'objectBrowser' | 'propertyEditor';
  activeLeftDrawer: 'library' | 'history' | 'modular' | 'none';

  // CLO 3D Actions
  setCADEngineMode: (mode: CADEngineMode) => void;
  setCloViewMode: (mode: CloViewMode) => void;
  setLanguage: (lang: Language) => void;
  toggleSimulation: () => void;
  toggleWind: () => void;
  setSurfaceMode: (mode: SurfaceMode) => void;
  setSelectedAvatarPose: (pose: AvatarPose) => void;
  toggleAvatarVisible: () => void;
  toggleGarmentVisible: () => void;
  setActiveFabric: (fabric: Partial<FabricPhysics>) => void;
  setActiveLibraryTab: (tab: string) => void;
  setActiveRightTab: (tab: 'none' | 'objectBrowser' | 'propertyEditor') => void;
  setActiveLeftDrawer: (drawer: 'library' | 'history' | 'modular' | 'none') => void;

  // EasyPattern Workflow State (Steps 1 to 8)
  easyPatternStep: EasyPatternStep;
  setEasyPatternStep: (step: EasyPatternStep) => void;
  easyPatternTool: EasyPatternTool;
  setEasyPatternTool: (tool: EasyPatternTool) => void;
  garmentCategory: 'Women' | 'Men' | 'Children' | 'Custom';
  setGarmentCategory: (category: 'Women' | 'Men' | 'Children' | 'Custom') => void;
  garmentType: string;
  setGarmentType: (type: string) => void;
  selectedSizeRange: GarmentSize[];
  setSelectedSizeRange: (range: GarmentSize[]) => void;
  toggleSizeInRange: (size: GarmentSize) => void;
  measurementInputMode: 'manual' | 'sizechart';
  setMeasurementInputMode: (mode: 'manual' | 'sizechart') => void;
  seamAllowanceCm: number;
  setSeamAllowanceCm: (val: number) => void;
  notchSizeCm: number;
  setNotchSizeCm: (val: number) => void;
  showEasyPatternLabel: boolean;
  setShowEasyPatternLabel: (show: boolean) => void;
  showEasyPatternGrainline: boolean;
  setShowEasyPatternGrainline: (show: boolean) => void;
  showEasyPatternGrading: boolean;
  setShowEasyPatternGrading: (show: boolean) => void;
  markerWidthCm: number;
  setMarkerWidthCm: (w: number) => void;
  fabricLengthMeters: number;
  setFabricLengthMeters: (l: number) => void;

  // TUKAcad Workflow State (Steps 1 to 6)
  tukacadWorkflowStep: TukacadWorkflowStep;
  setTukacadWorkflowStep: (step: TukacadWorkflowStep) => void;
  tukacadTool: TukacadTool;
  setTukacadTool: (tool: TukacadTool) => void;
  tukaPointCoords: { x: number; y: number };
  setTukaPointCoords: (coords: { x: number; y: number }) => void;
  tukaLineLengthCm: number;
  setTukaLineLengthCm: (len: number) => void;
  markerUtilization: number;
  setMarkerUtilization: (u: number) => void;

  // Workflow Guide Modal State
  isWorkflowModalOpen: boolean;
  setIsWorkflowModalOpen: (open: boolean) => void;
  activeGuideStep: { mode: 'easypattern' | 'tukacad'; step: number } | null;
  setActiveGuideStep: (step: { mode: 'easypattern' | 'tukacad'; step: number } | null) => void;

  // Cross-Engine Transitions
  transferToTukacad: () => void;
  transferToEasyPattern: () => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Project Management
  loadProject: (project: Project) => void;
  createNewProject: (title?: string) => void;
  loadGarmentTemplate: (
    templateId:
      | 'basic-bodice'
      | 'basic-tshirt'
      | 'polo'
      | 'shirt'
      | 'trouser'
      | 'bootcut-pant'
      | 'suit-jacket'
      | 'double-breasted-blazer'
      | 'denim-jeans'
      | 'flared-skirt'
      | 'sheath-dress'
      | 'trench-coat'
      | 'bomber-jacket'
  ) => void;
  createCustomGarment: (input: CustomGarmentInput) => void;
  updateGarmentInfo: (updates: { name?: string; category?: any; baseSize?: GarmentSize }) => void;
  addComponentToGarment: (component: PatternComponent) => void;
  updateComponent: (id: string, updates: Partial<PatternComponent>) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  setGarment: (garment: Garment) => void;
  setActiveModal: (modal: CADState['activeModal']) => void;
  setNotification: (msg: string | null) => void;

  // Piece Transformation & 16-Tool Vector Editing
  moveComponent: (id: string, dx: number, dy: number, recordHistory?: boolean) => void;
  updatePointPosition: (componentId: string, cmdIdx: number, ptIdx: number, newX: number, newY: number, recordHistory?: boolean) => void;
  addPointToComponent: (componentId: string, point: Point2D) => void;
  addInternalLine: (componentId: string, p1: Point2D, p2: Point2D, name?: string) => void;
  addInternalContour: (componentId: string, contour: InternalContour) => void;
  addNotchToComponent: (componentId: string, point: Point2D) => void;
  addLabelToComponent: (componentId: string, text: string, pos: Point2D) => void;
  mirrorComponent: (componentId: string, axis?: 'x' | 'y') => void;
  rotateComponent: (componentId: string, angleDegrees?: number) => void;
  offsetComponentContour: (componentId: string, deltaMm: number) => void;
  filletCornerPoint: (componentId: string, cmdIdx: number, ptIdx: number, radius?: number) => void;
  trimNearestInternalOrNotch: (componentId: string, point: Point2D) => void;
  breakSegmentAtPoint: (componentId: string, point: Point2D) => void;
  joinEndpoints: (componentId: string) => void;
}

const initialGarment = createBasicBodice();
const initialProject: Project = {
  id: 'proj-basic-bodice-001',
  title: 'Basic Bodice — TUKAdesign CAD Studio [1-Object Parametric Engine v4.8]',
  description: '2-Piece Authentic Sloper (Front Bodice & Back Bodice) with Bust, Waist & Shoulder Darts.',
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
  panOffset: { x: 30, y: 20 },
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

  // TUKAcad Options
  cadTheme: 'tukacad-black',
  cadUnit: 'in',
  showSeamAllowance: true,
  seamAllowanceWidthMm: 12.7,
  showInternals: true,
  showGrainlines: true,
  showNotches: true,
  showPointLabels: true,

  setCADTheme: (theme) => set({ cadTheme: theme }),
  setCADUnit: (unit) => set({ cadUnit: unit }),
  toggleSeamAllowance: () => set((state) => ({ showSeamAllowance: !state.showSeamAllowance })),
  setSeamAllowanceWidth: (widthMm) => set({ seamAllowanceWidthMm: widthMm }),
  toggleInternals: () => set((state) => ({ showInternals: !state.showInternals })),
  toggleGrainlines: () => set((state) => ({ showGrainlines: !state.showGrainlines })),
  toggleNotches: () => set((state) => ({ showNotches: !state.showNotches })),
  togglePointLabels: () => set((state) => ({ showPointLabels: !state.showPointLabels })),

  // CLO 3D Standalone Studio Initial State
  cadEngineMode: 'tukacad',
  cloViewMode: 'split',
  language: 'en',

  isSimulating: true,
  windEnabled: false,
  surfaceMode: 'textured',
  selectedAvatarPose: 'FV2_01_A',
  avatarVisible: true,
  garmentVisible: true,
  activeFabric: {
    id: 'fab-silk-01',
    name: 'Silk Charmeuse 16mm',
    type: 'Silk',
    color: '#a5f3fc',
    stretchWarp: 15,
    stretchWeft: 28,
    bending: 12,
    shear: 18,
    density: 110,
    thickness: 0.28,
    roughness: 0.35,
    metalness: 0.1,
  },
  activeLibraryTab: 'Avatar',
  activeRightTab: 'none',
  activeLeftDrawer: 'library',

  // CLO 3D Actions
  setCADEngineMode: (mode) => set({ cadEngineMode: mode }),
  setCloViewMode: (mode) => set({ cloViewMode: mode }),
  setLanguage: (lang) => set({ language: lang }),
  toggleSimulation: () => set((s) => ({ isSimulating: !s.isSimulating })),
  toggleWind: () => set((s) => ({ windEnabled: !s.windEnabled })),
  setSurfaceMode: (mode) => set({ surfaceMode: mode }),
  setSelectedAvatarPose: (pose) => set({ selectedAvatarPose: pose }),
  toggleAvatarVisible: () => set((s) => ({ avatarVisible: !s.avatarVisible })),
  toggleGarmentVisible: () => set((s) => ({ garmentVisible: !s.garmentVisible })),
  setActiveFabric: (fabricUpdate) =>
    set((s) => ({ activeFabric: { ...s.activeFabric, ...fabricUpdate } })),
  setActiveLibraryTab: (tab) => set({ activeLibraryTab: tab }),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  setActiveLeftDrawer: (drawer) => set({ activeLeftDrawer: drawer }),

  // EasyPattern Workflow Defaults
  easyPatternStep: 1,
  setEasyPatternStep: (step) => set({ easyPatternStep: step }),
  easyPatternTool: 'select',
  setEasyPatternTool: (tool) => set({ easyPatternTool: tool }),
  garmentCategory: 'Women',
  setGarmentCategory: (category) => set({ garmentCategory: category }),
  garmentType: 'Basic Bodice',
  setGarmentType: (type) => set({ garmentType: type }),
  selectedSizeRange: ['S', 'M', 'L', 'XL', 'XXL'],
  setSelectedSizeRange: (range) => set({ selectedSizeRange: range }),
  toggleSizeInRange: (size) =>
    set((s) => {
      const exists = s.selectedSizeRange.includes(size);
      const updated = exists
        ? s.selectedSizeRange.filter((x) => x !== size)
        : [...s.selectedSizeRange, size];
      return { selectedSizeRange: updated.length ? updated : [size] };
    }),
  measurementInputMode: 'manual',
  setMeasurementInputMode: (mode) => set({ measurementInputMode: mode }),
  seamAllowanceCm: 1.0,
  setSeamAllowanceCm: (val) => set({ seamAllowanceCm: val }),
  notchSizeCm: 0.3,
  setNotchSizeCm: (val) => set({ notchSizeCm: val }),
  showEasyPatternLabel: true,
  setShowEasyPatternLabel: (show) => set({ showEasyPatternLabel: show }),
  showEasyPatternGrainline: true,
  setShowEasyPatternGrainline: (show) => set({ showEasyPatternGrainline: show }),
  showEasyPatternGrading: true,
  setShowEasyPatternGrading: (show) => set({ showEasyPatternGrading: show }),
  markerWidthCm: 150,
  setMarkerWidthCm: (w) => set({ markerWidthCm: w }),
  fabricLengthMeters: 87.5,
  setFabricLengthMeters: (l) => set({ fabricLengthMeters: l }),

  // TUKAcad Workflow Defaults
  tukacadWorkflowStep: 1,
  setTukacadWorkflowStep: (step) => set({ tukacadWorkflowStep: step }),
  tukacadTool: 'point',
  setTukacadTool: (tool) => set({ tukacadTool: tool }),
  tukaPointCoords: { x: 12.5, y: 8.2 },
  setTukaPointCoords: (coords) => set({ tukaPointCoords: coords }),
  tukaLineLengthCm: 24.3,
  setTukaLineLengthCm: (len) => set({ tukaLineLengthCm: len }),
  markerUtilization: 88.7,
  setMarkerUtilization: (u) => set({ markerUtilization: u }),

  // Workflow Guide Modal
  isWorkflowModalOpen: false,
  setIsWorkflowModalOpen: (open) => set({ isWorkflowModalOpen: open }),
  activeGuideStep: null,
  setActiveGuideStep: (step) => set({ activeGuideStep: step }),

  // Cross-Engine Transitions
  transferToTukacad: () => {
    set({
      cadEngineMode: 'tukacad',
      tukacadWorkflowStep: 3,
      gradingNotification: 'Pattern transferred to TUKAcAd Studio!',
    });
    setTimeout(() => set({ gradingNotification: null }), 3000);
  },
  transferToEasyPattern: () => {
    set({
      cadEngineMode: 'easypattern',
      easyPatternStep: 3,
      gradingNotification: 'Pattern loaded into EasyPattern Studio!',
    });
    setTimeout(() => set({ gradingNotification: null }), 3000);
  },

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
    if (templateId === 'basic-bodice') {
      newGarment = createBasicBodice();
    } else if (templateId === 'polo') {
      newGarment = createPoloTShirt();
    } else if (templateId === 'shirt') {
      newGarment = createCasualShirt();
    } else if (templateId === 'trouser') {
      newGarment = createChinoTrouser();
    } else if (templateId === 'bootcut-pant') {
      newGarment = createWomensBootCutPant();
    } else if (templateId === 'suit-jacket') {
      newGarment = createMensTailoredSuitJacket();
    } else if (templateId === 'double-breasted-blazer') {
      newGarment = createDoubleBreastedBlazer();
    } else if (templateId === 'denim-jeans') {
      newGarment = createDenimJeans();
    } else if (templateId === 'flared-skirt') {
      newGarment = createFlaredSkirt();
    } else if (templateId === 'sheath-dress') {
      newGarment = createSheathDress();
    } else if (templateId === 'trench-coat') {
      newGarment = createTrenchCoat();
    } else if (templateId === 'bomber-jacket') {
      newGarment = createBomberJacket();
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

  createCustomGarment: (input: CustomGarmentInput) => {
    const { history, garment, currentProject } = get();
    const newGarment = generateBlankGarmentFromInput(input);
    set({
      garment: newGarment,
      currentSize: newGarment.currentSize,
      targetSize: newGarment.currentSize === 'S' ? 'M' : 'L',
      selectedComponentId: 'entire',
      currentProject: {
        ...currentProject,
        title: `${newGarment.name} — Custom Manual Pattern`,
        garment: newGarment,
        updatedAt: new Date().toISOString(),
      },
      history: [...history.slice(-25), garment],
      future: [],
      lastGradingResult: null,
      activeModal: 'none',
      gradingNotification: `Created custom garment: ${newGarment.name}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 3000);
  },

  updateGarmentInfo: (updates) => {
    const { garment, history, currentProject } = get();
    const updatedGarment: Garment = {
      ...garment,
      name: updates.name ?? garment.name,
      category: updates.category ?? garment.category,
      baseSize: updates.baseSize ?? garment.baseSize,
      currentSize: updates.baseSize ?? garment.currentSize,
    };
    set({
      garment: updatedGarment,
      currentSize: updatedGarment.currentSize,
      currentProject: {
        ...currentProject,
        title: `${updatedGarment.name} — Size ${updatedGarment.currentSize}`,
        garment: updatedGarment,
        updatedAt: new Date().toISOString(),
      },
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Garment metadata updated: ${updatedGarment.name}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  addComponentToGarment: (component: PatternComponent) => {
    const { garment, history, currentProject } = get();
    const updatedGarment: Garment = {
      ...garment,
      components: [...garment.components, component],
    };
    set({
      garment: updatedGarment,
      currentProject: {
        ...currentProject,
        garment: updatedGarment,
        updatedAt: new Date().toISOString(),
      },
      selectedComponentId: component.id,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Added piece: ${component.name}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  updateComponent: (id: string, updates: Partial<PatternComponent>) => {
    const { garment, history, currentProject } = get();
    const updatedComponents = garment.components.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    const updatedGarment: Garment = {
      ...garment,
      components: updatedComponents,
    };
    set({
      garment: updatedGarment,
      currentProject: {
        ...currentProject,
        garment: updatedGarment,
        updatedAt: new Date().toISOString(),
      },
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Updated piece settings`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  removeComponent: (id: string) => {
    const { garment, history, currentProject, selectedComponentId } = get();
    if (garment.components.length <= 1) {
      set({ gradingNotification: 'A garment must have at least one pattern piece' });
      setTimeout(() => set({ gradingNotification: null }), 2500);
      return;
    }
    const updatedComponents = garment.components.filter((c) => c.id !== id);
    const updatedGarment: Garment = {
      ...garment,
      components: updatedComponents,
    };
    set({
      garment: updatedGarment,
      selectedComponentId: selectedComponentId === id ? 'entire' : selectedComponentId,
      currentProject: {
        ...currentProject,
        garment: updatedGarment,
        updatedAt: new Date().toISOString(),
      },
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Removed pattern piece`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  duplicateComponent: (id: string) => {
    const { garment, history, currentProject } = get();
    const comp = garment.components.find((c) => c.id === id);
    if (!comp) return;

    const newId = `${comp.id}-copy-${Date.now().toString().slice(-4)}`;
    const cloned: PatternComponent = {
      ...JSON.parse(JSON.stringify(comp)),
      id: newId,
      pieceCode: comp.pieceCode ? `${comp.pieceCode}-CPY` : 'CPY',
      name: `${comp.name} (Copy)`,
      offset: { x: comp.offset.x + 30, y: comp.offset.y + 30 },
    };

    const updatedGarment: Garment = {
      ...garment,
      components: [...garment.components, cloned],
    };
    set({
      garment: updatedGarment,
      selectedComponentId: newId,
      currentProject: {
        ...currentProject,
        garment: updatedGarment,
        updatedAt: new Date().toISOString(),
      },
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Cloned piece: ${cloned.name}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
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

  // Piece Transformation & 16-Tool Vector Editing Implementations
  moveComponent: (id, dx, dy, recordHistory = false) => {
    const { garment, history } = get();
    const updatedComponents = garment.components.map((c) =>
      c.id === id
        ? {
            ...c,
            offset: {
              x: Math.round(c.offset.x + dx),
              y: Math.round(c.offset.y + dy),
            },
          }
        : c
    );
    const updatedGarment = { ...garment, components: updatedComponents };
    set({
      garment: updatedGarment,
      ...(recordHistory
        ? { history: [...history.slice(-25), garment], future: [] }
        : {}),
    });
  },

  updatePointPosition: (componentId, cmdIdx, ptIdx, newX, newY, recordHistory = false) => {
    const { garment, history } = get();
    const updatedComponents = garment.components.map((c) => {
      if (c.id !== componentId) return c;
      const updatedPaths = c.paths.map((cmd, cIdx) => {
        if (cIdx !== cmdIdx) return cmd;
        const updatedPoints = cmd.points.map((pt, pIdx) => {
          if (pIdx !== ptIdx) return pt;
          return { ...pt, x: Math.round(newX), y: Math.round(newY) };
        });
        return { ...cmd, points: updatedPoints };
      });
      return { ...c, paths: updatedPaths };
    });
    const updatedGarment = { ...garment, components: updatedComponents };
    set({
      garment: updatedGarment,
      ...(recordHistory
        ? { history: [...history.slice(-25), garment], future: [] }
        : {}),
    });
  },

  addPointToComponent: (componentId, point) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId) || garment.components[0];
    if (!comp) return;

    const newPoint = {
      x: Math.round(point.x),
      y: Math.round(point.y),
      name: `Grading Node (${Math.round(point.x)}, ${Math.round(point.y)})`,
    };

    // Insert point into paths
    const updatedPaths = [
      ...comp.paths,
      { type: 'L' as const, points: [newPoint], annotation: 'Added Precision Node' },
    ];

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) =>
        c.id === comp.id ? { ...c, paths: updatedPaths } : c
      ),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Added Anchor Node at (${newPoint.x}, ${newPoint.y})`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  addInternalLine: (componentId, p1, p2, name = 'Internal Line') => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId) || garment.components[0];
    if (!comp) return;

    const newLine: InternalContour = {
      id: `int-line-${Date.now()}`,
      name,
      type: 'line',
      points: [
        { x: Math.round(p1.x), y: Math.round(p1.y) },
        { x: Math.round(p2.x), y: Math.round(p2.y) },
      ],
      color: '#38bdf8',
    };

    const updatedComponents = garment.components.map((c) => {
      if (c.id !== comp.id) return c;
      return {
        ...c,
        internals: [...(c.internals || []), newLine],
      };
    });
    const updatedGarment = { ...garment, components: updatedComponents };
    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Created Internal Line: ${Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y))}mm`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  addInternalContour: (componentId, contour) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId) || garment.components[0];
    if (!comp) return;

    const updatedComponents = garment.components.map((c) => {
      if (c.id !== comp.id) return c;
      return {
        ...c,
        internals: [...(c.internals || []), contour],
      };
    });
    const updatedGarment = { ...garment, components: updatedComponents };
    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Placed ${contour.name} on ${comp.pieceCode || comp.name}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  addNotchToComponent: (componentId, point) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId) || garment.components[0];
    if (!comp) return;

    const newNotch = { x: Math.round(point.x), y: Math.round(point.y), name: 'Seam Notch' };
    const updatedComponents = garment.components.map((c) => {
      if (c.id !== comp.id) return c;
      return {
        ...c,
        notches: [...c.notches, newNotch],
      };
    });
    const updatedGarment = { ...garment, components: updatedComponents };
    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Added Seam Notch at (${newNotch.x}, ${newNotch.y})`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  addLabelToComponent: (componentId, text, pos) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId) || garment.components[0];
    if (!comp) return;

    const newLabel = {
      text,
      position: { x: Math.round(pos.x), y: Math.round(pos.y) },
      type: 'annotation',
    };
    const updatedComponents = garment.components.map((c) => {
      if (c.id !== comp.id) return c;
      return {
        ...c,
        labels: [...c.labels, newLabel],
      };
    });
    const updatedGarment = { ...garment, components: updatedComponents };
    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Added Pattern Text: "${text}"`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  mirrorComponent: (componentId, axis = 'x') => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId);
    if (!comp) {
      set({ gradingNotification: 'Select a pattern piece first to mirror' });
      setTimeout(() => set({ gradingNotification: null }), 2500);
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    comp.paths.forEach((cmd) =>
      cmd.points.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      })
    );
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const mirrorPt = (pt: Point2D): Point2D => ({
      ...pt,
      x: axis === 'x' ? Math.round(2 * cx - pt.x) : pt.x,
      y: axis === 'y' ? Math.round(2 * cy - pt.y) : pt.y,
    });

    const updatedPaths = comp.paths.map((cmd) => ({
      ...cmd,
      points: cmd.points.map(mirrorPt),
    }));
    const updatedNotches = comp.notches.map(mirrorPt);
    const updatedInternals = comp.internals?.map((int) => ({
      ...int,
      points: int.points.map(mirrorPt),
    }));
    const updatedGrainline = comp.grainline
      ? {
          ...comp.grainline,
          start: mirrorPt(comp.grainline.start),
          end: mirrorPt(comp.grainline.end),
        }
      : comp.grainline;
    const updatedLabels = comp.labels.map((lbl) => ({
      ...lbl,
      position: mirrorPt(lbl.position),
    }));

    const updatedComp = {
      ...comp,
      paths: updatedPaths,
      notches: updatedNotches,
      internals: updatedInternals,
      grainline: updatedGrainline,
      labels: updatedLabels,
    };

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) => (c.id === comp.id ? updatedComp : c)),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Mirrored ${comp.pieceCode || comp.name} ${axis === 'x' ? 'Horizontally' : 'Vertically'}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  rotateComponent: (componentId, angleDegrees = 45) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId);
    if (!comp) {
      set({ gradingNotification: 'Select a pattern piece first to rotate' });
      setTimeout(() => set({ gradingNotification: null }), 2500);
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    comp.paths.forEach((cmd) =>
      cmd.points.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      })
    );
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const rad = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotatePt = (pt: Point2D): Point2D => {
      const dx = pt.x - cx;
      const dy = pt.y - cy;
      return {
        ...pt,
        x: Math.round(cx + dx * cos - dy * sin),
        y: Math.round(cy + dx * sin + dy * cos),
      };
    };

    const updatedPaths = comp.paths.map((cmd) => ({
      ...cmd,
      points: cmd.points.map(rotatePt),
    }));
    const updatedNotches = comp.notches.map(rotatePt);
    const updatedInternals = comp.internals?.map((int) => ({
      ...int,
      points: int.points.map(rotatePt),
    }));
    const updatedGrainline = comp.grainline
      ? {
          ...comp.grainline,
          start: rotatePt(comp.grainline.start),
          end: rotatePt(comp.grainline.end),
        }
      : comp.grainline;
    const updatedLabels = comp.labels.map((lbl) => ({
      ...lbl,
      position: rotatePt(lbl.position),
    }));

    const updatedComp = {
      ...comp,
      paths: updatedPaths,
      notches: updatedNotches,
      internals: updatedInternals,
      grainline: updatedGrainline,
      labels: updatedLabels,
    };

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) => (c.id === comp.id ? updatedComp : c)),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Rotated ${comp.pieceCode || comp.name} by ${angleDegrees}°`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  offsetComponentContour: (componentId, deltaMm) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId);
    if (!comp) return;

    const currentSA = comp.seamAllowanceMm ?? 12.7;
    const nextSA = Math.max(0, +(currentSA + deltaMm).toFixed(1));

    const updatedComp = {
      ...comp,
      seamAllowanceMm: nextSA,
    };

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) => (c.id === comp.id ? updatedComp : c)),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Updated Seam Allowance: ${nextSA} mm (${(nextSA / 25.4).toFixed(2)} in)`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  filletCornerPoint: (componentId, cmdIdx, ptIdx, radius = 15) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId);
    if (!comp) return;

    const cmd = comp.paths[cmdIdx];
    if (!cmd || !cmd.points[ptIdx]) return;

    const targetPt = cmd.points[ptIdx];
    const updatedPaths = comp.paths.map((c, cIdx) => {
      if (cIdx !== cmdIdx) return c;
      return {
        ...c,
        type: 'Q' as const,
        points: [
          { x: targetPt.x, y: targetPt.y, isControl: true },
          { x: targetPt.x + radius, y: targetPt.y + radius, name: 'Filleted Corner' },
        ],
      };
    });

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) =>
        c.id === comp.id ? { ...c, paths: updatedPaths } : c
      ),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Filleted Corner (R=${radius}mm)`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  trimNearestInternalOrNotch: (componentId, point) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId);
    if (!comp) return;

    let removedType = '';
    let updatedInternals = comp.internals;
    if (comp.internals && comp.internals.length > 0) {
      const idx = comp.internals.findIndex((internal) =>
        internal.points.some((p) => Math.hypot(p.x - point.x, p.y - point.y) < 35)
      );
      if (idx !== -1) {
        removedType = `Internal Line "${comp.internals[idx].name}"`;
        updatedInternals = comp.internals.filter((_, i) => i !== idx);
      }
    }

    let updatedNotches = comp.notches;
    if (!removedType && comp.notches.length > 0) {
      const nIdx = comp.notches.findIndex((n) => Math.hypot(n.x - point.x, n.y - point.y) < 25);
      if (nIdx !== -1) {
        removedType = 'Seam Notch';
        updatedNotches = comp.notches.filter((_, i) => i !== nIdx);
      }
    }

    let updatedLabels = comp.labels;
    if (!removedType && comp.labels.length > 0) {
      const lIdx = comp.labels.findIndex((l) => Math.hypot(l.position.x - point.x, l.position.y - point.y) < 30);
      if (lIdx !== -1) {
        removedType = `Label "${comp.labels[lIdx].text}"`;
        updatedLabels = comp.labels.filter((_, i) => i !== lIdx);
      }
    }

    if (!removedType) {
      set({ gradingNotification: 'No line, notch or label found near cursor to trim' });
      setTimeout(() => set({ gradingNotification: null }), 2000);
      return;
    }

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) =>
        c.id === comp.id
          ? {
              ...c,
              internals: updatedInternals,
              notches: updatedNotches,
              labels: updatedLabels,
            }
          : c
      ),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Trimmed ${removedType}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  breakSegmentAtPoint: (componentId, point) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId);
    if (!comp) return;

    const splitPt = { x: Math.round(point.x), y: Math.round(point.y), name: 'Split Point' };
    const updatedPaths = [
      ...comp.paths,
      { type: 'L' as const, points: [splitPt], annotation: 'Broken Segment' },
    ];

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) =>
        c.id === comp.id ? { ...c, paths: updatedPaths } : c
      ),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Broke segment at (${splitPt.x}, ${splitPt.y})`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },

  joinEndpoints: (componentId) => {
    const { garment, history } = get();
    const comp = garment.components.find((c) => c.id === componentId);
    if (!comp) return;

    const hasClose = comp.paths[comp.paths.length - 1]?.type === 'Z';
    if (hasClose) {
      set({ gradingNotification: 'Contour is already closed and joined' });
      setTimeout(() => set({ gradingNotification: null }), 2500);
      return;
    }

    const firstPt = comp.paths[0]?.points[0] || { x: 0, y: 0 };
    const updatedPaths = [
      ...comp.paths,
      { type: 'Z' as const, points: [{ x: firstPt.x, y: firstPt.y }] },
    ];

    const updatedGarment = {
      ...garment,
      components: garment.components.map((c) =>
        c.id === comp.id ? { ...c, paths: updatedPaths } : c
      ),
    };

    set({
      garment: updatedGarment,
      history: [...history.slice(-25), garment],
      future: [],
      gradingNotification: `Joined endpoints and closed contour for ${comp.pieceCode || comp.name}`,
    });
    setTimeout(() => set({ gradingNotification: null }), 2500);
  },
}));
