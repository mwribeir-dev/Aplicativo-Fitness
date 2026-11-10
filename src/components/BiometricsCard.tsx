import React from 'react';
import { NutritionCalculations, UserInput } from '../types/nutrition';
import { Activity, Scale, Zap, Flame, Droplet, ShieldCheck, Info } from 'lucide-react';

interface BiometricsCardProps {
  calculations: NutritionCalculations;
  user: UserInput;
}

export const BiometricsCard: React.FC<BiometricsCardProps> = ({
  calculations,
  user,
}) => {
  const {
    bmi,
    bmiClassification,
    bmiExplanation,
    strategyAdjustment,
    bmr,
    activityFactor,
    tdee,
    targetCalories,
    caloricDelta,
    strategySummary,
    waterIntakeLiters,
  } = calculations;

  // Calculate percentage along standard BMI spectrum (15 to 40)
  const clampedBmi = Math.min(40, Math.max(15, bmi));
  const bmiBarPercent = ((clampedBmi - 15) / (40 - 15)) * 100;

  return (
    <section id="biometria" className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Etapa 02 & 03 · Cálculo Automático & Estratégia Nutricional</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Diagnóstico Biométrico & Gasto Energético
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Metodologia Mifflin-St Jeor & Fisiologia Esportiva
        </div>
      </div>

      {/* Grid of Key Metabolic Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* TMB */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">TMB (Basal)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {bmr} <span className="text-xs font-normal text-slate-400">kcal/dia</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Gasto mínimo vital em repouso absoluto.
            </p>
          </div>
        </div>

        {/* TDEE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gasto Total (TDEE)</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {tdee} <span className="text-xs font-normal text-slate-400">kcal/dia</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Fator {activityFactor}x ({user.frequency}x treino de {user.duration}min).
            </p>
          </div>
        </div>

        {/* Target Calories */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Meta Diária</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tabular-nums flex items-baseline gap-1.5">
              <span>{targetCalories}</span>
              <span className="text-xs font-normal text-slate-400">kcal</span>
              {caloricDelta !== 0 && (
                <span className="text-xs font-semibold text-emerald-300 font-mono">
                  ({caloricDelta > 0 ? `+${caloricDelta}` : caloricDelta})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 capitalize">
              {user.goal} com balanço energético ajustado.
            </p>
          </div>
        </div>

        {/* Water Requirement */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Hidratação Ideal</span>
            <Droplet className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono tabular-nums">
              {waterIntakeLiters} <span className="text-xs font-normal text-slate-400">Litros/dia</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              35ml/kg + reposição hídrica de treino.
            </p>
          </div>
        </div>
      </div>

      {/* IMC Card with Visual Spectrum */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400">IMC</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">{bmi}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{bmiClassification}</span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400">Fórmula padrão OMS</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Peso: <span className="font-mono text-slate-200">{user.weight}kg</span> · Altura: <span className="font-mono text-slate-200">{user.height}cm</span>
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-slate-300 flex items-center gap-2 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Objetivo do Aluno: <strong className="text-white capitalize">{user.goal}</strong></span>
          </div>
        </div>

        {/* BMI Spectrum Bar */}
        <div className="mt-5 space-y-2">
          <div className="relative pt-6">
            {/* Current value pin */}
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${Math.max(5, Math.min(95, bmiBarPercent))}%` }}
            >
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                {bmi}
              </span>
              <div className="w-0.5 h-2 bg-emerald-400"></div>
            </div>

            {/* Gradient Track */}
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-cyan-500/60 w-[14%]" title="Abaixo do peso (<18.5)"></div>
              <div className="h-full bg-emerald-500/80 w-[26%]" title="Normal (18.5 - 24.9)"></div>
              <div className="h-full bg-amber-500/80 w-[20%]" title="Sobrepeso (25 - 29.9)"></div>
              <div className="h-full bg-rose-500/80 w-[40%]" title="Obesidade (>=30)"></div>
            </div>
          </div>

          {/* Scale Labels */}
          <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
            <span>&lt; 18.5 Abaixo</span>
            <span>18.5 - 24.9 Normal</span>
            <span>25 - 29.9 Sobrepeso</span>
            <span>&ge; 30 Obesidade</span>
          </div>
        </div>

        {/* Explanations & Strategy Adjustment */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-slate-800/80">
          <div className="space-y-1.5 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>O que significa seu resultado no contexto da musculação</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {bmiExplanation}
            </p>
          </div>

          <div className="space-y-1.5 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ajuste da Estratégia para {user.name}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {strategyAdjustment}
            </p>
          </div>
        </div>

        {/* Nutritional Strategy Synthesis */}
        <div className="mt-4 bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-4 sm:p-5">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
            Estratégia Nutricional Adotada
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {strategySummary}
          </p>
        </div>
      </div>
    </section>
  );
};
