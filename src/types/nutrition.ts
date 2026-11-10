export type Gender = 'masculino' | 'feminino';

export type Goal = 'emagrecimento' | 'hipertrofia' | 'definicao' | 'manutencao';

export interface UserInput {
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  goal: Goal;
  frequency: number; // 1 to 7 times/week
  duration: number; // minutes per workout
  restrictions: string; // e.g., vegetariano, sem lactose, etc.
  allergies: string; // e.g., amendoim, frutos do mar
  preferences: string; // e.g., ovos, frango, aveia, café
}

export interface BmiResult {
  bmi: number;
  classification: 'Abaixo do peso' | 'Peso normal' | 'Sobrepeso' | 'Obesidade Grau I' | 'Obesidade Grau II' | 'Obesidade Grau III';
  color: string;
  explanation: string;
  strategyAdjustment: string;
}

export interface MacroDistribution {
  proteinGrams: number;
  proteinKcal: number;
  proteinPercentage: number;
  proteinPerKg: number;

  carbsGrams: number;
  carbsKcal: number;
  carbsPercentage: number;

  fatsGrams: number;
  fatsKcal: number;
  fatsPercentage: number;

  fiberGrams: number;
}

export interface NutritionCalculations {
  bmi: number;
  bmiClassification: string;
  bmiExplanation: string;
  strategyAdjustment: string;

  bmr: number; // Taxa Metabólica Basal (kcal)
  activityFactor: number;
  tdee: number; // Gasto Energético Total (kcal)
  targetCalories: number; // Meta calórica com déficit/superávit
  caloricDelta: number; // +350, -450, etc.

  macros: MacroDistribution;
  strategySummary: string;
  waterIntakeLiters: number;
  waterGlassesCount: number; // copos de 250ml
}

export interface Meal {
  id: string;
  mealType: 'Café da manhã' | 'Lanche da manhã' | 'Almoço' | 'Lanche da tarde' | 'Jantar' | 'Ceia';
  name: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tip?: string;
  isCompleted?: boolean;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: string[];
  durationMinutes: number;
}

export interface CardioPlan {
  frequency: string;
  duration: string;
  type: string;
  timing: string;
  recommendation: string;
}

export interface HydrationPlan {
  totalLiters: number;
  glassesCount: number;
  formula: string;
  distributionTip: string;
}

export interface RecoveryPlan {
  sleepHours: string;
  recommendations: string[];
}

export interface WeeklyRoutine {
  splitName: string;
  frequencyDays: number;
  days: WorkoutDay[];
  cardio: CardioPlan;
  hydration: HydrationPlan;
  recovery: RecoveryPlan;
  proTips: string[];
}

export interface FullNutritionPlan {
  id: string;
  createdAt: string;
  user: UserInput;
  calculations: NutritionCalculations;
  meals: Meal[];
  routine: WeeklyRoutine;
  motivationalMessage: string;
  engineSource: 'gemini-3.8-flash' | 'local-deterministic';
}
