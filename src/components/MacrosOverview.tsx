import React from 'react';
import { MacroDistribution } from '../types/nutrition';
import { PieChart, Beef, Wheat, Droplets, Leaf } from 'lucide-react';

interface MacrosOverviewProps {
  macros: MacroDistribution;
  targetCalories: number;
}

export const MacrosOverview: React.FC<MacrosOverviewProps> = ({
  macros,
  targetCalories,
}) => {
  const {
    proteinGrams,
    proteinKcal,
    proteinPercentage,
    proteinPerKg,
    carbsGrams,
    carbsKcal,
    carbsPercentage,
    fatsGrams,
    fatsKcal,
    fatsPercentage,
    fiberGrams,
  } = macros;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <PieChart className="w-3.5 h-3.5" />
            <span>Distribuição de Macronutrientes</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Metas Nutricionais Diárias
          </h3>
        </div>
        <div className="text-xs text-slate-400">
          Base calórica total: <span className="font-mono font-semibold text-white">{targetCalories} kcal</span>
        </div>
      </div>

      {/* Visual Macro Split Progress Bar */}
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
          <div
            style={{ width: `${proteinPercentage}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Proteína: ${proteinPercentage}%`}
          />
          <div
            style={{ width: `${carbsPercentage}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
            title={`Carboidratos: ${carbsPercentage}%`}
          />
          <div
            style={{ width: `${fatsPercentage}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Gorduras: ${fatsPercentage}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Proteína ({proteinPercentage}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Carboidratos ({carbsPercentage}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Gorduras ({fatsPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Macro Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Proteína */}
        <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Beef className="w-3.5 h-3.5" /> Proteínas
            </span>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              {proteinPerKg}g/kg
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {proteinGrams}g
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            {proteinKcal} kcal · {proteinPercentage}% da dieta
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Essencial para reparo de microlesões e estímulo à via mTOR de síntese proteica muscular.
          </p>
        </div>

        {/* Carboidratos */}
        <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wheat className="w-3.5 h-3.5" /> Carboidratos
            </span>
            <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
              Energia
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {carbsGrams}g
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            {carbsKcal} kcal · {carbsPercentage}% da dieta
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Combustível primário para manter a intensidade das séries e repor o glicogênio intramuscular.
          </p>
        </div>

        {/* Gorduras */}
        <div className="bg-slate-950/60 border border-rose-500/30 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" /> Gorduras Boas
            </span>
            <span className="text-xs font-mono text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30">
              Hormonal
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {fatsGrams}g
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            {fatsKcal} kcal · {fatsPercentage}% da dieta
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Produção de testosterona e hormônios anabólicos, integridade de membranas celulares e saúde articular.
          </p>
        </div>

        {/* Fibras */}
        <div className="bg-slate-950/60 border border-slate-700/60 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" /> Fibras & Saciedade
            </span>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
              Mínimo
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {fiberGrams}g
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            Microbiota e trânsito intestinal
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Regula a velocidade de absorção de glicose, melhora a sensibilidade à insulina e microbiota saudável.
          </p>
        </div>
      </div>
    </div>
  );
};
