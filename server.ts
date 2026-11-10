import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gen AI client with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    hasApiKey: Boolean(apiKey),
    engine: 'NutriFit Pro Smart Engine v2.0',
  });
});

// AI Nutrition Engine: Generate / Personalize Fit Plan
app.post('/api/nutrition/generate', async (req, res) => {
  try {
    const student = req.body;
    const {
      name,
      age,
      gender,
      height,
      weight,
      goal,
      frequency,
      duration,
      restrictions,
      allergies,
      preferences,
      calculations,
    } = student;

    if (!ai) {
      // If no API key configured, return indicator so client uses high-precision deterministic science engine
      return res.json({
        success: true,
        source: 'local-deterministic',
        message: 'Engine local ativado.',
      });
    }

    const systemPrompt = `Você é o motor inteligente do NutriFit Pro, uma plataforma SaaS de nutrição de alto padrão para quem treina musculação/academia.
Sua missão é gerar um plano altamente personalizado, detalhado e prático em formato JSON estrito.

Dados do aluno:
- Nome: ${name}
- Idade: ${age} anos
- Sexo: ${gender}
- Altura: ${height} cm | Peso: ${weight} kg
- Objetivo: ${goal}
- Treina: ${frequency} vezes/semana na academia
- Duração do treino: ${duration} minutos
- Restrições alimentares: ${restrictions || 'Nenhuma'}
- Alergias: ${allergies || 'Nenhuma'}
- Preferências: ${preferences || 'Nenhuma'}
- Metas calculadas: IMC ${calculations?.bmi} (${calculations?.bmiClassification}), TMB ${calculations?.bmr} kcal, TDEE ${calculations?.tdee} kcal, Meta Calórica ${calculations?.targetCalories} kcal, Proteína ${calculations?.targetProtein}g, Carboidratos ${calculations?.targetCarbs}g, Gorduras ${calculations?.targetFats}g, Hidratação ${calculations?.waterIntakeLiters}L.

REGRAS OBRIGATÓRIAS:
1. Respeite 100% as restrições alimentares e alergias (NUNCA inclua ingredientes alérgenos ou restritos).
2. O cardápio deve ter exatamente 6 refeições: Café da manhã, Lanche da manhã, Almoço, Lanche da tarde, Jantar, Ceia.
3. Cada refeição deve ter:
   - name: nome atrativo e fit da receita
   - ingredients: array de strings com quantidades precisas em gramas/medidas caseiras
   - instructions: modo de preparo passo a passo simples e prático
   - calories: calorias numéricas estimadas
   - protein: gramas numéricas estimadas de proteína
   - carbs: gramas numéricas de carboidratos
   - fats: gramas numéricas de gordura
   - tip: dica fit de consumo ou substituição
4. As receitas devem ser FÁCEIS de preparar, ricas em proteína e voltadas para rotina de academia.
5. Rotina Semanal com divisão precisa baseada em ${frequency} dias (ex: se 3x: ABC; se 4x: Upper/Lower; se 5x: PPLUL ou ABCDE; etc.), com sugestão de cardio específica para o objetivo ${goal}, hidratação diária explicada, descanso/sono e 4 dicas de ouro práticas.
6. Tom motivador, profissional e acolhedor. Responda em português.

Responda APENAS com um objeto JSON válido, sem formatação markdown em volta, com a seguinte estrutura:
{
  "explanation": "Breve explicação personalizada e motivadora da estratégia para ${name}",
  "meals": [
    {
      "id": "breakfast",
      "mealType": "Café da manhã",
      "name": "Nome da receita",
      "ingredients": ["..."],
      "instructions": "...",
      "calories": 450,
      "protein": 35,
      "carbs": 45,
      "fats": 12,
      "tip": "..."
    },
    ... (morning_snack, lunch, afternoon_snack, dinner, supper)
  ],
  "routine": {
    "splitName": "...",
    "days": [
      {
        "day": "Dia 1 (Segunda)",
        "focus": "Peito, Tríceps e Deltoide Anterior",
        "exercises": ["Supino reto", "Desenvolvimento com halteres", "Tríceps polia"],
        "durationMinutes": ${duration}
      }
    ],
    "cardio": {
      "frequency": "...",
      "duration": "...",
      "type": "...",
      "timing": "...",
      "recommendation": "..."
    },
    "hydration": {
      "totalLiters": "${calculations?.waterIntakeLiters || '3.2'}",
      "formula": "35ml/kg + 500ml pós-treino",
      "distributionTip": "..."
    },
    "recovery": {
      "sleepHours": "7h30 a 8h30",
      "recommendations": ["..."]
    },
    "proTips": [
      "...",
      "...",
      "..."
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Regex parse fallback
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Não foi possível interpretar a resposta estruturada.');
      }
    }

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data,
    });
  } catch (err: any) {
    console.error('Erro ao gerar com Gemini:', err?.message || err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Erro interno no motor de inteligência.',
      fallbackAvailable: true,
    });
  }
});

// AI Nutrition Engine: Generate Alternative Meal Recipe
app.post('/api/nutrition/alternate-meal', async (req, res) => {
  try {
    const { mealType, currentMeal, student, targetCalories, targetProtein } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'API Key não configurada para gerar alternativas dinâmicas.' });
    }

    const prompt = `Gere uma receita fit alternativa para a refeição "${mealType}".
Aluno: ${student.name}, Objetivo: ${student.goal}.
Restrições: ${student.restrictions || 'nenhuma'}.
Alergias: ${student.allergies || 'nenhuma'}.
Preferências: ${student.preferences || 'nenhuma'}.
Meta calórica da refeição: ~${targetCalories} kcal e ~${targetProtein}g de proteína.
A receita anterior era "${currentMeal?.name}". Crie uma opção diferente, prática, proteica e focada em quem treina.

Responda APENAS com JSON:
{
  "name": "Nome da nova receita fit",
  "ingredients": ["item 1", "item 2", "..."],
  "instructions": "Passo a passo simples",
  "calories": ${targetCalories},
  "protein": ${targetProtein},
  "carbs": 30,
  "fats": 10,
  "tip": "Dica especial de consumo"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    res.json({ success: true, meal: data });
  } catch (err: any) {
    console.error('Erro ao gerar refeição alternativa:', err);
    res.status(500).json({ success: false, error: 'Falha ao gerar receita alternativa.' });
  }
});

// AI Nutrition Assistant Chat
app.post('/api/nutrition/chat', async (req, res) => {
  try {
    const { message, planSummary, student } = req.body;

    if (!ai) {
      return res.json({
        reply: `Dica inteligente do motor NutriFit: Para o seu objetivo de ${student?.goal || 'treino'}, priorize bater a meta de proteínas (${student?.calculations?.targetProtein || '150'}g/dia) e mantenha consistência no descanso! (Conecte sua API Key do Gemini no painel de Secrets para respostas conversacionais profundas).`,
      });
    }

    const prompt = `Você é o assistente nutricional inteligente integrado à plataforma NutriFit Pro.
Aluno: ${student.name}, ${student.age} anos, ${student.weight}kg, ${student.height}cm.
Objetivo: ${student.goal}.
Frequência: ${student.frequency}x/semana na academia.
Restrições: ${student.restrictions || 'nenhuma'}. Alergias: ${student.allergies || 'nenhuma'}.
Plano atual: ${student.calculations?.targetCalories} kcal diárias, ${student.calculations?.targetProtein}g proteína.
Pergunta do aluno/treinador: "${message}"

Responda de forma direta, motivadora, prática, com base científica em nutrição esportiva e hipertrofia/definição. Seja conciso (máximo 3 parágrafos) e com boa formatação com tópicos se necessário.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Erro no chat nutricional:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem do assistente.' });
  }
});

// In development, Vite middlewares are mounted
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production static serve
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NutriFit Pro Engine rodando na porta ${PORT}`);
});
