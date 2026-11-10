import {
  UserInput,
  NutritionCalculations,
  Meal,
  WeeklyRoutine,
  FullNutritionPlan,
} from '../types/nutrition';
import {
  calculateNutrition,
  buildFullPlanFromCalculations,
  generateDeterministicFitMealPlan,
} from '../utils/nutritionEngine';

export interface GeneratePlanResponse {
  plan: FullNutritionPlan;
  source: 'gemini-3.8-flash' | 'local-deterministic';
  error?: string;
}

export async function requestNutritionPlan(input: UserInput): Promise<GeneratePlanResponse> {
  const calculations = calculateNutrition(input);

  try {
    const res = await fetch('/api/nutrition/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, calculations }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.source === 'gemini-3.8-flash' && data.data?.meals) {
        // Enriched by Gemini
        const plan = buildFullPlanFromCalculations(
          input,
          calculations,
          data.data.meals,
          data.data.routine
        );
        return { plan, source: 'gemini-3.8-flash' };
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API indisponível ou offline. Usando motor científico determinístico local.', err);
  }

  // Fallback to high-precision deterministic science engine
  const localPlan = buildFullPlanFromCalculations(input, calculations);
  return { plan: localPlan, source: 'local-deterministic' };
}

export async function requestAlternateMeal(
  mealType: string,
  currentMeal: Meal,
  student: UserInput,
  targetCalories: number,
  targetProtein: number
): Promise<Meal> {
  try {
    const res = await fetch('/api/nutrition/alternate-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mealType,
        currentMeal,
        student,
        targetCalories,
        targetProtein,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.meal) {
        return {
          id: `${mealType.toLowerCase().replace(/\s+/g, '_')}-${Date.now()}`,
          mealType: currentMeal.mealType,
          name: data.meal.name,
          ingredients: data.meal.ingredients,
          instructions: data.meal.instructions,
          calories: data.meal.calories,
          protein: data.meal.protein,
          carbs: data.meal.carbs || Math.round((data.meal.calories * 0.4) / 4),
          fats: data.meal.fats || Math.round((data.meal.calories * 0.25) / 9),
          tip: data.meal.tip,
        };
      }
    }
  } catch (err) {
    console.warn('Erro ao chamar alternate meal via API, gerando alternativa local.', err);
  }

  // Deterministic alternative recipes
  const altRecipes: Record<string, Partial<Meal>> = {
    'Café da manhã': {
      name: 'Crepioca Fit de Frango Desfiado com Ricota e Orégano',
      ingredients: [
        '2 ovos inteiros batidos com 1 clara',
        '2 colheres de sopa (30g) de goma de tapioca hidratada',
        '80g de peito de frango cozido e desfiado',
        '30g de creme de ricota light ou cottage',
        'Café passado ou chá verde sem açúcar',
      ],
      instructions: 'Misture os ovos com a goma de tapioca até homogeneizar. Despeje em frigideira quente antiaderente. Quando firmar, espalhe o frango desfiado com a ricota, dobre como um pastel e toste dos dois lados por 1 minuto.',
      tip: 'Alta saciedade, zero glúten e rico em proteína de fácil digestão para a manhã.',
    },
    'Lanche da manhã': {
      name: 'Overnight Oats Proteico com Frutas Frescas e Canela',
      ingredients: [
        '40g de aveia em flocos grossos',
        '1 scoop (30g) de Whey Protein isolado ou concentrado',
        '120ml de leite vegetal ou desnatado',
        '5 morangos picados + canela a gosto',
      ],
      instructions: 'Misture a aveia, o whey e o leite em um pote de vidro hermético. Deixe na geladeira por pelo menos 4 horas. Sirva com os morangos por cima e pitada de canela.',
      tip: 'Carboidratos de baixo índice glicêmico com liberação constante de energia.',
    },
    'Almoço': {
      name: 'Carne Magra em Tiras (Patinho) com Arroz 7 Grãos e Legumes Salteados',
      ingredients: [
        '180g de tiras de patinho bovino grelhadas com alho e cebola',
        '140g de arroz integral ou 7 grãos',
        '1 concha de feijão carioca',
        'Abobrinha, cenoura e vagem salteadas no azeite',
        'Salada de alface e tomate à vontade',
      ],
      instructions: 'Grelhe a carne em frigideira bem quente para selar os sucos. Em outra frigideira, salteie os legumes al dente com um fio de azeite e ervas. Monte o prato de forma equilibrada e colorida.',
      tip: 'Rico em ferro heme, creatina natural e zinco para suporte anabólico e recuperação muscular.',
    },
    'Lanche da tarde': {
      name: 'Waffle Fit Proteico de Forno com Pasta de Amendoim',
      ingredients: [
        '1 ovo inteiro + 2 claras',
        '35g de aveia em flocos finos',
        '1 scoop de whey protein de chocolate',
        '1 colher de chá de pasta de amendoim',
        '1/2 colher de café de fermento em pó',
      ],
      instructions: 'Bata os ingredientes no mixer e despeje na máquina de waffle ou em frigideira untada com óleo de coco em fogo baixo. Finalize espalhando a pasta de amendoim por cima.',
      tip: 'Excelente refeição 60 a 90 minutos antes do treino ou para saciar a vontade de doce.',
    },
    'Jantar': {
      name: 'Salmão Grelhado com Crosta de Ervas, Quinoa Cozida e Brócolis',
      ingredients: [
        '170g de posta de salmão grelhado',
        '100g de quinoa cozida temperada com cebolinha',
        'Brócolis e cenoura cozidos no vapor à vontade',
        'Fio de azeite e gotas de limão siciliano',
      ],
      instructions: 'Grelhe o salmão com a pele para baixo por 4 minutos, vire e deixe mais 3 minutos. Sirva com a quinoa morna e os vegetais.',
      tip: 'Fonte nobre de Ômega-3 anti-inflamatório para reduzir dores musculares pós-treino (DOMS).',
    },
    'Ceia': {
      name: 'Creme Noturno Proteico com Morangos e Semente de Abóbora',
      ingredients: [
        '150g de iogurte grego zero gordura ou ricota cremosa',
        '1/2 scoop de caseína ou albumina sabor baunilha',
        '50g de morangos picados',
        '1 colher de chá de sementes de abóbora tostadas',
      ],
      instructions: 'Misture bem até obter um creme espesso e sirva gelado com as sementes salpicadas.',
      tip: 'Sementes de abóbora são ricas em magnésio e triptofano, precursores da melatonina.',
    },
  };

  const chosen = altRecipes[mealType] || altRecipes['Almoço'];
  return {
    id: `${mealType.toLowerCase().replace(/\s+/g, '_')}-${Date.now()}`,
    mealType: currentMeal.mealType,
    name: chosen.name || currentMeal.name,
    ingredients: chosen.ingredients || currentMeal.ingredients,
    instructions: chosen.instructions || currentMeal.instructions,
    calories: targetCalories,
    protein: targetProtein,
    carbs: currentMeal.carbs,
    fats: currentMeal.fats,
    tip: chosen.tip || currentMeal.tip,
  };
}

export async function askNutritionAssistant(
  message: string,
  student: UserInput,
  calculations: NutritionCalculations
): Promise<string> {
  try {
    const res = await fetch('/api/nutrition/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, student: { ...student, calculations } }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch (err) {
    console.warn('Chat API indisponível, usando resposta heurística local:', err);
  }

  return `Excelente pergunta sobre a sua rotina para o objetivo de ${student.goal}! Lembre-se de priorizar bater seus ${calculations.macros.proteinGrams}g diários de proteína e beber no mínimo ${calculations.waterIntakeLiters}L de água. Ajuste o descanso entre as séries (60-90s para hipertrofia, 45s para definição) e mantenha a consistência diária!`;
}
