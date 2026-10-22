import React from 'react';

interface PoseIllustrationProps {
  type: string;
  className?: string;
}

export const PoseIllustration: React.FC<PoseIllustrationProps> = ({ type, className = "w-32 h-32" }) => {
  // Calm neutral palette: warm taupe, clay, oat, soft charcoal lines
  const normalized = (type || 'breathing').toLowerCase();

  switch (normalized) {
    case 'neck':
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#F1ECE4" />
          {/* Seated torso */}
          <path d="M48 126C48 106 60 98 80 98C100 98 112 106 112 126" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Neck tilted */}
          <path d="M80 98C82 90 85 82 89 74" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Head tilted toward shoulder */}
          <circle cx="94" cy="60" r="18" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          {/* Gentle breath curve */}
          <path d="M68 64C64 68 64 74 68 78" stroke="#A89F91" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M60 60C54 66 54 76 60 82" stroke="#A89F91" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );

    case 'chest':
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#F3EFE8" />
          {/* Head & neck */}
          <circle cx="80" cy="50" r="16" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          <path d="M80 66V80" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Open arms expansive */}
          <path d="M38 88C52 74 68 78 80 80C92 78 108 74 122 88" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Body */}
          <path d="M80 80V126" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Gentle heart aura */}
          <circle cx="80" cy="84" r="12" fill="#E8DED1" opacity="0.6" />
          <path d="M74 84C74 81 80 78 80 84C80 78 86 81 86 84C86 89 80 92 80 92C80 92 74 89 74 84Z" fill="#C98A7D" />
        </svg>
      );

    case 'back':
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#EFECE5" />
          {/* Cat/Cow gentle spine curve */}
          <circle cx="48" cy="74" r="15" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          {/* Table top / spinal ripple */}
          <path d="M48 89C62 98 94 98 114 84" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Arms down */}
          <path d="M56 94V126" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Legs / knees */}
          <path d="M112 86V126" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Floor ground line */}
          <line x1="36" y1="126" x2="128" y2="126" stroke="#B8B0A2" strokeWidth="3" strokeLinecap="round" />
          {/* Spine wave lines */}
          <path d="M68 86C78 78 92 78 102 86" stroke="#A89F91" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );

    case 'fold':
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#F1ECE4" />
          {/* Ground */}
          <line x1="40" y1="130" x2="120" y2="130" stroke="#B8B0A2" strokeWidth="3" strokeLinecap="round" />
          {/* Legs standing with soft knee bend */}
          <path d="M96 130L90 85L80 82" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M90 130L84 85" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Upper torso draping forward and down */}
          <path d="M80 82C74 86 68 96 68 108" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Head hanging relaxed */}
          <circle cx="68" cy="116" r="13" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          {/* Clasped elbows hanging */}
          <path d="M72 102L62 110L66 116" stroke="#68625E" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'twist':
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#F3EFE8" />
          {/* Seated base */}
          <ellipse cx="80" cy="120" rx="36" ry="10" fill="#E4DDD2" stroke="#4A4643" strokeWidth="3" />
          {/* Head looking back */}
          <circle cx="80" cy="52" r="16" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          {/* Spiral twist line */}
          <path d="M80 68V95C72 98 72 108 80 114" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Arm crossing over */}
          <path d="M70 82L96 98L92 118" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          <path d="M90 82L80 92L68 116" stroke="#68625E" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'rest':
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#EDE8DF" />
          {/* Ground */}
          <line x1="30" y1="118" x2="130" y2="118" stroke="#B8B0A2" strokeWidth="3" strokeLinecap="round" />
          {/* Child's pose curve */}
          <path d="M112 116C112 100 102 92 88 92C74 92 64 100 50 116" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Head resting on ground */}
          <circle cx="48" cy="110" r="13" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          {/* Arms outstretched forward */}
          <path d="M70 96L40 116" stroke="#68625E" strokeWidth="3.5" strokeLinecap="round" />
          {/* Gentle breath pulse */}
          <circle cx="88" cy="82" r="4" fill="#C2B8A8" opacity="0.8" />
          <circle cx="94" cy="76" r="3" fill="#C2B8A8" opacity="0.5" />
        </svg>
      );

    case 'hips':
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#F1EBE2" />
          {/* Head & upright spine */}
          <circle cx="80" cy="46" r="15" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          <path d="M80 61V102" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* Knees opening gently outward (butterfly or low seated hip opener) */}
          <path d="M80 102C60 98 42 106 42 118C54 122 72 122 80 120C88 122 106 122 118 118C118 106 100 98 80 102Z" fill="#E2DACD" stroke="#4A4643" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Hands resting on ankles/knees */}
          <path d="M70 76L52 108" stroke="#68625E" strokeWidth="3" strokeLinecap="round" />
          <path d="M90 76L108 108" stroke="#68625E" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'breathing':
    default:
      return (
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="80" cy="80" r="72" fill="#F0ECE4" />
          {/* Concentric breath rings */}
          <circle cx="80" cy="80" r="42" stroke="#D3C9BA" strokeWidth="2" strokeDasharray="4 4" className="animate-breathe" />
          {/* Seated peaceful posture */}
          <circle cx="80" cy="52" r="16" fill="#DFD8CE" stroke="#4A4643" strokeWidth="4" />
          <path d="M80 68V114" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
          {/* One hand on heart, one on belly */}
          <path d="M72 78C66 84 74 90 80 88" stroke="#4A4643" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M88 78C94 92 88 102 80 104" stroke="#4A4643" strokeWidth="3.5" strokeLinecap="round" />
          {/* Ground cross legged */}
          <path d="M46 120C62 114 98 114 114 120" stroke="#4A4643" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
};
