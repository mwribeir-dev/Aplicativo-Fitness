import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserInput, FullNutritionPlan, Meal } from './types/nutrition';
import {
  calculateNutrition,
  buildFullPlanFromCalculations,
} from './utils/nutritionEngine';
import { requestNutritionPlan, requestAlternateMeal } from './services/api';
import { Header } from './components/Header';
import { StudentForm } from './components/StudentForm';
import { BiometricsCard } from './components/BiometricsCard';
import { MacrosOverview } from './components/MacrosOverview';
import { MealPlanSection } from './components/MealPlanSection';
import { WeeklyRoutineSection } from './components/WeeklyRoutineSection';
import { WaterTracker } from './components/WaterTracker';
import { NutritionChat } from './components/NutritionChat';
import { ExportModal } from './components/ExportModal';
import { Dumbbell, Sparkles, Flame, CheckCircle, ArrowDown } from 'lucide-react';

const INITIAL_STUDENT: UserInput = {
  name: 'Lucas Silva',
  age: 25,
  gender: 'masculino',
  height: 178,
  weight: 78,
  goal: 'hipertrofia',
  frequency: 5,
  duration: 60,
  restrictions: 'Nenhuma',
  allergies: 'Nenhuma',
  preferences: 'Ovos, peito de frango, aveia, banana e batata doce',
};

export default function App() {
  const [plan, setPlan] = useState<FullNutritionPlan>(() => {
    // Initial deterministic plan loaded instantly for immediate user feedback
    const calc = calculateNutrition(INITIAL_STUDENT);
    return buildFullPlanFromCalculations(INITIAL_STUDENT, calc);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSwappingMealId, setIsSwappingMealId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState<{ id: string; name: string; goal: string }[]>([]);

  // Load saved plans from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrifit_saved_plans');
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleGeneratePlan = async (input: UserInput) => {
    setIsLoading(true);
    try {
      const res = await requestNutritionPlan(input);
      setPlan(res.plan);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#34d399', '#10b981', '#059669', '#38bdf8'],
      });

      // Save to recent plans in localStorage
      const newSavedItem = { id: res.plan.id, name: input.name, goal: input.goal };
      const updatedList = [newSavedItem, ...savedPlans.filter((p) => p.name !== input.name)].slice(0, 5);
      setSavedPlans(updatedList);
      localStorage.setItem('nutrifit_saved_plans', JSON.stringify(updatedList));

      // Scroll smoothly to biometrics section
      setTimeout(() => {
        document.getElementById('biometria')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error('Falha ao gerar plano:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMeal = (updatedMeal: Meal) => {
    setPlan((prev) => ({
      ...prev,
      meals: prev.meals.map((m) => (m.id === updatedMeal.id ? updatedMeal : m)),
    }));
  };

  const handleRequestAlternateMeal = async (mealType: string, currentMeal: Meal) => {
    setIsSwappingMealId(currentMeal.id);
    try {
      const newMeal = await requestAlternateMeal(
        mealType,
        currentMeal,
        plan.user,
        currentMeal.calories,
        currentMeal.protein
      );
      handleUpdateMeal(newMeal);
    } catch (err) {
      console.error('Erro ao trocar refeição:', err);
    } finally {
      setIsSwappingMealId(null);
    }
  };

  const handleNewStudentClick = () => {
    document.getElementById('coleta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Contract (1-line wordmark, 4-5 single-line links, 1 primary action) */}
      <Header
        onNewStudent={handleNewStudentClick}
        onOpenExport={() => setIsExportOpen(true)}
        hasPlan={Boolean(plan)}
        engineSource={plan.engineSource}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Banner / Athlete Greeting */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Motor Inteligente de Nutrição Esportiva · SaaS Especializado</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
                Nutrição de Precisão para Praticantes de Musculação
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {plan.motivationalMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <div className="px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400 uppercase font-medium">Aluno Ativo</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span>{plan.user.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 capitalize">{plan.user.goal}</span>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                <span className="text-[11px] text-slate-400">Motor Ativo</span>
                <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {plan.engineSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Mifflin-St Jeor + IA'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: User Data Collection Form */}
        <StudentForm
          initialData={plan.user}
          onSubmit={handleGeneratePlan}
          isLoading={isLoading}
        />

        {/* Section 2 & 3: Automatic Calculation, BMI Diagnosis & Caloric Strategy */}
        <BiometricsCard calculations={plan.calculations} user={plan.user} />

        {/* Macronutrient Distribution Overview */}
        <MacrosOverview
          macros={plan.calculations.macros}
          targetCalories={plan.calculations.targetCalories}
        />

        {/* Section 4: Creation of 1-Day Fit Meal Plan */}
        <MealPlanSection
          meals={plan.meals}
          user={plan.user}
          targetCalories={plan.calculations.targetCalories}
          targetProtein={plan.calculations.macros.proteinGrams}
          onUpdateMeal={handleUpdateMeal}
          onRequestAlternate={handleRequestAlternateMeal}
          isSwappingMealId={isSwappingMealId}
        />

        {/* Section 5: Weekly Fit Routine (Training Split, Cardio, Rest, Hydration, Golden Tips) */}
        <WeeklyRoutineSection routine={plan.routine} user={plan.user} />

        {/* Interactive Water Intake Tracker */}
        <WaterTracker
          hydration={plan.routine.hydration}
          weight={plan.user.weight}
        />

        {/* AI Sports Nutrition Assistant Chat */}
        <NutritionChat
          user={plan.user}
          calculations={plan.calculations}
        />
      </main>

      {/* Export / Share Modal */}
      <ExportModal
        plan={plan}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">NutriFit Pro SaaS</span>
            <span>—</span>
            <span>Motor Inteligente de Nutrição e Treino</span>
          </div>

          <div>
            Fórmulas de Mifflin-St Jeor & Fisiologia Esportiva · Cálculos automatizados
          </div>
        </div>
      </footer>
    </div>
  );
}
