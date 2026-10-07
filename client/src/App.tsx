import React, { useEffect } from 'react';
import { TukaMenuBar } from './components/TukaMenuBar';
import { LeftPanel } from './components/LeftPanel';
import { PatternWorkspace } from './components/PatternWorkspace';
import { RightGradingPanel } from './components/RightGradingPanel';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { OpenProjectModal } from './components/modals/OpenProjectModal';
import { SaveProjectModal } from './components/modals/SaveProjectModal';
import { ExportSvgModal } from './components/modals/ExportSvgModal';
import { JsonInspectorModal } from './components/modals/JsonInspectorModal';
import { GradeTablesModal } from './components/modals/GradeTablesModal';
import { DatabaseConnectModal } from './components/modals/DatabaseConnectModal';
import { NestingModal } from './components/modals/NestingModal';
import { TechPackModal } from './components/modals/TechPackModal';
import { LibraryModal } from './components/modals/LibraryModal';
import { WalkSeamModal } from './components/modals/WalkSeamModal';
import { EFitPreviewModal } from './components/modals/EFitPreviewModal';
import { SeamAllowanceModal } from './components/modals/SeamAllowanceModal';
import { DartPleatModal } from './components/modals/DartPleatModal';
import { ManualGarmentModal } from './components/modals/ManualGarmentModal';
import { EditGarmentModal } from './components/modals/EditGarmentModal';
import { EditComponentModal } from './components/modals/EditComponentModal';
import { AddComponentModal } from './components/modals/AddComponentModal';
import { CloMainStudio } from './components/clo3d/CloMainStudio';
import { EasyPatternStudio } from './components/easypattern/EasyPatternStudio';
import { CollabUnifiedStudio } from './components/collab/CollabUnifiedStudio';
import { TukaDrawingToolbar } from './components/tukacad/TukaDrawingToolbar';
import { WorkflowGuideModal } from './components/workflow/WorkflowGuideModal';
import { useCADStore } from './store/useCADStore';


export const App: React.FC = () => {
  const { undo, redo, setActiveModal, setTool, cadEngineMode } = useCADStore();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcut interception when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setActiveModal('save');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setActiveModal('open');
      } else if (e.key === 'v' || e.key === 'V') {
        setTool('select');
      } else if (e.key === 'h' || e.key === 'H') {
        setTool('pan');
      } else if (e.key === 'm' || e.key === 'M') {
        setTool('measure');
      } else if (e.key === 'Escape') {
        setActiveModal('none');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setActiveModal, setTool]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121316] select-none font-sans">
      {/* Dynamic Engine Workspace: EasyPattern / CLO 3D / Collab 3-in-1 / TUKAcad */}
      {cadEngineMode === 'easypattern' ? (
        <EasyPatternStudio />
      ) : cadEngineMode === 'clo3d' ? (
        <CloMainStudio />
      ) : cadEngineMode === 'collab' ? (
        <CollabUnifiedStudio />
      ) : (
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Top Application Toolbar & TUKA Windows Menu */}
          <TukaMenuBar />

          {/* TUKAcad 16 Vector Precision Drawing Tools (Step 2 of Workflow) */}
          <TukaDrawingToolbar />

          {/* Main CAD 3-Pane Viewport */}
          <main className="flex-1 flex overflow-hidden">
            {/* Left: Garments & 1-Object Hierarchy */}
            <LeftPanel />

            {/* Center: Interactive SVG Vector Canvas */}
            <PatternWorkspace />

            {/* Right: Proportional Vector Grading Panel */}
            <RightGradingPanel />
          </main>
        </div>
      )}

      {/* Global Interactive Workflow Guide Infographic Modal */}
      <WorkflowGuideModal />

      {/* Modal Dialogs Available in All Modes */}
      <NewProjectModal />
      <OpenProjectModal />
      <SaveProjectModal />
      <ExportSvgModal />
      <JsonInspectorModal />
      <GradeTablesModal />
      <DatabaseConnectModal />
      <NestingModal />
      <TechPackModal />
      <LibraryModal />
      <WalkSeamModal />
      <EFitPreviewModal />
      <SeamAllowanceModal />
      <DartPleatModal />
      <ManualGarmentModal />
      <EditGarmentModal />
      <EditComponentModal />
      <AddComponentModal />
    </div>
  );
};

export default App;

