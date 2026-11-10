import {
  UserInput,
  NutritionCalculations,
  Meal,
  WeeklyRoutine,
  FullNutritionPlan,
  BmiResult,
  MacroDistribution,
} from '../types/nutrition';

/**
 * Cálculo do IMC com base na fórmula padrão: IMC = peso / (altura/100)²
 */
export function calculateBmi(weight: number, heightCm: number, goal: string): BmiResult {
  const heightM = heightCm / 100;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));

  let classification: BmiResult['classification'] = 'Peso normal';
  let color = 'text-emerald-400';
  let explanation = '';

  if (bmi < 18.5) {
    classification = 'Abaixo do peso';
    color = 'text-amber-400';
    explanation = 'O seu IMC indica que seu peso corporal está abaixo da faixa populacional recomendada. Para quem treina, isso sinaliza a necessidade de aumentar a densidade calórica e o consumo de nutrientes para construir massa muscular magra com segurança.';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    classification = 'Peso normal';
    color = 'text-emerald-400';
    explanation = 'Seu peso atual está dentro da faixa de equilíbrio saudável pela métrica populacional. Em frequentadores de academia, este é um ótimo ponto de partida tanto para focar em hipertrofia sólida quanto em definição muscular.';
  } else if (bmi >= 25 && bmi <= 29.9) {
    classification = 'Sobrepeso';
    color = 'text-orange-400';
    explanation = 'Pela métrica clássica do IMC, você está classificado na faixa de sobrepeso. Contudo, em praticantes assíduos de musculação, o músculo pesa mais que a gordura por volume. Por isso, avaliamos o IMC em conjunto com o espelho, densidade muscular e percentual de gordura.';
  } else if (bmi >= 30 && bmi <= 34.9) {
    classification = 'Obesidade Grau I';
    color = 'text-rose-400';
    explanation = 'Seu IMC aponta Obesidade Grau I. Uma intervenção nutricional estruturada com déficit calórico moderado, treino de força regular e cardio otimizará sua saúde cardiovascular e acelerará a perda de gordura visceral.';
  } else if (bmi >= 35 && bmi <= 39.9) {
    classification = 'Obesidade Grau II';
    color = 'text-rose-500';
    explanation = 'O índice indica Obesidade Grau II. Priorizar déficit calórico progressivo, controle de glicemia e treino de força com preservação articular proporcionará excelentes resultados de recomposição corporal e vigor físico.';
  } else {
    classification = 'Obesidade Grau III';
    color = 'text-rose-600';
    explanation = 'O índice aponta Obesidade Grau III. O plano foca em emagrecimento sustentável com ingestão proteica alta para blindar a massa magra e elevar o gasto metabólico diário com segurança.';
  }

  let strategyAdjustment = '';
  switch (goal) {
    case 'emagrecimento':
      strategyAdjustment = 'Estratégia ajustada para déficit calórico controlado (~20% abaixo do gasto diário), priorizando alta densidade proteica para blindar a musculatura e saciedade prolongada.';
      break;
    case 'hipertrofia':
      strategyAdjustment = 'Estratégia ajustada para superávit calórico limpo (+300 a +400 kcal/dia), garantindo substrato energético para síntese proteica acelerada e progressão de cargas no treino.';
      break;
    case 'definicao':
      strategyAdjustment = 'Estratégia ajustada para leve déficit calórico com proteína bem elevada (2.2g/kg), eliminando a retenção e gordura subcutânea sem sacrificar o volume muscular conquistado.';
      break;
    case 'manutencao':
    default:
      strategyAdjustment = 'Estratégia isocalórica equilibrada, voltada para recomposição corporal contínua, alta energia nos treinos e consolidação da massa magra.';
      break;
  }

  return { bmi, classification, color, explanation, strategyAdjustment };
}

/**
 * Cálculo científico de TMB, TDEE e Macronutrientes
 */
export function calculateNutrition(input: UserInput): NutritionCalculations {
  const { weight, height, age, gender, goal, frequency, duration } = input;

  // 1. TMB - Fórmula Mifflin-St Jeor
  let bmr: number;
  if (gender === 'masculino') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  bmr = Math.round(bmr);

  // 2. Fator de Atividade Física baseado na frequência e duração
  let activityFactor = 1.2; // Sedentário
  if (frequency <= 2) {
    activityFactor = 1.35;
  } else if (frequency <= 4) {
    activityFactor = duration > 60 ? 1.55 : 1.45;
  } else if (frequency <= 5) {
    activityFactor = duration > 60 ? 1.65 : 1.55;
  } else {
    activityFactor = duration > 60 ? 1.75 : 1.65;
  }

  // 3. TDEE (Gasto Energético Diário Total)
  const tdee = Math.round(bmr * activityFactor);

  // 4. Meta calórica ajustada para o objetivo
  let caloricDelta = 0;
  if (goal === 'emagrecimento') {
    caloricDelta = -450;
  } else if (goal === 'definicao') {
    caloricDelta = -300;
  } else if (goal === 'hipertrofia') {
    caloricDelta = 350;
  } else {
    caloricDelta = 0; // Manutenção
  }

  const targetCalories = Math.max(1200, Math.round(tdee + caloricDelta));

  // 5. Distribuição de Macronutrientes
  // Proteína (g/kg):
  let proteinPerKg = 2.0;
  if (goal === 'hipertrofia') proteinPerKg = 2.1;
  if (goal === 'definicao') proteinPerKg = 2.2;
  if (goal === 'emagrecimento') proteinPerKg = 2.0;
  if (goal === 'manutencao') proteinPerKg = 1.8;

  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinKcal = proteinGrams * 4;

  // Gorduras: ~0.8 a 0.9 g/kg para manter equilíbrio hormonal
  const fatsPerKg = goal === 'emagrecimento' ? 0.8 : 0.9;
  const fatsGrams = Math.round(weight * fatsPerKg);
  const fatsKcal = fatsGrams * 9;

  // Carboidratos: restantes das calorias
  const remainingKcal = Math.max(200, targetCalories - (proteinKcal + fatsKcal));
  const carbsGrams = Math.round(remainingKcal / 4);
  const carbsKcal = carbsGrams * 4;

  // Recalcular calorias reais somadas
  const actualTotalKcal = proteinKcal + fatsKcal + carbsKcal;

  const macros: MacroDistribution = {
    proteinGrams,
    proteinKcal,
    proteinPercentage: Math.round((proteinKcal / actualTotalKcal) * 100),
    proteinPerKg: Number(proteinPerKg.toFixed(1)),

    carbsGrams,
    carbsKcal,
    carbsPercentage: Math.round((carbsKcal / actualTotalKcal) * 100),

    fatsGrams,
    fatsKcal,
    fatsPercentage: Math.round((fatsKcal / actualTotalKcal) * 100),

    fiberGrams: Math.round(Math.max(25, (targetCalories / 1000) * 14)),
  };

  // 6. Hidratação ideal: 35ml/kg + 10ml por minuto de treino
  const baseWaterMl = weight * 35;
  const workoutWaterMl = duration * 10;
  const totalWaterMl = baseWaterMl + workoutWaterMl;
  const waterIntakeLiters = Number((totalWaterMl / 1000).toFixed(1));
  const waterGlassesCount = Math.ceil(totalWaterMl / 250);

  // 7. Explicação da estratégia
  let strategySummary = '';
  if (goal === 'hipertrofia') {
    strategySummary = `Para gerar hipertrofia de forma expressiva e limpa, estabelecemos um superávit calórico de +${caloricDelta} kcal/dia em relação ao seu gasto energético diário (${tdee} kcal). Com ${macros.proteinGrams}g de proteína (${macros.proteinPerKg}g/kg), o aporte de aminoácidos para síntese de miofibrilas fica no ápice biológico. Os carboidratos (${macros.carbsGrams}g) garantirão que seus estoques de glicogênio muscular fiquem sempre cheios para treinos de alta intensidade e cargas progressivas.`;
  } else if (goal === 'emagrecimento') {
    strategySummary = `Para otimizar a oxidação de gorduras preservando sua massa magra, aplicamos um déficit calórico estratégico de ${Math.abs(caloricDelta)} kcal/dia. A cota de proteína foi fixada em ${macros.proteinGrams}g (${macros.proteinPerKg}g/kg) para induzir máxima saciedade, poupar o tecido muscular durante o déficit e aumentar o efeito térmico dos alimentos (TEF). Os carboidratos (${macros.carbsGrams}g) estão concentrados estrategicamente ao redor dos treinos.`;
  } else if (goal === 'definicao') {
    strategySummary = `Para esculpir definição muscular e densidade sem perder volume, o déficit é moderado (-${Math.abs(caloricDelta)} kcal/dia), somado a uma alta taxa proteica de ${macros.proteinGrams}g (${macros.proteinPerKg}g/kg). Essa configuração força o corpo a utilizar a gordura subcutânea como combustível durante os treinos na academia, mantendo a vascularização e o tônus elevados.`;
  } else {
    strategySummary = `Em manutenção e recomposição corporal, o aporte calórico emparelha exatamente com o seu gasto (${targetCalories} kcal). Com ${macros.proteinGrams}g de proteína e gorduras anti-inflamatórias bem distribuídas, você desenvolve força, melhora a qualidade do tecido muscular e consolida uma rotina sustentável a longo prazo.`;
  }

  const bmiData = calculateBmi(weight, height, goal);

  return {
    bmi: bmiData.bmi,
    bmiClassification: bmiData.classification,
    bmiExplanation: bmiData.explanation,
    strategyAdjustment: bmiData.strategyAdjustment,
    bmr,
    activityFactor,
    tdee,
    targetCalories,
    caloricDelta,
    macros,
    strategySummary,
    waterIntakeLiters,
    waterGlassesCount,
  };
}

/**
 * Criação do Cardápio Fit de 1 Dia adaptado aos dados, restrições e preferências
 */
export function generateDeterministicFitMealPlan(
  input: UserInput,
  calc: NutritionCalculations
): Meal[] {
  const { goal, preferences, restrictions, allergies } = input;
  const isVeg = restrictions.toLowerCase().includes('vegano') || restrictions.toLowerCase().includes('vegetariano');
  const isNoLactose = restrictions.toLowerCase().includes('lactose') || allergies.toLowerCase().includes('lactose');
  const isNoGluten = restrictions.toLowerCase().includes('glúten') || restrictions.toLowerCase().includes('gluten');
  const hasEggPref = preferences.toLowerCase().includes('ovo') || preferences.toLowerCase().includes('ovos');
  const hasChickenPref = preferences.toLowerCase().includes('frango');
  const hasOatPref = preferences.toLowerCase().includes('aveia');

  const totalKcal = calc.targetCalories;
  const totalProt = calc.macros.proteinGrams;

  // Distribuição calórica e proteica pelas 6 refeições:
  // Café: ~22% kcal, 22% prot
  // Lanche Manhã: ~12% kcal, 13% prot
  // Almoço: ~28% kcal, 28% prot
  // Lanche Tarde: ~16% kcal, 17% prot
  // Jantar: ~18% kcal, 16% prot
  // Ceia: ~4% kcal, 4% prot

  const mealRatios = [
    { type: 'Café da manhã' as const, kcalRatio: 0.22, protRatio: 0.22 },
    { type: 'Lanche da manhã' as const, kcalRatio: 0.12, protRatio: 0.13 },
    { type: 'Almoço' as const, kcalRatio: 0.28, protRatio: 0.28 },
    { type: 'Lanche da tarde' as const, kcalRatio: 0.16, protRatio: 0.17 },
    { type: 'Jantar' as const, kcalRatio: 0.18, protRatio: 0.16 },
    { type: 'Ceia' as const, kcalRatio: 0.04, protRatio: 0.04 },
  ];

  const meals: Meal[] = [];

  // 1. Café da Manhã
  const bKcal = Math.round(totalKcal * mealRatios[0].kcalRatio);
  const bProt = Math.round(totalProt * mealRatios[0].protRatio);
  meals.push({
    id: 'breakfast',
    mealType: 'Café da manhã',
    name: isVeg
      ? 'Panqueca Fit de Aveia Proteica com Frutas e Canela'
      : (hasEggPref ? 'Omelete Anabólico Turbinado com Queijo Branco e Pão Integral' : 'Panqueca Proteica de Whey com Pasta de Amendoim e Banana'),
    ingredients: isVeg
      ? [
          '50g de aveia em flocos finos',
          '1 scoop (30g) de proteína vegetal ou isolada',
          '1 banana média amassada',
          '1 colher (chá) de sementes de chia',
          'Canela em pó a gosto e 100ml de leite vegetal',
        ]
      : (isNoLactose
          ? [
              '3 ovos inteiros + 2 claras pasteurizadas',
              '2 fatias de pão 100% integral (ou pão sem glúten)',
              '1/2 abacate maduro fatiado com pitada de sal rosa',
              'Café preto sem açúcar ou com estévia',
            ]
          : [
              '3 ovos inteiros caipiras batidos',
              '40g de queijo minas frescal light (ou ricota)',
              '2 fatias de pão integral 7 grãos',
              '1 xícara de café puro aromatizado com canela',
              '1 maçã média picada',
            ]),
    instructions: 'Bata os ovos vigorosamente com uma pitada de orégano. Despeje em frigideira antiaderente pré-aquecida em fogo baixo. Adicione o queijo picado, tampe até dourar e dobre ao meio. Sirva imediatamente acompanhado do pão tostado e café fresco.',
    calories: bKcal,
    protein: bProt,
    carbs: Math.round((bKcal * 0.45) / 4),
    fats: Math.round((bKcal * 0.25) / 9),
    tip: 'Ótima absorção matinal para fornecer aminoácidos de liberação rápida e manter o tônus para o treino.',
  });

  // 2. Lanche da Manhã
  const mKcal = Math.round(totalKcal * mealRatios[1].kcalRatio);
  const mProt = Math.round(totalProt * mealRatios[1].protRatio);
  meals.push({
    id: 'morning_snack',
    mealType: 'Lanche da manhã',
    name: isNoLactose
      ? 'Iogurte Zero Lactose Turbinado com Frutas Vermelhas e Castanhas'
      : 'Bowl Proteico de Iogurte Grego Natural com Granola Fit e Chia',
    ingredients: isNoLactose
      ? [
          '1 pote (160g) de iogurte grego zero lactose',
          '1/2 scoop de proteína em pó ou colágeno hidrolisado',
          '80g de morangos e mirtilos frescos',
          '15g de castanhas-do-pará ou nozes picadas',
        ]
      : [
          '170g de iogurte grego natural desnatado',
          '1 scoop (30g) de Whey Protein de baunilha ou morango',
          '30g de granola fit sem adição de açúcar',
          '1 colher (sopa) de chia ou linhaça dourada',
        ],
    instructions: 'Misture o whey protein no iogurte grego até formar um creme homogêneo e aveludado. Cubra com as frutas frescas e finalize salpicando as sementes e castanhas.',
    calories: mKcal,
    protein: mProt,
    carbs: Math.round((mKcal * 0.40) / 4),
    fats: Math.round((mKcal * 0.22) / 9),
    tip: 'Prático para levar ao trabalho e ideal para manter o balanço nitrogenado positivo antes do almoço.',
  });

  // 3. Almoço
  const lKcal = Math.round(totalKcal * mealRatios[2].kcalRatio);
  const lProt = Math.round(totalProt * mealRatios[2].protRatio);
  meals.push({
    id: 'lunch',
    mealType: 'Almoço',
    name: isVeg
      ? 'Tofu Grelhado ao Molho de Ervas com Arroz Integral e Feijão Preto'
      : (hasChickenPref ? 'Peito de Frango Grelhado na Manteiga Ghee com Batata Doce e Brócolis' : 'Patinho Moído Magro com Mandioca Cozida e Mix de Folhas Escuras'),
    ingredients: isVeg
      ? [
          '180g de tofu firme grelhado e marinado com cúrcuma e azeite',
          '150g de arroz integral cozido',
          '1 concha média (100g) de feijão preto temperado',
          'Prato cheio de brócolis cozido no vapor e rúcula',
          '1 fio de azeite de oliva extravirgem (5ml)',
        ]
      : [
          '160g a 200g de peito de frango limpo sem pele (ou patinho moído)',
          '160g de batata doce assada ou arroz integral com cúrcuma',
          '1 concha de feijão carioca com caldo',
          'Salada à vontade: espinafre, tomate cereja, alface roxa e cenoura ralada',
          '1 colher de sobremesa de azeite extravirgem e gotas de limão',
        ],
    instructions: 'Grelhe a proteína com temperos naturais (alho, cebola, páprica defumada e ervas finas) em fogo médio para manter a suculência. Monte o prato dividindo metade em vegetais coloridos, um quarto para os carboidratos complexos e outro quarto para a proteína magra.',
    calories: lKcal,
    protein: lProt,
    carbs: Math.round((lKcal * 0.48) / 4),
    fats: Math.round((lKcal * 0.20) / 9),
    tip: 'Refeição nobre rica em micronutrientes, ferro, potássio e complexo B essenciais para contração muscular.',
  });

  // 4. Lanche da Tarde (Pré/Pós Treino)
  const aKcal = Math.round(totalKcal * mealRatios[3].kcalRatio);
  const aProt = Math.round(totalProt * mealRatios[3].protRatio);
  meals.push({
    id: 'afternoon_snack',
    mealType: 'Lanche da tarde',
    name: 'Shake Anabólico Pré/Pós Treino com Aveia e Banana',
    ingredients: [
      '1 dose e meia (40g) de Whey Protein ou proteína isolada',
      '1 banana nanica congelada em rodelas',
      '35g de farelo de aveia',
      '1 colher (chá) de pasta de amendoim integral',
      '250ml de água gelada ou leite desnatado/vegetal',
      'Canela em pó e 3 pedras de gelo',
    ],
    instructions: 'Coloque todos os ingredientes no liquidificador ou mixer potente. Bata na velocidade máxima por 45 segundos até formar um shake encorpado e cremoso. Beba de 60 a 90 minutos antes do treino ou logo após finalizar.',
    calories: aKcal,
    protein: aProt,
    carbs: Math.round((aKcal * 0.50) / 4),
    fats: Math.round((aKcal * 0.18) / 9),
    tip: 'Digestão rápida e eficiente: fornece glicose para o treino e aminoácidos essenciais (BCAAs) para recuperação tecidual imediata.',
  });

  // 5. Jantar
  const dKcal = Math.round(totalKcal * mealRatios[4].kcalRatio);
  const dProt = Math.round(totalProt * mealRatios[4].protRatio);
  meals.push({
    id: 'dinner',
    mealType: 'Jantar',
    name: isVeg
      ? 'Hambúrguer Caseiro de Grão de Bico e Lentilha com Purê de Abóbora'
      : 'Filé de Tilápia Grelhada ao Limão Siciliano com Purê de Mandioquinha e Aspargos',
    ingredients: isVeg
      ? [
          '2 hambúrgueres artesanais de grão-de-bico com quinoa (160g)',
          '150g de abóbora cabotiá cozida e amassada com alho-poró',
          'Mix de folhas verde-escuras à vontade',
          'Azeite extravirgem e sementes de gergelim tostadas',
        ]
      : [
          '180g de filé de tilápia (ou salmão ou frango desfiado)',
          '130g de purê de mandioquinha ou batata inglesa com azeite',
          '1 xícara de abobrinha e aspargos grelhados',
          'Salada refrescante de folhas verdes, pepino e limão',
          '1 colher de chá de azeite de oliva',
        ],
    instructions: 'Tempere o filé de peixe com limão, alho e sal marinho. Grelhe por 3 a 4 minutos de cada lado até ficar suculento e dourado. Sirva ao lado do purê quente de mandioquinha e vegetais grelhados.',
    calories: dKcal,
    protein: dProt,
    carbs: Math.round((dKcal * 0.40) / 4),
    fats: Math.round((dKcal * 0.22) / 9),
    tip: 'Proteína leve de excelente digestibilidade noturna, garantindo sono restaurador sem sobrecarga estomacal.',
  });

  // 6. Ceia
  const sKcal = Math.round(totalKcal * mealRatios[5].kcalRatio);
  const sProt = Math.round(totalProt * mealRatios[5].protRatio);
  meals.push({
    id: 'supper',
    mealType: 'Ceia',
    name: 'Mousse Noturno de Abacate com Cacau 100% e Caseína/Albumina',
    ingredients: [
      '50g de abacate fresco ou avocado',
      '1/2 scoop de caseína micelar ou proteína de liberação lenta (ou 2 ovos cozidos leves)',
      '1 colher de chá de cacau 100% em pó',
      '3 a 4 gotas de estévia ou xilitol',
      '50ml de água gelada para emulsionar',
    ],
    instructions: 'Amasse o abacate com a proteína e o cacau usando um garfo ou mini mixer até obter consistência de mousse. Sirva gelado 30 a 45 minutos antes de deitar.',
    calories: sKcal,
    protein: sProt,
    carbs: Math.round((sKcal * 0.20) / 4),
    fats: Math.round((sKcal * 0.45) / 9),
    tip: 'Gorduras boas e aminoácidos de absorção prolongada previnem o catabolismo noturno e sustentam o pico de GH (hormônio do crescimento) durante o sono profundo.',
  });

  return meals;
}

/**
 * Criação da Rotina Fit Semanal baseada na frequência do aluno
 */
export function generateDeterministicWeeklyRoutine(
  input: UserInput,
  calc: NutritionCalculations
): WeeklyRoutine {
  const { frequency, duration, goal } = input;

  let splitName = 'Divisão ABC Clássica';
  const days: WeeklyRoutine['days'] = [];

  if (frequency <= 2) {
    splitName = 'Full Body 2x (Estímulo Global)';
    days.push(
      {
        day: 'Dia 1 (Segunda)',
        focus: 'Full Body A - Ênfase em Cadeia Posterior e Empurrar',
        exercises: ['Agachamento Livre (4x8)', 'Supino Reto (4x8)', 'Puxada Alta (4x10)', 'Desenvolvimento Militar (3x10)', 'Prancha Abdominal (3x45s)'],
        durationMinutes: duration,
      },
      {
        day: 'Dia 2 (Quinta)',
        focus: 'Full Body B - Ênfase em Cadeia Anterior e Puxar',
        exercises: ['Levantamento Terra Romeno (4x8)', 'Leg Press 45° (4x10)', 'Remada Curvada (4x8)', 'Paralelas ou Supino Inclinado (3x10)', 'Elevação Pélvica (3x12)'],
        durationMinutes: duration,
      }
    );
  } else if (frequency === 3) {
    splitName = 'Divisão ABC Hipertrofia & Força';
    days.push(
      {
        day: 'Dia 1 (Segunda)',
        focus: 'Treino A - Peitoral, Tríceps e Deltoide Anterior',
        exercises: ['Supino Inclinado com Halteres (4x8-10)', 'Crucifixo na Polia (3x12)', 'Desenvolvimento Militar (4x8)', 'Tríceps Corda (3x12)', 'Tríceps Testa (3x10)'],
        durationMinutes: duration,
      },
      {
        day: 'Dia 2 (Quarta)',
        focus: 'Treino B - Dorsais, Bíceps, Trapézio e Deltoide Posterior',
        exercises: ['Puxada Frente Aberta (4x10)', 'Remada Baixa Triângulo (4x8-10)', 'Crucifixo Invertido (3x12)', 'Rosca Direta Barra W (3x10)', 'Rosca Martelo (3x12)'],
        durationMinutes: duration,
      },
      {
        day: 'Dia 3 (Sexta)',
        focus: 'Treino C - Membros Inferiores Completos e Core',
        exercises: ['Agachamento no Hack ou Livre (4x8)', 'Leg Press 45° (4x10-12)', 'Mesa Flexora (4x12)', 'Cadeira Extensora (3x15)', 'Panturrilha em Pé (4x15)', 'Abdominal Infra na Paralela (3x15)'],
        durationMinutes: duration,
      }
    );
  } else if (frequency === 4) {
    splitName = 'Divisão Upper / Lower 4x (Otimização Frequência 2x)';
    days.push(
      {
        day: 'Segunda-feira',
        focus: 'Upper A - Tronco e Braços (Força)',
        exercises: ['Supino Reto com Barra (4x6-8)', 'Remada Curvada com Barra (4x6-8)', 'Desenvolvimento Halteres (3x8-10)', 'Puxada Alta Neutra (3x10)', 'Super-série Bíceps + Tríceps (3x10)'],
        durationMinutes: duration,
      },
      {
        day: 'Terça-feira',
        focus: 'Lower A - Membros Inferiores (Quadríceps Focus)',
        exercises: ['Agachamento Livre (4x6-8)', 'Leg Press 45° (4x10)', 'Cadeira Extensora (3x12)', 'Cadeira Flexora (4x10)', 'Panturrilha no Leg (4x15)'],
        durationMinutes: duration,
      },
      {
        day: 'Quinta-feira',
        focus: 'Upper B - Tronco e Braços (Hipertrofia / Volume)',
        exercises: ['Supino Inclinado com Halteres (4x10)', 'Remada Cavalinho (4x10)', 'Elevação Lateral na Polia (4x12-15)', 'Crucifixo Inclinado (3x12)', 'Rosca Scott + Tríceps Francês (3x12)'],
        durationMinutes: duration,
      },
      {
        day: 'Sexta-feira',
        focus: 'Lower B - Membros Inferiores (Posterior & Glúteo Focus)',
        exercises: ['Levantamento Terra Romeno / Stiff (4x8)', 'Elevação Pélvica com Barra (4x10)', 'Mesa Flexora (4x12)', 'Búlgaro com Halteres (3x10/perna)', 'Gêmeos Sentado (4x15)'],
        durationMinutes: duration,
      }
    );
  } else if (frequency === 5) {
    splitName = 'Divisão Push / Pull / Legs + Upper / Lower (5 Dias)';
    days.push(
      {
        day: 'Segunda-feira',
        focus: 'Push (Empurrar) - Peitoral, Ombros e Tríceps',
        exercises: ['Supino Inclinado com Halteres (4x8-10)', 'Supino Reto com Barra (3x8)', 'Desenvolvimento Militar (4x8)', 'Elevação Lateral (4x12)', 'Tríceps Polia (3x12)'],
        durationMinutes: duration,
      },
      {
        day: 'Terça-feira',
        focus: 'Pull (Puxar) - Costas, Bíceps e Trapézio',
        exercises: ['Puxada Alta Aberta (4x8-10)', 'Remada Baixa Pronada (4x10)', 'Remada Unilateral com Halter (Serrote) (3x10)', 'Crucifixo Invertido (3x15)', 'Rosca Direta (3x10)'],
        durationMinutes: duration,
      },
      {
        day: 'Quarta-feira',
        focus: 'Legs (Pernas) - Quadríceps e Panturrilhas',
        exercises: ['Agachamento Livre (4x8)', 'Leg Press 45° (4x10)', 'Cadeira Extensora (4x12)', 'Passada Afundo (3x12 passos)', 'Panturrilha em Pé (5x15)'],
        durationMinutes: duration,
      },
      {
        day: 'Sexta-feira',
        focus: 'Upper (Membros Superiores Geral)',
        exercises: ['Supino com Halteres (3x10)', 'Puxada Triângulo (3x10)', 'Elevação Lateral Polia (4x15)', 'Rosca Martelo (3x12)', 'Tríceps Corda (3x12)'],
        durationMinutes: duration,
      },
      {
        day: 'Sábado',
        focus: 'Lower (Posteriores de Coxa, Glúteo e Core)',
        exercises: ['Stiff com Barra (4x8-10)', 'Mesa Flexora (4x12)', 'Elevação Pélvica (4x10)', 'Cadeira Abdutora (3x15)', 'Abdominal Supra na Polia (4x15)'],
        durationMinutes: duration,
      }
    );
  } else {
    splitName = 'Divisão PPL x2 (Push, Pull, Legs - 6 Dias)';
    days.push(
      { day: 'Segunda', focus: 'Push A (Peito, Ombros, Tríceps)', exercises: ['Supino Reto', 'Supino Inclinado Halteres', 'Desenvolvimento', 'Elevação Lateral', 'Tríceps'], durationMinutes: duration },
      { day: 'Terça', focus: 'Pull A (Costas, Bíceps, Posterior Ombro)', exercises: ['Puxada Frente', 'Remada Curvada', 'Remada Baixa', 'Crucifixo Invertido', 'Rosca Direta'], durationMinutes: duration },
      { day: 'Quarta', focus: 'Legs A (Foco Quadríceps)', exercises: ['Agachamento Livre', 'Leg Press 45', 'Cadeira Extensora', 'Panturrilhas'], durationMinutes: duration },
      { day: 'Quinta', focus: 'Push B (Variação de Ângulos)', exercises: ['Crucifixo Polia', 'Paralelas', 'Elevação Lateral Cabo', 'Tríceps Francês'], durationMinutes: duration },
      { day: 'Sexta', focus: 'Pull B (Foco Espessura)', exercises: ['Levantamento Terra', 'Remada Cavalinho', 'Puxada Supinada', 'Rosca Scott'], durationMinutes: duration },
      { day: 'Sábado', focus: 'Legs B (Foco Posterior e Glúteo)', exercises: ['Stiff', 'Mesa Flexora', 'Búlgaro', 'Elevação Pélvica'], durationMinutes: duration },
      ...(frequency === 7
        ? [{ day: 'Domingo', focus: 'Recuperação Ativa & Mobilidade', exercises: ['30min Caminhada Leve', 'Sessão de Alongamento e Mobilidade de Quadril/Ombros'], durationMinutes: 30 }]
        : [])
    );
  }

  // Plano de Cardio
  let cardio: WeeklyRoutine['cardio'];
  if (goal === 'emagrecimento') {
    cardio = {
      frequency: '4 a 5 vezes na semana',
      duration: '30 a 40 minutos',
      type: 'LISS (Esteira inclinada 6km/h com 6% inclinação) ou Bike moderada',
      timing: 'Imediatamente após a musculação ou em horário oposto ao treino',
      recommendation: 'Mantenha a frequência cardíaca na zona 2 (60% a 70% da FCM), onde a oxidação de ácidos graxos é máxima sem degradar a massa muscular.',
    };
  } else if (goal === 'definicao') {
    cardio = {
      frequency: '3 a 4 vezes na semana',
      duration: '25 a 30 minutos',
      type: 'Cardio moderado contínuo ou 1 sessão de HIIT semanal',
      timing: 'Pós-treino de membros superiores ou em dias sem treino de perna',
      recommendation: 'Excelente para queimar gordura residual e aumentar a densidade vascular sem interferir na recuperação das pernas.',
    };
  } else if (goal === 'hipertrofia') {
    cardio = {
      frequency: '2 a 3 vezes na semana',
      duration: '20 minutos',
      type: 'Caminhada rápida em esteira inclinada ou elíptico',
      timing: 'Após a musculação ou em dias de descanso',
      recommendation: 'O cardio na hipertrofia é essencial para manter a saúde mitocondrial e sensibilidade à insulina, permitindo que os carboidratos sejam particionados para dentro do músculo e não para a gordura.',
    };
  } else {
    cardio = {
      frequency: '3 vezes na semana',
      duration: '25 a 35 minutos',
      type: 'Corrida leve, natação ou bike',
      timing: 'Preferencialmente pós-treino',
      recommendation: 'Foco em resistência aeróbica e condicionamento cardiopulmonar.',
    };
  }

  // Plano de Hidratação
  const hydration: WeeklyRoutine['hydration'] = {
    totalLiters: calc.waterIntakeLiters,
    glassesCount: calc.waterGlassesCount,
    formula: `Fórmula: (${input.weight}kg × 35ml) + (${input.duration}min de treino × 10ml) = ${(calc.waterIntakeLiters * 1000).toFixed(0)}ml`,
    distributionTip: `Beba 500ml ao acordar em jejum para reativar o peristaltismo. Durante o treino, consuma 500ml a 700ml fracionados entre as séries. O restante distribua uniformemente até as 20h para não acordar à noite.`,
  };

  // Recomendações de descanso e sono
  const recovery: WeeklyRoutine['recovery'] = {
    sleepHours: '7 a 9 horas por noite de sono reparador',
    recommendations: [
      'Higiene do sono: corte telas azuis (celular/TV) 45 minutos antes de deitar ou use filtro noturno.',
      'Temperatura fresca e quarto 100% escuro estimulam a liberação natural máxima de Melatonina e GH.',
      'O tecido muscular não cresce durante o treino (onde ocorre o estresse); o crescimento e hipertrofia acontecem durante o sono profundo!',
      'Dias sem treino são dias de construção muscular: alimente-se rigorosamente da mesma forma para reparar as fibras.',
    ],
  };

  // 4 Dicas de Ouro
  const proTips = [
    'Sobrecarga Progressiva: anote suas cargas semanalmente. Se você levantar o mesmo peso daqui a 6 meses, seu corpo não terá motivo biológico para hipertrofiar.',
    'Timing de Proteínas: fracione sua meta de proteína em 4 a 6 ingestões diárias espaçadas por 3 a 4 horas para manter o estímulo contínuo de mTOR (síntese proteica).',
    'Creatina Monoidratada: suplemente de 3g a 5g diariamente, inclusive nos dias de descanso, para saturar os estoques de fosfocreatina e aumentar sua força em 10-15%.',
    'Consistência > Perfeição: executar 85% do plano por 6 meses trará 10x mais resultados do que seguir 100% por apenas 2 semanas. Mantenha o foco!',
  ];

  return {
    splitName,
    frequencyDays: frequency,
    days,
    cardio,
    hydration,
    recovery,
    proTips,
  };
}

/**
 * Gera mensagem motivadora profissional
 */
export function generateMotivationalHeader(input: UserInput, calc: NutritionCalculations): string {
  const goalText =
    input.goal === 'hipertrofia'
      ? 'construção muscular e ganho expressivo de força'
      : input.goal === 'emagrecimento'
      ? 'queima acelerada de gordura e blindagem da musculatura'
      : input.goal === 'definicao'
      ? 'esculpir cortes profundos, vascularização e simetria'
      : 'máxima vitalidade, recomposição corporal e desempenho';

  return `Fala, ${input.name}! Seu plano inteligente do NutriFit Pro foi arquitetado com base rigorosa em fisiologia esportiva. Com sua frequência de ${input.frequency}x na academia e foco em ${goalText}, cada grama deste cardápio e cada repetição da sua rotina semanal foram alinhados para gerar transformações visíveis. O compromisso começa na próxima refeição!`;
}

/**
 * Criação do plano completo integrado
 */
export function buildFullPlanFromCalculations(
  input: UserInput,
  calc: NutritionCalculations,
  customMeals?: Meal[],
  customRoutine?: WeeklyRoutine
): FullNutritionPlan {
  const meals = customMeals || generateDeterministicFitMealPlan(input, calc);
  const routine = customRoutine || generateDeterministicWeeklyRoutine(input, calc);
  const motivationalMessage = generateMotivationalHeader(input, calc);

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    user: input,
    calculations: calc,
    meals,
    routine,
    motivationalMessage,
    engineSource: customMeals ? 'gemini-3.8-flash' : 'local-deterministic',
  };
}
