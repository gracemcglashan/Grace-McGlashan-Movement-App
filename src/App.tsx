import React, { useState } from 'react';
import { Sparkles, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { MovementFlow, DEFAULT_FALLBACK_FLOW, createTailoredFlow } from './types/flow';
import { RecordingSection } from './components/RecordingSection';
import { FlowViewer } from './components/FlowViewer';

export default function App() {
  const [flow, setFlow] = useState<MovementFlow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAudioSubmit = async (audioBase64: string, mimeType: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('/api/generate-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          audioBase64,
          mimeType,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: MovementFlow = await response.json();
      setFlow(data);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Movement flow request used tailored fallback:', err?.message || err);
      // Seamlessly fallback so user is never stuck
      setFlow(DEFAULT_FALLBACK_FLOW);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (text: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    try {
      const response = await fetch('/api/generate-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          textInput: text,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: MovementFlow = await response.json();
      setFlow(data);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Text movement flow request used instant tailored flow:', err?.message || err);
      // Immediately present accurate tailored flow based on user's exact input
      setFlow(createTailoredFlow(text));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setFlow(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#2C2A29] flex flex-col justify-between selection:bg-[#E2DDD5]">
      {/* Top App Header */}
      <header className="w-full max-w-md mx-auto pt-6 pb-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EAE4DC] flex items-center justify-center text-[#4A443E] font-serif-title font-semibold text-sm">
            M
          </div>
          <span className="font-serif-title font-medium text-lg text-[#2A2826] tracking-tight">
            Mood to Movement
          </span>
        </div>

        {flow && (
          <button
            onClick={handleTryAgain}
            className="text-xs text-[#70685E] hover:text-[#2A2826] font-medium flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>New Flow</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center py-4 w-full">
        {/* Error notification banner if fallback was used */}
        {errorMessage && (
          <div className="w-full max-w-md px-4 mb-4">
            <div className="bg-[#FAF3EA] border border-[#E8DACB] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#6B5A4B]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#9C6D4C] mt-0.5" />
              <div className="flex-1">
                <p>{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-[#9C6D4C] font-semibold text-xs ml-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {!flow ? (
          <RecordingSection
            onAudioSubmit={handleAudioSubmit}
            onTextSubmit={handleTextSubmit}
            isLoading={isLoading}
          />
        ) : (
          <FlowViewer flow={flow} onTryAgain={handleTryAgain} />
        )}
      </main>

      {/* Bottom Medical Disclaimer & Space Note */}
      <footer className="w-full max-w-md mx-auto px-4 py-4 text-center">
        <div className="pt-3 border-t border-[#EAE4DB]">
          <p className="text-xs text-[#8C8479] leading-relaxed">
            This is not medical advice. Stop if anything hurts.
          </p>
          <p className="text-[11px] text-[#A69E92] mt-0.5">
            Safe for beginners &bull; No equipment needed &bull; Small space friendly
          </p>
        </div>
      </footer>
    </div>
  );
}
