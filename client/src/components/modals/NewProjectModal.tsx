import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  PATTERN_DEFINITIONS,
  getPatternDefinition,
  validatePatternMeasurements,
  PatternDefinition,
} from '@shared/patternCatalog';
import {
  X,
  FolderPlus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Ruler,
  Layers,
  Check,
} from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { activeModal, setActiveModal, generatePatternFromWorkflow } = useCADStore();

  // Step in workflow: 'select-pattern' -> 'enter-measurements'
  const [workflowStep, setWorkflowStep] = useState<'select-pattern' | 'enter-measurements'>('select-pattern');
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Pattern-specific measurements entered by the user
  const [enteredMeasurements, setEnteredMeasurements] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (activeModal !== 'new') return null;

  const selectedPattern = selectedPatternId ? getPatternDefinition(selectedPatternId) : null;

  // Requirement 13: When user changes selected pattern, clear previous pattern-specific measurement form
  // and load only the new pattern's required measurements.
  const handleSelectPattern = (patternId: string) => {
    setSelectedPatternId(patternId);
    setEnteredMeasurements({}); // Clear previous measurements
    setValidationErrors({});
    setGeneralError(null);
  };

  const handleProceedToMeasurements = () => {
    if (!selectedPatternId) {
      setGeneralError('Please select a pattern to proceed.');
      return;
    }
    setGeneralError(null);
    setWorkflowStep('enter-measurements');
  };

  const handleBackToPatternSelection = () => {
    setWorkflowStep('select-pattern');
    setGeneralError(null);
  };

  const handleClose = () => {
    setActiveModal('none');
    setWorkflowStep('select-pattern');
    setSelectedPatternId(null);
    setEnteredMeasurements({});
    setValidationErrors({});
    setGeneralError(null);
  };

  const handleMeasurementChange = (key: string, value: string) => {
    setEnteredMeasurements((prev) => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  // Requirement 8, 9, 10: When user clicks "OK", validate measurements and generate ONLY selected pattern
  const handleOkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatternId || !selectedPattern) {
      setGeneralError('Please select exactly one pattern first.');
      setWorkflowStep('select-pattern');
      return;
    }

    // Convert string inputs to numbers
    const numericValues: Record<string, number | undefined> = {};
    for (const field of selectedPattern.measurements) {
      const raw = enteredMeasurements[field.key]?.trim();
      if (raw !== undefined && raw !== '') {
        const num = parseFloat(raw);
        numericValues[field.key] = isNaN(num) ? undefined : num;
      } else {
        numericValues[field.key] = undefined;
      }
    }

    // Validate all required measurements
    const validation = validatePatternMeasurements(selectedPatternId, numericValues);

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setGeneralError(
        `Please enter all required measurements for ${selectedPattern.name}. Missing or invalid: ${validation.missingFields.join(', ')}.`
      );
      return;
    }

    // All required measurements are valid! Generate ONLY the selected pattern
    const sanitizedMeasurements: Record<string, number> = {};
    for (const [k, v] of Object.entries(numericValues)) {
      if (v !== undefined) sanitizedMeasurements[k] = v;
    }

    generatePatternFromWorkflow(selectedPatternId, sanitizedMeasurements, 'cm');

    // Reset and close
    handleClose();
  };

  const categories = ['All', 'Women', 'Men', 'Unisex', 'Outerwear'];
  const filteredPatterns = selectedCategory === 'All'
    ? PATTERN_DEFINITIONS
    : PATTERN_DEFINITIONS.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between shrink-0 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">New File</h3>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-mono border border-blue-400/30">
                  Pattern Generation Workflow
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {workflowStep === 'select-pattern'
                  ? 'Step 1: Select exactly one pattern archetype'
                  : `Step 2: Enter required measurements for ${selectedPattern?.name || ''}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Cancel & Close (Ctrl+W / Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workflow Breadcrumb Indicator */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                workflowStep === 'select-pattern'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
                1
              </span>
              <span>Select Pattern</span>
              {selectedPattern && workflowStep === 'enter-measurements' && (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                workflowStep === 'enter-measurements'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
                2
              </span>
              <span>Enter Measurements</span>
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200 text-slate-500 text-[11px]">
              <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
                3
              </span>
              <span>Generate Pattern</span>
            </span>
          </div>

          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Pattern generated only after clicking OK
          </span>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-fadeIn shrink-0">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{generalError}</div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 1: PATTERN SELECTION SCREEN                               */}
        {/* ============================================================== */}
        {workflowStep === 'select-pattern' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {filteredPatterns.length} patterns available
              </span>
            </div>

            {/* Pattern Cards Grid (Requirement 3: Exactly one pattern selected) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredPatterns.map((pat) => {
                const isSelected = selectedPatternId === pat.id;
                return (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => handleSelectPattern(pat.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {pat.name}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {pat.category}
                          </span>
                          <span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">
                            {pat.piecesCount} Pcs
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {pat.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">
                        {pat.measurements.length} required measurements
                      </span>
                      {isSelected ? (
                        <span className="text-blue-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 hover:text-blue-600 font-medium">
                          Click to select
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: PATTERN-SPECIFIC MEASUREMENTS SCREEN                   */}
        {/* ============================================================== */}
        {workflowStep === 'enter-measurements' && selectedPattern && (
          <form id="new-file-measurements-form" onSubmit={handleOkSubmit} className="flex-1 flex flex-col overflow-hidden">
            {/* Selected Pattern Header Banner */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/60 flex items-center justify-between shrink-0 px-5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {selectedPattern.piecesCount}
                </div>
                <div>
                  <div className="font-extrabold text-xs text-blue-950 flex items-center gap-2">
                    <span>{selectedPattern.name}</span>
                    <span className="text-[10px] bg-blue-200/60 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                      {selectedPattern.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {selectedPattern.description}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBackToPatternSelection}
                className="text-xs text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 border border-blue-300 px-2.5 py-1 rounded-lg font-bold transition-colors shadow-2xs"
              >
                Change Pattern
              </button>
            </div>

            {/* Form Inputs (Requirement 4 & 5: ONLY required measurements for selected pattern) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enter Pattern-Specific Measurements (cm)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All measurements marked with <span className="text-red-500 font-bold">*</span> are required. No pattern will be generated until you click OK.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Quick-fill helper using standard reference defaults
                    const standardValues: Record<string, string> = {};
                    selectedPattern.measurements.forEach((m) => {
                      standardValues[m.key] = String(m.defaultValue || '');
                    });
                    setEnteredMeasurements(standardValues);
                    setValidationErrors({});
                    setGeneralError(null);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors"
                  title="Fill standard reference specifications for this archetype"
                >
                  Fill Standard Specs
                </button>
              </div>

              {/* Grid of Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPattern.measurements.map((field) => {
                  const val = enteredMeasurements[field.key] || '';
                  const hasError = Boolean(validationErrors[field.key]);
                  return (
                    <div
                      key={field.key}
                      className={`p-3 rounded-xl border transition-all ${
                        hasError
                          ? 'bg-red-50/50 border-red-300 ring-1 ring-red-400'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-800 text-xs flex items-center gap-1">
                          <span>{field.label}</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {field.unit}
                        </span>
                      </div>

                      <div className="relative mt-1">
                        <input
                          type="number"
                          step="0.1"
                          value={val}
                          onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                          placeholder={field.placeholder || `e.g. ${field.defaultValue || ''}`}
                          className={`w-full bg-white border rounded-lg px-3 py-1.5 font-mono font-bold text-xs text-slate-900 focus:outline-none transition-all ${
                            hasError
                              ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                              : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                        />
                      </div>

                      {hasError ? (
                        <div className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                          <span>{validationErrors[field.key]}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 mt-1 truncate">
                          {field.description || `Range: ${field.min} - ${field.max} ${field.unit}`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* BOTTOM ACTION BUTTONS                                          */}
        {/* ============================================================== */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {workflowStep === 'select-pattern' ? (
              <button
                type="button"
                onClick={handleProceedToMeasurements}
                disabled={!selectedPatternId}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                  selectedPatternId
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Next: Enter Measurements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBackToPatternSelection}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                {/* Requirement 7, 8, 9, 10: "Click OK" -> validate -> generate ONLY selected pattern */}
                <button
                  type="button"
                  onClick={handleOkSubmit}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 fill-white text-blue-200" />
                  <span>OK</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
