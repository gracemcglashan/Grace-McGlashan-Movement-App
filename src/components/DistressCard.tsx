import React, { useState } from 'react';
import { HeartHandshake, Phone, MessageSquare, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface DistressCardProps {
  message?: string | null;
}

export const DistressCard: React.FC<DistressCardProps> = ({ message }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-[#FAF2EE] border border-[#E8D4C8] rounded-2xl p-4 sm:p-5 text-[#3D322C] shadow-sm mb-5 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EED8CB] flex items-center justify-center shrink-0 text-[#8C4A32]">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-[#4A3226]">
              You don't have to carry this alone
            </h3>
            <button
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? "Collapse support message" : "Expand support message"}
              className="text-[#8C6D5D] hover:text-[#4A3226] p-1 -mr-1"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm text-[#665246] mt-1 leading-relaxed">
            {message || "We hear how heavy things feel right now. Along with gentle movement to calm your body, please consider connecting with someone who cares."}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-[#E8D4C8]/70 space-y-2.5">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#8C6D5D]">
            Immediate & Confidential Support:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href="tel:988"
              className="flex items-center gap-2 p-2.5 bg-white/80 hover:bg-white rounded-xl border border-[#E2CEBF] transition text-[#4A3226] font-medium"
            >
              <Phone className="w-4 h-4 text-[#8C4A32] shrink-0" />
              <span>Call <strong>988</strong> Lifeline (24/7 Free)</span>
            </a>
            <a
              href="sms:988"
              className="flex items-center gap-2 p-2.5 bg-white/80 hover:bg-white rounded-xl border border-[#E2CEBF] transition text-[#4A3226] font-medium"
            >
              <MessageSquare className="w-4 h-4 text-[#8C4A32] shrink-0" />
              <span>Text <strong>988</strong> Crisis Support</span>
            </a>
          </div>

          <div className="bg-white/60 rounded-xl p-2.5 text-xs text-[#665246] leading-relaxed">
            💡 <strong>On Campus?</strong> Reach out to your campus counseling center, student health services, or drop in with a resident advisor (RA). Taking one small breath and letting one trusted person know is enough for today.
          </div>
        </div>
      )}
    </div>
  );
};
