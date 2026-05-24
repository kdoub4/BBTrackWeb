
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { BowlingBall } from '../types';
import { getMaintenanceAdvice } from '../services/geminiService';

interface AIAdviceProps {
  ball: BowlingBall;
}

const AIAdvice: React.FC<AIAdviceProps> = ({ ball }) => {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<{tip: string, rationale: string}[]>([]);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getMaintenanceAdvice(ball);
    setTips(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, [ball.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-indigo-400">
        <Loader2 className="animate-spin mb-2" size={24} />
        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Analyzing Surface Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tips.length > 0 ? (
        tips.map((item, idx) => (
          <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border-l-2 border-indigo-500">
            <h4 className="text-xs font-bold text-indigo-400 mb-1 flex items-center gap-1">
              <Sparkles size={12} /> {item.tip}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">{item.rationale}</p>
          </div>
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-xs text-slate-500 italic">No specific tips available for this configuration.</p>
          <button 
            onClick={fetchAdvice}
            className="mt-2 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase underline"
          >
            Try Refreshing
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-700/30">
        <Info size={12} />
        <span>Advice based on generic coverstock profiles.</span>
      </div>
    </div>
  );
};

export default AIAdvice;
