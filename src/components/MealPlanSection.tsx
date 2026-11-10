import React, { useState } from 'react';
import { Meal, UserInput } from '../types/nutrition';
import { Utensils, CheckCircle2, Circle, RefreshCw, ChefHat, Clock, Sparkles, Copy, Check } from 'lucide-react';

interface MealPlanSectionProps {
  meals: Meal[];
  user: UserInput;
  targetCalories: number;
  targetProtein: number;
  onUpdateMeal: (updatedMeal: Meal) => void;
  onRequestAlternate: (mealType: string, currentMeal: Meal) => Promise<void>;
  isSwappingMealId?: string | null;
}

export const MealPlanSection: React.FC<MealPlanSectionProps> = ({
  meals,
  user,
  targetCalories,
  targetProtein,
  onUpdateMeal,
  onRequestAlternate,
  isSwappingMealId,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleMealComplete = (meal: Meal) => {
    onUpdateMeal({
      ...meal,
      isCompleted: !meal.isCompleted,
    });
  };

  const handleCopyMeal = (meal: Meal) => {
    const text = `🍽️ *${meal.mealType}: ${meal.name}*
🔥 Calorias: ~${meal.calories} kcal | 🥩 Proteínas: ~${meal.protein}g

📋 *Ingredientes:*
${meal.ingredients.map((i) => `• ${i}`).join('\n')}

👨‍🍳 *Modo de Preparo:*
${meal.instructions}

💡 *Dica:* ${meal.tip || 'Consumir fresco'}`;

    navigator.clipboard.writeText(text);
    setCopiedId(meal.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Consumed counters
  const consumedCalories = meals
    .filter((m) => m.isCompleted)
    .reduce((acc, m) => acc + m.calories, 0);

  const consumedProtein = meals
    .filter((m) => m.isCompleted)
    .reduce((acc, m) => acc + m.protein, 0);

  const caloriesProgress = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));
  const proteinProgress = Math.min(100, Math.round((consumedProtein / targetProtein) * 100));

  return (
    <section id="cardapio" className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Utensils className="w-3.5 h-3.5" />
            <span>Etapa 04 · Criação de Cardápio Fit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Cardápio Fit Hiperproteico de 1 Dia
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            6 refeições completas, fáceis de preparar e desenhadas sob medida para a sua rotina de academia.
          </p>
        </div>

        {/* Real-time consumption tracker badge */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-5 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Calorias Ingeridas</div>
            <div className="text-base font-bold text-white font-mono tabular-nums">
              {consumedCalories} <span className="text-xs font-normal text-slate-400">/ {targetCalories} kcal</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                style={{ width: `${caloriesProgress}%` }}
                className="h-full bg-emerald-400 transition-all duration-300"
              />
            </div>
          </div>

          <div className="border-l border-slate-800 pl-4">
            <div className="text-slate-400 font-medium">Proteína Ingerida</div>
            <div className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              {consumedProtein}g <span className="text-xs font-normal text-slate-400">/ {targetProtein}g</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                style={{ width: `${proteinProgress}%` }}
                className="h-full bg-emerald-400 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Meals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {meals.map((meal, index) => {
          const isSwapping = isSwappingMealId === meal.id;

          return (
            <div
              key={meal.id}
              className={`bg-slate-900/70 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 ${
                meal.isCompleted
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-slate-700/80'
              }`}
            >
              <div>
                {/* Meal Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-semibold">
                      0{index + 1}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      {meal.mealType}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyMeal(meal)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                      title="Copiar refeição"
                    >
                      {copiedId === meal.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isSwapping}
                      onClick={() => onRequestAlternate(meal.mealType, meal)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
                      title="Gerar receita alternativa para esta refeição"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin text-emerald-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Recipe Title & Macro Tags */}
                <div className="mt-3">
                  <h3 className="text-base font-bold text-white leading-snug">
                    {meal.name}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-2 pt-1 border-t border-slate-800/40">
                    <span className="text-white font-semibold">~{meal.calories} kcal</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold font-mono">~{meal.protein}g proteína</span>
                    {meal.carbs ? (
                      <>
                        <span>·</span>
                        <span className="text-amber-400/90 font-mono">{meal.carbs}g carb</span>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ingredientes</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {meal.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preparo Simples</span>
                  </div>
                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    {meal.instructions}
                  </p>
                </div>

                {/* Pro-Tip */}
                {meal.tip && (
                  <div className="mt-3.5 bg-slate-950/50 border border-slate-800/80 rounded-lg p-2.5 text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{meal.tip}</span>
                  </div>
                )}
              </div>

              {/* Completion Action */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleMealComplete(meal)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                    meal.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {meal.isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Refeição Consumida</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" />
                      <span>Marcar como Consumida</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
