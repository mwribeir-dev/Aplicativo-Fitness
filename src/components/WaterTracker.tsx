import React, { useState } from 'react';
import { HydrationPlan } from '../types/nutrition';
import { Droplet, Plus, RotateCcw, Sparkles } from 'lucide-react';

interface WaterTrackerProps {
  hydration: HydrationPlan;
  weight: number;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ hydration, weight }) => {
  const [consumedGlasses, setConsumedGlasses] = useState(0);

  const totalGlasses = hydration.glassesCount || Math.ceil((hydration.totalLiters * 1000) / 250);
  const consumedMl = consumedGlasses * 250;
  const targetMl = Math.round(hydration.totalLiters * 1000);
  const percentage = Math.min(100, Math.round((consumedMl / targetMl) * 100));

  const addGlass = () => {
    setConsumedGlasses((prev) => Math.min(totalGlasses + 4, prev + 1));
  };

  const resetGlasses = () => {
    setConsumedGlasses(0);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Droplet className="w-3.5 h-3.5" />
            <span>Hidratação Ideal para Atletas</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Marcador de Água Diário ({hydration.totalLiters}L / dia)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetGlasses}
            className="p-2 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Zerar copos do dia"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zerar</span>
          </button>

          <button
            type="button"
            onClick={addGlass}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ 1 Copo (250ml)</span>
          </button>
        </div>
      </div>

      {/* Progress overview */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div className="space-y-1">
          <div className="text-xs text-slate-400">Total Ingerido Hoje:</div>
          <div className="text-3xl font-bold text-white font-mono tabular-nums flex items-baseline gap-2">
            <span>{(consumedMl / 1000).toFixed(2)}L</span>
            <span className="text-xs text-cyan-400 font-semibold font-mono">
              ({percentage}%)
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Meta: {targetMl}ml ({totalGlasses} copos de 250ml)
          </div>
        </div>

        {/* Progress bar */}
        <div className="md:col-span-2 space-y-2">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${percentage}%` }}
              className="h-full bg-cyan-400 transition-all duration-300 shadow-sm shadow-cyan-400/50"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {hydration.distributionTip}
          </p>
        </div>
      </div>

      {/* Interactive Glasses Grid */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Clique nos copos para registrar:
        </div>
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: totalGlasses }).map((_, idx) => {
            const isFilled = idx < consumedGlasses;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setConsumedGlasses(isFilled ? idx : idx + 1)}
                className={`w-9 h-11 rounded-lg border flex flex-col items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-sm shadow-cyan-500/10 scale-105'
                    : 'bg-slate-950/60 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                }`}
                title={`Copo ${idx + 1} (250ml)`}
              >
                <Droplet className={`w-3.5 h-3.5 ${isFilled ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                <span className="text-[9px] font-mono mt-0.5">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 bg-slate-950/50 border border-slate-800/60 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{hydration.formula}</span>
        </div>
      </div>
    </div>
  );
};
