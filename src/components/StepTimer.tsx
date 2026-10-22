import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Timer as TimerIcon } from 'lucide-react';
import { chime } from '../utils/audioChime';

interface StepTimerProps {
  initialSeconds: number;
  stepIndex: number;
  onStepComplete?: () => void;
  autoAdvance?: boolean;
}

export const StepTimer: React.FC<StepTimerProps> = ({
  initialSeconds,
  stepIndex,
  onStepComplete,
  autoAdvance = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false); // Never auto-start; wait for user
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [muted, setMuted] = useState(chime.getMuted());

  const timerRef = useRef<number | null>(null);

  // When step changes, reset timer and keep paused so user can read first
  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsRunning(false);
    setHasStarted(false);
    setIsCompleted(false);
  }, [stepIndex, initialSeconds]);

  // Timer countdown tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            // Play gentle chime bell
            chime.playGentleBell();
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([100, 50, 100]);
            }
            if (onStepComplete && autoAdvance) {
              setTimeout(() => {
                onStepComplete();
              }, 1200);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, autoAdvance, onStepComplete]);

  const handleStart = () => {
    setHasStarted(true);
    setIsRunning(true);
  };

  const toggleRunning = () => {
    if (timeLeft === 0) {
      // If completed and tapped, restart
      setTimeLeft(initialSeconds);
      setIsRunning(true);
      setHasStarted(true);
      setIsCompleted(false);
    } else {
      setIsRunning(!isRunning);
      setHasStarted(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialSeconds);
    setHasStarted(false);
    setIsCompleted(false);
  };

  const toggleSound = () => {
    const isNowMuted = chime.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      chime.playGentleBell();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressFraction = Math.max(0, Math.min(1, (initialSeconds - timeLeft) / initialSeconds));
  const strokeDashoffset = 283 - 283 * progressFraction;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Unstarted State: Big, clear "Start Timer" button so they read first */}
      {!hasStarted && !isCompleted ? (
        <div className="w-full flex flex-col items-center py-2">
          <div className="text-center mb-3">
            <span className="font-mono text-2xl font-semibold text-[#2C2A29]">
              {formatTime(timeLeft)}
            </span>
            <p className="text-xs text-[#7A7368] mt-0.5">
              Read the instructions above, get comfortable, then tap to begin.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-[#3E3832] hover:bg-[#282420] active:scale-98 text-white font-medium text-sm shadow-sm transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Pose Timer ({initialSeconds}s)</span>
          </button>
        </div>
      ) : (
        /* Active or Completed Circular Progress Timer */
        <div className="flex flex-col items-center animate-fade-in w-full">
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-[#E8E2D8]"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Animated active progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-[#4A453E] transition-all duration-300"
                strokeWidth="5"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center time & status */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {isCompleted ? (
                <div className="flex flex-col items-center text-emerald-700 animate-fade-in">
                  <CheckCircle2 className="w-8 h-8 mb-0.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Done</span>
                </div>
              ) : (
                <>
                  <span className="font-mono text-3xl font-semibold text-[#2C2A29] tracking-tight">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#8A8277] font-medium mt-0.5">
                    {isRunning ? 'in progress' : 'paused'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-[#EBE5DC] hover:bg-[#E0D8CC] text-[#554E46] transition active:scale-95 cursor-pointer"
              title="Restart timer"
              aria-label="Restart step timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleRunning}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#3D3730] hover:bg-[#28231E] active:scale-95 text-white shadow transition-all cursor-pointer"
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            >
              {isRunning ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={toggleSound}
              className="p-2.5 rounded-full bg-[#EBE5DC] hover:bg-[#E0D8CC] text-[#554E46] transition active:scale-95 cursor-pointer"
              title={muted ? 'Unmute chime' : 'Mute chime'}
              aria-label={muted ? 'Unmute chime bell' : 'Mute chime bell'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
