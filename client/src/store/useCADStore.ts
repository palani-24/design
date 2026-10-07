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
}

const initialGarment = createMensTailoredSuitJacket();
const initialProject: Project = {
  id: 'proj-suit-jacket-001',
  title: 'Mens Tailored Suit Jacket — TUKAdesign CAD Studio v4.8',
  description: '16-Piece Industrial Nest with Back, Front, Sleeves, Side, Facing, Canvas & Fusing.',
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
}));
