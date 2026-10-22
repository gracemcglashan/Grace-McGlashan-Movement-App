import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, AlertCircle, PenLine, ArrowLeft, Check, Info } from 'lucide-react';

interface RecordingSectionProps {
  onAudioSubmit: (audioBase64: string, mimeType: string) => Promise<void>;
  onTextSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
}

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  hint: string;
}

const PRESET_MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'desk-neck',
    emoji: '💻',
    label: 'Stiff neck & shoulders',
    hint: 'e.g. working at desk, looking down at phone/laptop, carrying a bag',
  },
  {
    id: 'desk-back',
    emoji: '🪑',
    label: 'Tight lower back & hips',
    hint: 'e.g. sitting in a chair for hours, tight hip flexors, achy lumbar',
  },
  {
    id: 'burnout',
    emoji: '🧠',
    label: 'Mental burnout & brain fog',
    hint: 'e.g. long workday, feeling drained, need a calming mindful pause',
  },
  {
    id: 'anxious',
    emoji: '🌊',
    label: 'Anxious & restless energy',
    hint: 'e.g. racing mind, feeling tense, need grounding slow breathing',
  },
  {
    id: 'exhausted',
    emoji: '🛋️',
    label: 'Deep fatigue / Low energy',
    hint: 'e.g. wiped out, need effortless resting floor or bed stretches',
  },
  {
    id: 'bedtime',
    emoji: '🌙',
    label: 'Bedtime wind-down',
    hint: 'e.g. unwinding in bedroom before sleep, releasing day tension',
  },
  {
    id: 'morning',
    emoji: '☀️',
    label: 'Gentle morning wake-up',
    hint: 'e.g. morning stiffness, easing out of bed and waking up gently',
  },
  {
    id: 'standing',
    emoji: '🚶',
    label: 'On my feet / Leg fatigue',
    hint: 'e.g. walking or standing all day, sore calves and lower back',
  },
];

export const RecordingSection: React.FC<RecordingSectionProps> = ({
  onAudioSubmit,
  onTextSubmit,
  isLoading,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micDenied, setMicDenied] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [briefExplanation, setBriefExplanation] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const MAX_SECONDS = 30;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      window.cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setMicDenied(false);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Audio level analyser for visual feedback
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevel = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = window.requestAnimationFrame(updateLevel);
          };
          updateLevel();
        }
      } catch (e) {
        console.warn('Audio visualization context not available', e);
      }

      // Check supported MIME types across iPhone Safari, Chrome, Android
      const candidateTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/ogg;codecs=opus',
        '',
      ];
      let selectedType = '';
      for (const t of candidateTypes) {
        if (!t || (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t))) {
          selectedType = t;
          break;
        }
      }

      const options = selectedType ? { mimeType: selectedType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const rawMimeType = recorder.mimeType || selectedType || 'audio/webm';
        const cleanMime = rawMimeType.split(';')[0].trim() || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: cleanMime });

        cleanupAudio();
        setIsRecording(false);

        if (blob.size < 100) {
          console.warn("Recorded audio blob too small or empty:", blob.size);
          return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1] || '';
          if (base64Data) {
            onAudioSubmit(base64Data, cleanMime);
          }
        };
        reader.readAsDataURL(blob);
      };

      // Request data in chunks every 500ms
      recorder.start(500);
      setIsRecording(true);

      // 30-second timer
      const startTime = Date.now();
      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingSeconds(elapsed);
        if (elapsed >= MAX_SECONDS) {
          stopRecording();
        }
      }, 200);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      cleanupAudio();
      setIsRecording(false);
      setMicDenied(true);
      setShowTextInput(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const explanationTrimmed = briefExplanation.trim();
    if (!explanationTrimmed || isLoading) return;

    const selectedOption = PRESET_MOOD_OPTIONS.find((o) => o.id === selectedOptionId);

    // Combine selected category with user's specific explanation
    const combinedPrompt = selectedOption
      ? `Selected focus: "${selectedOption.label}". User's specific explanation: "${explanationTrimmed}". Please tailor the flow and title specifically to this user's situation and space.`
      : explanationTrimmed;

    onTextSubmit(combinedPrompt);
  };

  const handleSelectOption = (option: MoodOption) => {
    if (selectedOptionId === option.id) {
      // Toggle off
      setSelectedOptionId(null);
    } else {
      setSelectedOptionId(option.id);
    }
  };

  const selectedOption = PRESET_MOOD_OPTIONS.find((o) => o.id === selectedOptionId);
  const hasValidExplanation = briefExplanation.trim().length >= 4;
  const isSubmitDisabled = !hasValidExplanation || isLoading;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center px-4">
      {/* Intro Subtitle */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-[#EBE5DC] text-[#5A534B] text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
          Gentle Movement Guide
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#2C2A29] leading-snug">
          How is your body feeling right now?
        </h2>
        <p className="text-sm text-[#666059] mt-2 max-w-sm mx-auto leading-relaxed">
          {showTextInput
            ? "Pick an option and add a brief note about your situation to get your custom flow."
            : "Speak your mind or choose from options below to get your personalized flow."}
        </p>
      </div>

      {/* VIEW A: VOICE RECORDING SCREEN (When NOT in text/options mode) */}
      {!showTextInput && !isRecording && !isLoading && (
        <div className="w-full flex flex-col items-center">
          {/* Main Large Voice Button */}
          <button
            onClick={startRecording}
            className="group relative w-60 h-60 sm:w-68 sm:h-68 rounded-full bg-gradient-to-b from-[#EAE4DC] to-[#DDD5C9] hover:from-[#E2DCCE] hover:to-[#D5CCC0] active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg flex flex-col items-center justify-center p-6 border-4 border-white/80 cursor-pointer"
            aria-label="Tell me how you're feeling - Tap to record voice"
          >
            {/* Ambient soft glow ring */}
            <div className="absolute inset-0 rounded-full border border-[#D0C7B9] group-hover:scale-105 transition-transform duration-500 pointer-events-none" />

            <div className="w-18 h-18 rounded-full bg-white/90 shadow-sm flex items-center justify-center mb-3.5 group-hover:bg-white text-[#4A443E] transition-colors">
              <Mic className="w-8 h-8 text-[#5C544B]" />
            </div>

            <span className="text-lg sm:text-xl font-medium text-[#2C2824] px-2 leading-tight">
              Tell me how you're feeling
            </span>

            <span className="text-xs text-[#7A7369] mt-1.5 font-normal">
              Tap to speak (up to 30s)
            </span>
          </button>

          {/* Privacy Note directly near the record button */}
          <p className="text-xs text-[#827A70] mt-4 max-w-xs leading-relaxed">
            🔒 Your recording is only used to create your flow and isn't saved in this app.
          </p>

          {/* DEDICATED BUTTON TO OPT TO TYPE OR SELECT FROM OPTIONS */}
          <div className="mt-5 w-full">
            <button
              type="button"
              onClick={() => setShowTextInput(true)}
              className="w-full py-3.5 px-4 bg-white hover:bg-[#FAF6F0] text-[#3D3730] border border-[#DDD5C9] rounded-2xl font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <PenLine className="w-4 h-4 text-[#7A7268]" />
              <span>Prefer not to record? Type or pick from options</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: RECORDING IN PROGRESS UI */}
      {isRecording && (
        <div className="w-full flex flex-col items-center py-4">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#FAF5EE] border-4 border-[#E2DDD3] shadow-inner flex flex-col items-center justify-center p-6">
            {/* Pulse aura */}
            <div className="absolute inset-2 rounded-full border-2 border-rose-300/40 animate-record-ripple pointer-events-none" />

            {/* Audio waveform / volume feedback bars */}
            <div className="flex items-center justify-center gap-1.5 h-12 mb-4">
              {[0.3, 0.6, 0.9, 0.5, 0.8, 1.0, 0.7, 0.4].map((multiplier, i) => {
                const height = Math.max(8, Math.min(44, (audioLevel * multiplier * 0.7) + 8));
                return (
                  <span
                    key={i}
                    style={{ height: `${height}px` }}
                    className="w-1.5 bg-[#C95B5B] rounded-full transition-all duration-75"
                  />
                );
              })}
            </div>

            {/* Time Indicator */}
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-mono font-medium text-xl text-[#3A3530]">
                {recordingSeconds}s / {MAX_SECONDS}s
              </span>
            </div>

            <p className="text-xs text-[#7A7268] mb-4">
              Listening... speak naturally
            </p>

            {/* Stop Button */}
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3A3530] hover:bg-[#26221E] active:scale-95 text-white rounded-full font-medium text-sm shadow transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop &amp; Create Flow</span>
            </button>
          </div>

          <p className="text-xs text-[#827A70] mt-5 max-w-xs">
            Tap Stop whenever you're ready, or speak up to 30 seconds.
          </p>

          <button
            onClick={() => {
              stopRecording();
              setShowTextInput(true);
            }}
            className="mt-4 text-xs text-[#7A7268] hover:text-[#2C2A29] underline underline-offset-4 cursor-pointer"
          >
            Cancel recording &amp; type instead
          </button>
        </div>
      )}

      {/* VIEW C: LOADING / GENERATING STATE */}
      {isLoading && (
        <div className="w-full flex flex-col items-center justify-center py-12">
          <div className="relative w-28 h-28 rounded-full bg-[#EFECE5] flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[#D6CEC1] animate-ping opacity-30" />
            <Sparkles className="w-10 h-10 text-[#6B6155] animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h3 className="text-xl font-medium text-[#2C2A29]">
            Designing your flow...
          </h3>
          <p className="text-sm text-[#736B61] mt-2 max-w-xs">
            Personalizing beginner-safe poses tailored to your setting and energy.
          </p>
        </div>
      )}

      {/* VIEW D: TYPE OR SELECT OPTIONS SCREEN */}
      {showTextInput && !isRecording && !isLoading && (
        <div className="w-full text-left animate-fade-in">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                setShowTextInput(false);
                setMicDenied(false);
              }}
              className="flex items-center gap-1.5 text-xs text-[#5D554C] hover:text-[#2A2826] font-medium transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Voice Option</span>
            </button>
            <span className="text-[11px] text-[#8C8377] font-medium">
              No mic needed
            </span>
          </div>

          {/* Mic Denied Friendly Notice (if arrived here via permission denial) */}
          {micDenied && (
            <div className="mb-4 bg-[#FAF6F0] border border-[#E4DDD3] rounded-2xl p-4">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#8C7A68] shrink-0 mt-0.5" />
                <p className="text-xs text-[#6B635A] leading-relaxed">
                  Microphone access wasn't available. Please choose a focus below and write a brief note about how you're feeling.
                </p>
              </div>
            </div>
          )}

          {/* 1. Quick Select Options / Pills */}
          <div className="mb-4 bg-white border border-[#E2DDD3] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5A534B]">
                1. Select your primary focus:
              </span>
              {selectedOption && (
                <button
                  type="button"
                  onClick={() => setSelectedOptionId(null)}
                  className="text-[11px] text-[#8C8377] hover:text-[#3A3530] underline"
                >
                  Clear choice
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_MOOD_OPTIONS.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EDE7DE] border-[#4A453E] text-[#2C2A29] font-medium ring-1 ring-[#4A453E]'
                        : 'bg-[#FAF8F5] hover:bg-[#F3EFE9] border-[#E8E2D8] text-[#4A453E]'
                    }`}
                  >
                    <span className="text-base shrink-0">{option.emoji}</span>
                    <span className="flex-1 leading-snug">{option.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#3A3530] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Required Brief Explanation Area */}
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <div className="bg-white border border-[#E2DDD3] rounded-2xl p-4 shadow-2xs">
              <label htmlFor="mood-explanation" className="block text-xs font-semibold text-[#5A534B] mb-1 uppercase tracking-wider">
                2. Write a brief explanation: <span className="text-rose-600 font-bold">*</span>
              </label>

              {selectedOption ? (
                <div className="mb-2 text-xs text-[#6B635A] bg-[#F7F4EE] rounded-lg p-2 border border-[#E8E2D6] flex items-center gap-2">
                  <span className="font-medium text-[#3A3530]">Focus: {selectedOption.emoji} {selectedOption.label}</span>
                </div>
              ) : null}

              <textarea
                id="mood-explanation"
                rows={3}
                value={briefExplanation}
                onChange={(e) => setBriefExplanation(e.target.value)}
                placeholder={
                  selectedOption
                    ? `Add a brief note about what you're doing, your setting, or what feels tight (${selectedOption.hint})...`
                    : "Describe what you're doing, your space (e.g. apartment, office, bedroom), and what your body needs..."
                }
                className="w-full p-3 bg-[#FAF8F5] border border-[#DDD5C9] rounded-xl text-sm text-[#2C2A29] placeholder-[#9E958A] focus:outline-none focus:ring-2 focus:ring-[#6E6659] focus:border-transparent transition resize-none leading-relaxed"
              />

              {/* Requirement reminder hint */}
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className={hasValidExplanation ? "text-emerald-700 font-medium" : "text-[#8C8377]"}>
                  {hasValidExplanation
                    ? "✓ Brief explanation provided"
                    : "A brief note is required so your flow matches your exact setting."}
                </span>
                <span className="text-[#A39B8F]">
                  {briefExplanation.trim().length} chars
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full py-3.5 px-5 bg-[#3E3832] hover:bg-[#2B2722] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-medium text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {hasValidExplanation
                    ? "Create My Custom Flow"
                    : "Please write a brief explanation above"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowTextInput(false);
                  setMicDenied(false);
                }}
                className="py-3 px-4 bg-[#EFECE5] hover:bg-[#E4DFD6] text-[#524B43] rounded-2xl text-xs font-medium transition cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
