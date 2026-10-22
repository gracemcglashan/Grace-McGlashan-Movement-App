import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles, Check, Heart, ListFilter, ShieldAlert, Mic } from 'lucide-react';
import { MovementFlow } from '../types/flow';
import { PoseIllustration } from './PoseIllustration';
import { StepTimer } from './StepTimer';
import { DistressCard } from './DistressCard';

interface FlowViewerProps {
  flow: MovementFlow;
  onTryAgain: () => void;
}

export const FlowViewer: React.FC<FlowViewerProps> = ({ flow, onTryAgain }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showAllStepsModal, setShowAllStepsModal] = useState(false);

  const steps = flow.steps || [];
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsCompleted(false);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    setIsCompleted(false);
    setShowAllStepsModal(false);
  };

  const handleRestartFlow = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col px-4 pb-8">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-3 mb-2">
        <button
          onClick={onTryAgain}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBE5DC] hover:bg-[#DFD8CD] active:scale-95 text-[#4D463E] text-xs font-medium transition cursor-pointer"
          aria-label="Try again and record new mood"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>

        <button
          onClick={() => setShowAllStepsModal(!showAllStepsModal)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EBE5DC] hover:bg-[#DFD8CD] text-[#4D463E] text-xs font-medium transition cursor-pointer"
          aria-label="View all steps in flow"
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>All Steps ({totalSteps})</span>
        </button>
      </div>

      {/* Distress Card if serious distress was identified */}
      {(flow.distressDetected || flow.distressSupportMessage) && (
        <DistressCard message={flow.distressSupportMessage} />
      )}

      {/* Mood Identification & Flow Header */}
      <div className="bg-[#EFECE5] rounded-2xl p-4 mb-4 text-left border border-[#E0D9CD]">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#DDD6C9] text-[#4A433A] text-[11px] font-semibold uppercase tracking-wider">
            {flow.stressLevel || 'Custom Flow'}
          </span>
          <span className="text-xs font-medium text-[#736B60]">
            ⏱️ {flow.totalTime || '6 min'}
          </span>
        </div>
        <h2 className="text-xl font-serif-title font-semibold text-[#2C2A29] leading-tight">
          {flow.flowTitle}
        </h2>
        <p className="text-xs text-[#5D574E] mt-1.5 leading-relaxed italic">
          "{flow.moodSummary}"
        </p>

        {flow.transcribedText && (
          <div className="mt-3 pt-3 border-t border-[#DDD6C9] flex items-start gap-2">
            <Mic className="w-3.5 h-3.5 text-[#736B60] shrink-0 mt-0.5" />
            <div className="text-xs text-[#4A433A]">
              <span className="font-semibold text-[#38332D]">What you said: </span>
              <span className="italic">"{flow.transcribedText}"</span>
            </div>
          </div>
        )}
      </div>

      {/* Completion View */}
      {isCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border border-[#E5DFD4] shadow-sm flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#ECE7DE] text-[#4A443D] flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 fill-[#A89E90] text-[#4A443D]" />
          </div>

          <h3 className="text-2xl font-serif-title font-semibold text-[#2C2A29]">
            Flow Complete
          </h3>
          <p className="text-sm text-[#666056] mt-2 max-w-xs leading-relaxed">
            Take one deep, slow breath right here. Notice any softness you've created in your neck, spine, and mind.
          </p>

          <div className="w-full bg-[#F7F4EE] rounded-2xl p-4 my-6 text-left border border-[#EBE5DA]">
            <p className="text-xs font-medium text-[#7A7266] uppercase tracking-wider mb-2">
              Routine Summary:
            </p>
            <div className="space-y-1.5 text-xs text-[#484239]">
              {steps.map((st, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{st.poseName}</span>
                  <span className="text-[#8F877C] ml-auto">{st.durationSeconds}s</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <button
              onClick={onTryAgain}
              className="w-full py-3.5 px-4 bg-[#3E3832] hover:bg-[#2B2722] text-white rounded-2xl font-medium text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check in Again with New Mood</span>
            </button>
            <button
              onClick={handleRestartFlow}
              className="w-full py-3 px-4 bg-[#EFEBE4] hover:bg-[#E5DFD6] text-[#4F4840] rounded-2xl font-medium text-xs transition cursor-pointer"
            >
              Replay This Flow
            </button>
          </div>
        </div>
      ) : (
        /* Active Step Card */
        currentStep && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 text-center border border-[#E5DFD4] shadow-sm flex flex-col items-center">
            {/* Step Count & Target Area */}
            <div className="w-full flex items-center justify-between text-xs text-[#7A7268] mb-3">
              <span className="font-semibold tracking-wide">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F2EDE5] text-[#554E44] font-medium">
                {currentStep.targetArea}
              </span>
            </div>

            {/* Segmented Progress bar */}
            <div className="w-full grid gap-1 mb-5" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-colors duration-300 ${
                    i < currentStepIndex
                      ? 'bg-[#4A453E]'
                      : i === currentStepIndex
                      ? 'bg-[#8F877B]'
                      : 'bg-[#EAE4DC]'
                  }`}
                />
              ))}
            </div>

            {/* Pose Title */}
            <h3 className="text-xl sm:text-2xl font-serif-title font-semibold text-[#2C2A29] leading-snug">
              {currentStep.poseName}
            </h3>

            {/* Visual Illustration */}
            <div className="my-2 flex justify-center">
              <PoseIllustration type={currentStep.poseIconType} className="w-32 h-32 sm:w-36 sm:h-36" />
            </div>

            {/* 1. Instruction Card FIRST so user reads comfortably */}
            <div className="w-full bg-[#FAF7F2] rounded-2xl p-4 my-3 border border-[#EAE3D6] text-left">
              <div className="text-[11px] font-semibold text-[#6E665A] uppercase tracking-wider mb-1">
                How to do this pose:
              </div>
              <p className="text-sm text-[#2C2A29] leading-relaxed font-normal">
                {currentStep.instruction}
              </p>
              {currentStep.breathTip && (
                <div className="mt-2.5 pt-2.5 border-t border-[#EAE3D6] flex items-start gap-2 text-xs text-[#5D554A]">
                  <span className="font-semibold text-[#3D372F] shrink-0">🌬️ Breath:</span>
                  <span>{currentStep.breathTip}</span>
                </div>
              )}
            </div>

            {/* Space constraint note */}
            <div className="text-[11px] text-[#8C8477] mb-2">
              ✨ Beginner safe &bull; Small space friendly &bull; No equipment needed
            </div>

            {/* 2. Built-in Timer AFTER description */}
            <div className="w-full my-2 pt-2 border-t border-[#F0ECE4]">
              <StepTimer
                initialSeconds={currentStep.durationSeconds}
                stepIndex={currentStepIndex}
                onStepComplete={handleNext}
                autoAdvance={autoAdvance}
              />
            </div>

            {/* Bottom Actions: Prev & Next */}
            <div className="w-full flex items-center gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="flex-1 py-3 px-4 rounded-2xl border border-[#DCD5C9] bg-white text-[#4A443E] font-medium text-sm hover:bg-[#F8F6F2] disabled:opacity-30 disabled:pointer-events-none transition flex items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-[2] py-3.5 px-6 rounded-2xl bg-[#3E3832] hover:bg-[#292520] active:scale-98 text-white font-medium text-sm shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                aria-label={currentStepIndex === totalSteps - 1 ? 'Finish flow' : 'Next pose'}
              >
                <span>{currentStepIndex === totalSteps - 1 ? 'Finish Flow' : 'Next Pose'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Optional Auto-Advance Switch */}
            <div className="w-full flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#EFECE5]">
              <label htmlFor="auto-advance-toggle" className="text-xs text-[#736C61] cursor-pointer flex items-center gap-2">
                <input
                  id="auto-advance-toggle"
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded text-[#4A443E] focus:ring-0 focus:outline-none"
                />
                <span>Auto-advance when timer completes</span>
              </label>
            </div>
          </div>
        )
      )}

      {/* All Steps Modal / Drawer */}
      {showAllStepsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#FBF9F5] rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] flex flex-col shadow-2xl border border-[#E8E1D5]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
              <h3 className="font-serif-title font-semibold text-lg text-[#2C2A29]">
                Flow Sequence ({totalSteps} steps)
              </h3>
              <button
                onClick={() => setShowAllStepsModal(false)}
                className="text-xs px-2.5 py-1 bg-[#EBE5DC] rounded-lg text-[#4A443E] font-medium"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2 flex-1">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => handleJumpToStep(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 cursor-pointer ${
                    idx === currentStepIndex
                      ? 'bg-white border-[#5A534B] shadow-xs'
                      : 'bg-white/60 hover:bg-white border-[#E8E1D5]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#EFECE5] flex items-center justify-center text-xs font-semibold text-[#5A534B] shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C2A29] truncate">
                      {step.poseName}
                    </p>
                    <p className="text-[11px] text-[#787166] truncate">
                      {step.targetArea} &bull; {step.durationSeconds}s
                    </p>
                  </div>
                  {idx === currentStepIndex && (
                    <span className="text-[10px] uppercase font-bold text-[#4A443E] bg-[#EFECE5] px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
