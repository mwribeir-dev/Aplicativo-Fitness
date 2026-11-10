import React, { useState } from 'react';
import { WeeklyRoutine, UserInput } from '../types/nutrition';
import { Dumbbell, HeartPulse, Moon, Trophy, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface WeeklyRoutineSectionProps {
  routine: WeeklyRoutine;
  user: UserInput;
}

export const WeeklyRoutineSection: React.FC<WeeklyRoutineSectionProps> = ({
  routine,
  user,
}) => {
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);

  const toggleDay = (idx: number) => {
    setOpenDayIndex(openDayIndex === idx ? null : idx);
  };

  return (
    <section id="rotina" className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Etapa 05 · Rotina Fit Semanal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Divisão de Treino & Periodização ({user.frequency}x na semana)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Estrutura sinérgica para maximizar a sobrecarga progressiva, respeitando o tempo de descanso muscular.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-emerald-400 font-mono">
          {routine.splitName}
        </div>
      </div>

      {/* Main Grid: Workout Days & Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Workout Split by Day */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Divisão Diária na Academia ({routine.days.length} sessões)</span>
          </h3>

          {routine.days.map((workout, idx) => {
            const isOpen = openDayIndex === idx;

            return (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">{workout.day}</div>
                      <div className="text-sm font-semibold text-white">{workout.focus}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {workout.durationMinutes} min
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 bg-slate-950/40">
                    <div className="text-xs font-medium text-slate-400 mb-2">
                      Exercícios Chave & Séries Recomendadas:
                    </div>
                    <ul className="space-y-1.5">
                      {workout.exercises.map((ex, exIdx) => (
                        <li
                          key={exIdx}
                          className="flex items-center gap-2 text-xs text-slate-300"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-[11px] text-slate-500 italic">
                      Dica: Mantenha intervalo de 60 a 90 segundos entre séries pesadas para restauração dos níveis de ATP-CP.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Cardio, Rest & Hydration Pillars */}
        <div className="space-y-4">
          {/* Cardio Protocol */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
              <HeartPulse className="w-4 h-4" />
              <span>Protocolo de Cardio</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">
              {routine.cardio.type}
            </div>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <div>Frequência: <span className="text-slate-200">{routine.cardio.frequency}</span></div>
              <div>Duração: <span className="text-slate-200">{routine.cardio.duration}</span></div>
              <div>Momento: <span className="text-slate-200">{routine.cardio.timing}</span></div>
            </div>
            <p className="text-xs text-slate-300 mt-2.5 pt-2 border-t border-slate-800/80 leading-relaxed">
              {routine.cardio.recommendation}
            </p>
          </div>

          {/* Sleep & Recovery Protocol */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <Moon className="w-4 h-4" />
              <span>Descanso & Sono Anabólico</span>
            </div>
            <div className="text-sm font-bold text-white mb-2 font-mono">
              Meta: {routine.recovery.sleepHours}
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {routine.recovery.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Golden Pro-Tips for Maximum Results */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
          <Trophy className="w-4 h-4" />
          <span>Dicas Extras para Acelerar seus Resultados</span>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight mb-4">
          Diretrizes de Performance da Nutrição Esportiva
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routine.proTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
