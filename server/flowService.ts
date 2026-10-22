import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import dotenv from "dotenv";
import { FlowStep, MovementFlow, DEFAULT_FALLBACK_FLOW, createTailoredFlow } from "../src/types/flow.ts";

dotenv.config();

export type { FlowStep, MovementFlow };
export { DEFAULT_FALLBACK_FLOW };

const SYSTEM_INSTRUCTION = `You are a gentle, certified somatic yoga and mobility therapist for "Mood to Movement".
The user is speaking or typing how they are feeling right now (their physical sensations, emotions, energy level, or stress).
Your job is to listen/read with deep empathy, identify their mood and stress level, and generate a customized, beginner-friendly 5 to 10 minute stretch or gentle yoga flow suited to that exact state.

CRITICAL CONSTRAINTS:
1. SAFETY & SPACE:
   - 100% safe for beginners.
   - Doable in any small space (e.g. living room corner, bedroom, home office, or anywhere with a couple feet of floor or a chair).
   - Needs NO equipment (no yoga mat or blocks required; can be done on carpet/rug, floor, bed edge, or desk chair).
   - No extreme bends, headstands, inversions, or joint straining.
   - IMPORTANT: DO NOT assume the user lives in a dorm room or is a college student unless they explicitly state it. Avoid putting "Dorm" in flow titles or instructions unless the user specifically said they are in a dorm room.
2. DURATION & STEPS:
   - 4 to 6 steps total.
   - Total duration must be 5 to 10 minutes (between 300 and 600 total seconds).
   - Each step's durationSeconds must be between 45 and 90 seconds (typically 60s or 75s).
3. DESCRIPTIONS:
   - poseName: clear, recognizable, inviting name (e.g. "Gentle Neck & Shoulder Softener", "Standing Ragdoll Fold", "Seated Heart Opener", "Lying Knee Hug & Rock").
   - instruction: EXACTLY ONE clear, reassuring sentence describing how to do the move comfortably in a small space.
   - breathTip: a brief breath cue (e.g. "Slow inhale for 4 counts, long soft exhale for 6 counts").
   - targetArea: targeted body area (e.g. "Neck & Shoulders", "Lower Back", "Hips", "Chest & Posture", "Nervous System").
   - poseIconType: must be one of: "neck", "chest", "back", "hips", "fold", "rest", "twist", "breathing".
4. DISTRESS CHECK:
   - If the user expresses serious distress, thoughts of self-harm, severe crisis, trauma, or overwhelming despair:
     - Set distressDetected: true
     - Provide distressSupportMessage: A warm, compassionate note gently suggesting reaching out to a trusted person, counselor, or calling/texting the 988 Lifeline.
     - Provide an ultra-gentle, effortless grounding and breathing sequence (no demanding moves).
   - Otherwise, set distressDetected: false and distressSupportMessage: null.
5. SUMMARY & TITLE:
   - moodSummary: exactly ONE empathetic sentence validating what they shared and how their body is feeling.
   - flowTitle: a warm, evocative 3-5 word title tailored to their specific feeling (e.g. "Shoulder Ease & Tension Release", "Gentle Rain Calming Flow", "Midday Desk Break Reset", "Evening Grounding & Ease").
   - totalTime: e.g. "6 min" or "7 min".`;

function sanitizeMimeType(mime?: string): string {
  if (!mime) return "audio/webm";
  const base = mime.split(";")[0].trim().toLowerCase();
  if (base.includes("webm")) return "audio/webm";
  if (base.includes("mp4") || base.includes("m4a")) return "audio/mp4";
  if (base.includes("aac")) return "audio/aac";
  if (base.includes("ogg")) return "audio/ogg";
  if (base.includes("wav")) return "audio/wav";
  return base || "audio/webm";
}

export async function generateMovementFlow(params: {
  audioBase64?: string;
  mimeType?: string;
  textInput?: string;
}): Promise<MovementFlow> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment, returning tailored flow");
    return createTailoredFlow(params.textInput || "");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  let effectiveText = (params.textInput || "").trim();
  let detectedTranscript: string | null = null;

  // STEP 1: If audio was uploaded, transcribe and listen to what the user said
  if (params.audioBase64) {
    const cleanMime = sanitizeMimeType(params.mimeType);
    console.log(`Transcribing audio with clean MIME: ${cleanMime}`);

    // Try dedicated transcription model first, then fallback to multimodal flash models
    const transcribeCandidates = ["gemini-3.5-transcribe", "gemini-3.6-flash", "gemini-3.8-flash"];

    for (const modelName of transcribeCandidates) {
      try {
        const transRes = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: cleanMime,
                  data: params.audioBase64,
                },
              },
              {
                text: "Transcribe what the speaker is saying about how their body, mood, or stress feels. Return only the transcription.",
              },
            ],
          },
        });

        const text = transRes.text?.trim();
        if (text && text.length > 2) {
          detectedTranscript = text;
          effectiveText = text;
          console.log(`Successfully transcribed audio (${modelName}): "${text}"`);
          break;
        }
      } catch (err: any) {
        console.warn(`Transcription attempt with ${modelName} failed:`, err?.message || err);
      }
    }
  }

  // Base fallback derived from whatever user said or typed
  const baseFallback = createTailoredFlow(effectiveText);
  if (detectedTranscript) {
    baseFallback.transcribedText = detectedTranscript;
  }

  // STEP 2: Generate personalized movement flow JSON
  // Models to try in order of current availability
  const generationModels = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-flash"];

  const timeoutMs = params.audioBase64 ? 18000 : 6000;

  for (const model of generationModels) {
    try {
      const parts: any[] = [];

      if (effectiveText) {
        parts.push({
          text: `The user shared how they are feeling: "${effectiveText}". Analyze their mood, stress level, and body tension, and design their personalized 5-10 minute gentle movement flow.`,
        });
      } else if (params.audioBase64) {
        // Direct multimodal analysis fallback if transcription was empty
        const cleanMime = sanitizeMimeType(params.mimeType);
        parts.push({
          inlineData: {
            mimeType: cleanMime,
            data: params.audioBase64,
          },
        });
        parts.push({
          text: "Listen to the user's voice, identify their physical tension and mood, and design their 5-10 minute gentle movement flow.",
        });
      } else {
        return baseFallback;
      }

      const aiPromise = ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              moodSummary: {
                type: Type.STRING,
                description: "One empathetic sentence validating their mood and tension.",
              },
              stressLevel: {
                type: Type.STRING,
                description: "Short stress level description.",
              },
              flowTitle: {
                type: Type.STRING,
                description: "Calm 3-5 word title for the routine.",
              },
              totalTime: {
                type: Type.STRING,
                description: "Formatted duration like '6 min' or '7 min'.",
              },
              steps: {
                type: Type.ARRAY,
                description: "4 to 6 gentle beginner-friendly movement steps.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    poseName: { type: Type.STRING },
                    durationSeconds: { type: Type.INTEGER },
                    instruction: { type: Type.STRING },
                    breathTip: { type: Type.STRING },
                    targetArea: { type: Type.STRING },
                    poseIconType: {
                      type: Type.STRING,
                      description: "One of: 'neck', 'chest', 'back', 'hips', 'fold', 'rest', 'twist', 'breathing'",
                    },
                  },
                  required: ["poseName", "durationSeconds", "instruction", "breathTip", "targetArea", "poseIconType"],
                },
              },
              distressDetected: {
                type: Type.BOOLEAN,
                description: "True if user expressed serious crisis, self-harm, or severe emotional distress.",
              },
              distressSupportMessage: {
                type: Type.STRING,
                description: "Compassionate message with counseling/988 suggestion if in distress, or null.",
              },
            },
            required: ["moodSummary", "stressLevel", "flowTitle", "totalTime", "steps", "distressDetected"],
          },
        },
      });

      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), timeoutMs);
      });

      const response = await Promise.race([aiPromise, timeoutPromise]);

      if (response && response.text) {
        const parsed = JSON.parse(response.text) as MovementFlow;
        if (parsed.steps && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
          if (detectedTranscript) {
            parsed.transcribedText = detectedTranscript;
          }
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next candidate:`, err?.status || err?.message || err);
    }
  }

  // Graceful return using what was heard from the audio or typed
  return baseFallback;
}
