export interface FlowStep {
  poseName: string;
  durationSeconds: number;
  instruction: string;
  breathTip: string;
  targetArea: string;
  poseIconType: 'neck' | 'chest' | 'back' | 'hips' | 'fold' | 'rest' | 'twist' | 'breathing';
}

export interface MovementFlow {
  moodSummary: string;
  stressLevel: string;
  flowTitle: string;
  totalTime: string;
  steps: FlowStep[];
  distressDetected: boolean;
  distressSupportMessage: string | null;
  transcribedText?: string | null;
}

export const DEFAULT_FALLBACK_FLOW: MovementFlow = {
  moodSummary: "You're feeling tension and mental overload, and your nervous system is asking for a slow, grounding pause.",
  stressLevel: "Moderate Stress & Fatigue",
  flowTitle: "Gentle Space Grounding & Release",
  totalTime: "6 min",
  distressDetected: false,
  distressSupportMessage: null,
  transcribedText: null,
  steps: [
    {
      poseName: "Seated Breath & Neck Roll Softener",
      durationSeconds: 60,
      instruction: "Sit comfortably on your chair or floor, drop your shoulders away from your ears, and gently roll your ear toward each shoulder.",
      breathTip: "Inhale through the nose for 4 counts, exhale softly through the mouth for 6 counts.",
      targetArea: "Neck & Upper Trapezius",
      poseIconType: "neck"
    },
    {
      poseName: "Seated Cat-Cow Spine Waves",
      durationSeconds: 60,
      instruction: "Place your hands on your knees; inhale to softly open your chest forward, exhale to round your back and tuck your chin.",
      breathTip: "Move smoothly with your breath, feeling each vertebra wake up.",
      targetArea: "Spine & Ribcage",
      poseIconType: "back"
    },
    {
      poseName: "Soft Standing Ragdoll Fold",
      durationSeconds: 75,
      instruction: "Stand with feet hip-width, bend your knees generously, and let your upper torso hang heavy over your thighs with opposite elbow clasped.",
      breathTip: "Release all tension in your jaw and neck with long, easy sighs.",
      targetArea: "Hamstrings & Lower Back",
      poseIconType: "fold"
    },
    {
      poseName: "Wall or Doorway Chest Opener",
      durationSeconds: 60,
      instruction: "Rest forearms on a wall or doorway at shoulder height and lean forward gently until you feel a warm stretch across your chest.",
      breathTip: "Breathe deeply into the center of your heart space.",
      targetArea: "Chest & Shoulders",
      poseIconType: "chest"
    },
    {
      poseName: "Gentle Seated Torso Twist",
      durationSeconds: 60,
      instruction: "Cross right hand to left knee on your chair or floor, gently glance over your left shoulder, then switch sides at 30 seconds.",
      breathTip: "Inhale to sit tall, exhale to soften deeper into the twist.",
      targetArea: "Spine & Digestion",
      poseIconType: "twist"
    },
    {
      poseName: "Stillness & Grounding Palm Rest",
      durationSeconds: 60,
      instruction: "Place one hand over your heart and one on your belly; close your eyes or soften your gaze and let your entire body settle into stillness.",
      breathTip: "Feel the warm rise and fall of your belly with natural, effortless breath.",
      targetArea: "Nervous System & Mind",
      poseIconType: "breathing"
    }
  ]
};

export function createTailoredFlow(userInput: string = ""): MovementFlow {
  const lower = userInput.toLowerCase();

  // 1. Neck & Shoulders / Desk Focus
  if (lower.includes("neck") || lower.includes("shoulder") || lower.includes("trap") || lower.includes("laptop")) {
    return {
      moodSummary: "You are experiencing localized tightness across your neck, trapezius, and upper shoulders from sustained focus.",
      stressLevel: "Upper Body & Neck Tension",
      flowTitle: "Shoulder & Neck Release Flow",
      totalTime: "6 min",
      distressDetected: false,
      distressSupportMessage: null,
      steps: [
        {
          poseName: "Ear-to-Shoulder Gentle Lateral Softener",
          durationSeconds: 60,
          instruction: "Sit tall with relaxed shoulders, slowly lower your right ear toward your right shoulder for 30 seconds, then gently switch to the left.",
          breathTip: "Exhale slowly through the mouth, letting tension melt from your upper neck.",
          targetArea: "Cervical Spine & Scalenes",
          poseIconType: "neck"
        },
        {
          poseName: "Wall or Doorway Chest Opener",
          durationSeconds: 60,
          instruction: "Rest forearms vertically against a doorframe or wall at shoulder height and lean forward gently to open tight pectoral muscles.",
          breathTip: "Inhale expanding your collarbones wide, exhale softening your shoulder blades down.",
          targetArea: "Chest & Anterior Deltoids",
          poseIconType: "chest"
        },
        {
          poseName: "Seated Cat-Cow Spine Waves",
          durationSeconds: 60,
          instruction: "Rest hands on your knees; inhale to arch gently and lift the chest, exhale to round your back and tuck your chin toward your chest.",
          breathTip: "Flow with your breath, creating space between each thoracic vertebra.",
          targetArea: "Upper Back & Thoracic Spine",
          poseIconType: "back"
        },
        {
          poseName: "Soft Standing Ragdoll Fold",
          durationSeconds: 75,
          instruction: "Stand with feet hip-width, bend knees generously, and let your head, neck, and arms dangle freely with opposite elbows clasped.",
          breathTip: "Shake your head gently 'yes' and 'no' to decompress the base of your skull.",
          targetArea: "Neck, Spine & Hamstrings",
          poseIconType: "fold"
        },
        {
          poseName: "Gentle Seated Torso Twist",
          durationSeconds: 60,
          instruction: "Sit upright, cross your right hand to your left knee and gently glance over your left shoulder for 30s, then switch sides.",
          breathTip: "Inhale lengthen your spine upward, exhale soften into the gentle twist.",
          targetArea: "Spinal Mobility & Ribcage",
          poseIconType: "twist"
        },
        {
          poseName: "Stillness & Heart-Belly Palm Rest",
          durationSeconds: 60,
          instruction: "Place one hand over your heart and one on your belly; close your eyes and let your shoulders drop completely away from your ears.",
          breathTip: "Take 4 slow, nourishing breaths down into your lower abdomen.",
          targetArea: "Nervous System & Posture",
          poseIconType: "breathing"
        }
      ]
    };
  }

  // 2. Lower Back & Hips Focus
  if (lower.includes("back") || lower.includes("hip") || lower.includes("chair") || lower.includes("sitting") || lower.includes("pelvis")) {
    return {
      moodSummary: "Prolonged sitting has compressed your lower back and tightened your hip flexors, calling for gentle decompression.",
      stressLevel: "Lower Back & Hip Stiffness",
      flowTitle: "Lower Back & Hip Ease Flow",
      totalTime: "6 min",
      distressDetected: false,
      distressSupportMessage: null,
      steps: [
        {
          poseName: "Seated Butterfly or Floor Hip Softener",
          durationSeconds: 60,
          instruction: "Sit on your chair edge or floor with soles of your feet together, knees dropping open naturally without forcing.",
          breathTip: "Send long, soothing exhales directly into the hip joints.",
          targetArea: "Inner Thighs & Hip Capsules",
          poseIconType: "hips"
        },
        {
          poseName: "Seated Cat-Cow Pelvic Tilts",
          durationSeconds: 60,
          instruction: "Hands on knees; tilt your pelvis forward on the inhale to lift your heart, tilt backward on the exhale to round your lower spine.",
          breathTip: "Move smoothly and fluidly without any jerky motions.",
          targetArea: "Lumbar Spine & Pelvis",
          poseIconType: "back"
        },
        {
          poseName: "Soft Knee Standing Ragdoll Fold",
          durationSeconds: 75,
          instruction: "Stand with feet shoulder-width, bend your knees deeply so your belly rests against your thighs, and let your lower back release completely.",
          breathTip: "Let gravity gently lengthen your lumbar spine with every exhale.",
          targetArea: "Lower Back & Glutes",
          poseIconType: "fold"
        },
        {
          poseName: "Gentle Seated Spinal Twist",
          durationSeconds: 60,
          instruction: "Place your right hand outside your left thigh, lengthen your spine, and breathe into a gentle rotation for 30 seconds before switching.",
          breathTip: "Keep both sit bones evenly grounded as you rotate gently.",
          targetArea: "Lower Back & Obliques",
          poseIconType: "twist"
        },
        {
          poseName: "Supported Resting Child's Pose or Seated Fold",
          durationSeconds: 60,
          instruction: "Fold forward softly over your thighs on the floor or in a chair, letting your lower back widen and rest.",
          breathTip: "Feel the back of your ribcage expand with every inhale.",
          targetArea: "Lumbar Decompression",
          poseIconType: "rest"
        },
        {
          poseName: "Mindful Grounding Breath",
          durationSeconds: 60,
          instruction: "Sit back comfortably with palms resting upright on your thighs, allowing your spine to settle in neutral alignment.",
          breathTip: "Inhale for 4 counts, hold for 2, exhale softly for 6 counts.",
          targetArea: "Nervous System Reset",
          poseIconType: "breathing"
        }
      ]
    };
  }

  // 3. Anxiety / Restless / Racing Mind Focus
  if (lower.includes("anxious") || lower.includes("restless") || lower.includes("racing") || lower.includes("stress") || lower.includes("fidgety") || lower.includes("overwhelm")) {
    return {
      moodSummary: "Your sympathetic nervous system is elevated with racing energy, asking for slow rhythmic grounding.",
      stressLevel: "High Mental Alertness & Overwhelm",
      flowTitle: "Grounding Breath & Nervous System Calm",
      totalTime: "6 min",
      distressDetected: false,
      distressSupportMessage: null,
      steps: [
        {
          poseName: "4-7-8 Centering Belly Breath",
          durationSeconds: 60,
          instruction: "Place both hands on your stomach; breathe in quietly through your nose for 4 counts, hold for 3, and exhale through your mouth for 6 counts.",
          breathTip: "Make your exhales longer than your inhales to activate your relaxation response.",
          targetArea: "Vagus Nerve & Diaphragm",
          poseIconType: "breathing"
        },
        {
          poseName: "Slow Rhythmic Neck Roll Softener",
          durationSeconds: 60,
          instruction: "Drop your chin to your chest and very slowly roll from side to side at half your normal speed, acknowledging any tension without judgment.",
          breathTip: "Sigh out any held tension with soft, unhurried breaths.",
          targetArea: "Neck & Upper Spine",
          poseIconType: "neck"
        },
        {
          poseName: "Grounding Forward Ragdoll Hang",
          durationSeconds: 75,
          instruction: "Stand with feet firmly planted, bend your knees, and let your torso hang like a heavy ragdoll, feeling the floor support you completely.",
          breathTip: "Feel your feet rooted firmly into the ground underneath you.",
          targetArea: "Grounding & Full Body Release",
          poseIconType: "fold"
        },
        {
          poseName: "Gentle Open Heart Breathing",
          durationSeconds: 60,
          instruction: "Bring hands behind your hips or to your lower back, gently open your chest upward, and breathe broad, calm breaths.",
          breathTip: "Inhale courage and openness, exhale doubt and urgency.",
          targetArea: "Heart Space & Lungs",
          poseIconType: "chest"
        },
        {
          poseName: "Resting Child's Pose or Forehead Rest",
          durationSeconds: 60,
          instruction: "Come down to floor or rest forearms on your desk/table, resting your forehead onto your hands in quiet stillness.",
          breathTip: "Remind yourself: 'Right here, right now, I am safe and supported.'",
          targetArea: "Quiet Mind & Somatic Safety",
          poseIconType: "rest"
        },
        {
          poseName: "Stillness & Grounding Palm Rest",
          durationSeconds: 60,
          instruction: "Sit tall with one hand on your heart and one on your belly, noticing the settling of your pulse.",
          breathTip: "Enjoy the stillness you've created for the next few breaths.",
          targetArea: "Nervous System Integration",
          poseIconType: "breathing"
        }
      ]
    };
  }

  // 4. Exhaustion / Deep Fatigue Focus
  if (lower.includes("exhaust") || lower.includes("fatigue") || lower.includes("tired") || lower.includes("low energy") || lower.includes("drained") || lower.includes("heavy")) {
    return {
      moodSummary: "You are experiencing deep physical fatigue, and your body needs low-effort, deeply restorative nourishment.",
      stressLevel: "High Fatigue & Low Energy",
      flowTitle: "Restorative Low-Effort Floor Recovery",
      totalTime: "5 min",
      distressDetected: false,
      distressSupportMessage: null,
      steps: [
        {
          poseName: "Effortless Palm Rest & Heavy Breathing",
          durationSeconds: 60,
          instruction: "Sit back or lie on the floor/bed, close your eyes, and allow the weight of your body to sink fully into gravity.",
          breathTip: "Let your breath flow naturally without trying to change or control it.",
          targetArea: "Full Body Deep Rest",
          poseIconType: "breathing"
        },
        {
          poseName: "Seated or Lying Neck Softener",
          durationSeconds: 60,
          instruction: "Without straining, gently turn your head side to side on your pillow or mat, releasing tension around your jaw and eyes.",
          breathTip: "Unclench your teeth and soften the muscles around your temples.",
          targetArea: "Neck, Jaw & Facial Muscles",
          poseIconType: "neck"
        },
        {
          poseName: "Gentle Lying Knee Hug & Spinal Rock",
          durationSeconds: 60,
          instruction: "Lie on your back on the floor or bed, draw your knees toward your chest with your hands, and rock gently side to side.",
          breathTip: "Feel a comforting massage across your sacrum and lower spine.",
          targetArea: "Lower Back & Spine",
          poseIconType: "back"
        },
        {
          poseName: "Passive Reclined Spinal Twist",
          durationSeconds: 60,
          instruction: "Let both knees fall gently to the right for 30 seconds with arms outstretched, then gently drift them to the left.",
          breathTip: "Deep, soothing belly breaths into your side ribs.",
          targetArea: "Spinal Ease & Torso",
          poseIconType: "twist"
        },
        {
          poseName: "Resting Supported Stillness",
          durationSeconds: 60,
          instruction: "Extend your legs, turn your palms upward, and rest in peaceful quiet for one full minute.",
          breathTip: "Simply rest and recharge.",
          targetArea: "Complete Body Restoration",
          poseIconType: "rest"
        }
      ]
    };
  }

  // Default universal flow
  return DEFAULT_FALLBACK_FLOW;
}
