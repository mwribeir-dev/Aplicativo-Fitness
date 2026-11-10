import React, { useState } from 'react';
import { FullNutritionPlan } from '../types/nutrition';
import { X, Copy, Check, Printer, Share2, Smartphone } from 'lucide-react';

interface ExportModalProps {
  plan: FullNutritionPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ plan, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { user, calculations, meals, routine } = plan;

  const buildWhatsAppText = () => {
    let text = `🏋️‍♂️ *PLANO NUTRICIONAL & ROTINA FIT - NUTRIFIT PRO*\n`;
    text += `👤 *Aluno(a):* ${user.name} | ${user.age} anos | ${user.gender}\n`;
    text += `🎯 *Objetivo:* ${user.goal.toUpperCase()}\n`;
    text += `⚖️ *Peso:* ${user.weight}kg | *Altura:* ${user.height}cm | *IMC:* ${calculations.bmi} (${calculations.bmiClassification})\n`;
    text += `🔥 *Meta Calórica Diária:* ${calculations.targetCalories} kcal (TMB: ${calculations.bmr} kcal | TDEE: ${calculations.tdee} kcal)\n`;
    text += `🥩 *Macros:* ${calculations.macros.proteinGrams}g Proteína (${calculations.macros.proteinPerKg}g/kg) | ${calculations.macros.carbsGrams}g Carboidratos | ${calculations.macros.fatsGrams}g Gorduras\n`;
    text += `💧 *Meta de Hidratação:* ${calculations.waterIntakeLiters} Litros/dia (${calculations.waterGlassesCount} copos)\n\n`;

    text += `═════════════════════════\n`;
    text += `🍽️ *CARDÁPIO FIT DIÁRIO (6 REFEIÇÕES)*\n`;
    text += `═════════════════════════\n\n`;

    meals.forEach((m, idx) => {
      text += `*${idx + 1}. ${m.mealType}: ${m.name}*\n`;
      text += `📊 ~${m.calories} kcal | ~${m.protein}g proteína\n`;
      text += `🛒 *Ingredientes:*\n`;
      m.ingredients.forEach((ing) => {
        text += `  • ${ing}\n`;
      });
      text += `👨‍🍳 *Preparo:* ${m.instructions}\n`;
      if (m.tip) text += `💡 *Dica:* ${m.tip}\n`;
      text += `\n`;
    });

    text += `═════════════════════════\n`;
    text += `🏋️ *ROTINA FIT SEMANAL (${user.frequency}X/SEMANA)*\n`;
    text += `═════════════════════════\n`;
    text += `📋 *Divisão:* ${routine.splitName}\n\n`;

    routine.days.forEach((d) => {
      text += `• *${d.day}*: ${d.focus} (${d.durationMinutes} min)\n`;
      d.exercises.forEach((ex) => {
        text += `   - ${ex}\n`;
      });
    });

    text += `\n🏃‍♂️ *Cardio:* ${routine.cardio.type} (${routine.cardio.frequency}, ${routine.cardio.duration} - ${routine.cardio.timing})\n`;
    text += `😴 *Descanso:* ${routine.recovery.sleepHours}\n\n`;

    text += `✨ *Dicas de Ouro NutriFit:*\n`;
    routine.proTips.forEach((tip, i) => {
      text += `${i + 1}. ${tip}\n`;
    });

    return text;
  };

  const handleCopyWhatsApp = () => {
    const formatted = buildWhatsAppText();
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Exportar Plano de {user.name}</h3>
              <p className="text-xs text-slate-400">Pronto para envio no WhatsApp ou impressão profissional</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <button
            onClick={handleCopyWhatsApp}
            className="p-4 bg-emerald-950/30 border border-emerald-500/40 hover:bg-emerald-900/30 rounded-xl text-left transition-all flex items-start gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-300 flex items-center gap-2">
                <span>Copiar para WhatsApp</span>
                {copied && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {copied
                  ? 'Copiado para a área de transferência!'
                  : 'Texto pré-formatado com negrito e emojis para colar direto no chat.'}
              </p>
            </div>
          </button>

          <button
            onClick={handlePrint}
            className="p-4 bg-slate-950/40 border border-slate-800 hover:bg-slate-800/60 rounded-xl text-left transition-all flex items-start gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-300">
                Imprimir / Salvar PDF
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Gera layout limpo em formato A4 para o prontuário do aluno.
              </p>
            </div>
          </button>
        </div>

        {/* Text Preview */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Pré-visualização do Conteúdo:
          </div>
          <div className="h-48 overflow-y-auto bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {buildWhatsAppText()}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
