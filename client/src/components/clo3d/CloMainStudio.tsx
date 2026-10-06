import React, { useEffect } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { CloTopBar } from './CloTopBar';
import { CloLeftDrawer } from './CloLeftDrawer';
import { Clo3DViewport } from './Clo3DViewport';
import { Clo2DPatternWindow } from './Clo2DPatternWindow';
import { CloRightPanel } from './CloRightPanel';
import { CloBottomBar } from './CloBottomBar';

export const CloMainStudio: React.FC = () => {
  const { cloViewMode, toggleSimulation } = useCADStore();

  // Spacebar shortcut to toggle simulation (Matches CLO 3D standard shortcut)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleSimulation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSimulation]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#16171b] select-none font-sans text-white">
      {/* 1. CLO 3D Top Header Bar */}
      <CloTopBar />

      {/* 2. Main CAD Workspace (Drawer + Viewports + Right Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Library & Poses Drawer */}
        <CloLeftDrawer />

        {/* Dynamic Center Viewport (Split / 3D / 2D) */}
        <div className="flex-1 flex h-full overflow-hidden relative">
          {/* Split Mode: 3D Left + 2D Right */}
          {cloViewMode === 'split' && (
            <>
              <div className="flex-1 h-full relative">
                <Clo3DViewport />
              </div>
              <div className="flex-1 h-full relative">
                <Clo2DPatternWindow />
              </div>
            </>
          )}

          {/* 3D Only Mode */}
          {cloViewMode === '3d-only' && (
            <div className="w-full h-full relative">
              <Clo3DViewport />
            </div>
          )}

          {/* 2D Only Mode */}
          {cloViewMode === '2d-only' && (
            <div className="w-full h-full relative">
              <Clo2DPatternWindow />
            </div>
          )}
        </div>

        {/* Right Object Browser & Property Editor Drawer */}
        <CloRightPanel />
      </div>

      {/* 3. CLO 3D Bottom Status Bar */}
      <CloBottomBar />
    </div>
  );
};
