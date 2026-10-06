import React, { useEffect } from 'react';
import { TopToolbar } from './components/TopToolbar';
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
import { useCADStore } from './store/useCADStore';

export const App: React.FC = () => {
  const { undo, redo, setActiveModal, setTool } = useCADStore();

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 select-none">
      {/* Top Application Toolbar */}
      <TopToolbar />

      {/* Main CAD 3-Pane Viewport */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Garments & 1-Object Hierarchy */}
        <LeftPanel />

        {/* Center: Interactive SVG Vector Canvas */}
        <PatternWorkspace />

        {/* Right: Proportional Vector Grading Panel */}
        <RightGradingPanel />
      </main>

      {/* Modal Dialogs */}
      <NewProjectModal />
      <OpenProjectModal />
      <SaveProjectModal />
      <ExportSvgModal />
      <JsonInspectorModal />
      <GradeTablesModal />
      <DatabaseConnectModal />
    </div>
  );
};

export default App;
