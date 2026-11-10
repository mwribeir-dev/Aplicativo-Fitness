import React, { useState } from 'react';
import { UserInput, Gender, Goal } from '../types/nutrition';
import { Sparkles, User, Activity, AlertCircle, Heart, Flame } from 'lucide-react';

interface StudentFormProps {
  initialData?: UserInput;
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const PRESETS: { label: string; data: UserInput }[] = [
  {
    label: 'Lucas (Hipertrofia 5x)',
    data: {
      name: 'Lucas Silva',
      age: 25,
      gender: 'masculino',
      height: 178,
      weight: 78,
      goal: 'hipertrofia',
      frequency: 5,
      duration: 65,
      restrictions: 'Nenhuma',
      allergies: 'Nenhuma',
      preferences: 'Ovos, peito de frango, aveia, banana e batata doce',
    },
  },
  {
    label: 'Mariana (Definição 4x)',
    data: {
      name: 'Mariana Costa',
      age: 28,
      gender: 'feminino',
      height: 165,
      weight: 62,
      goal: 'definicao',
      frequency: 4,
      duration: 50,
      restrictions: 'Sem lactose',
      allergies: 'Nenhuma',
      preferences: 'Omelete, peixes grelhados, abacate, frutas vermelhas e tapioca',
    },
  },
  {
    label: 'Carlos (Emagrecimento 3x)',
    data: {
      name: 'Carlos Eduardo',
      age: 34,
      gender: 'masculino',
      height: 175,
      weight: 94,
      goal: 'emagrecimento',
      frequency: 3,
      duration: 60,
      restrictions: 'Nenhuma',
      allergies: 'Amendoim e nozes',
      preferences: 'Patinho moído, frango, feijão, arroz integral e legumes assados',
    },
  },
  {
    label: 'Beatriz (Veg / Hipertrofia)',
    data: {
      name: 'Beatriz Lima',
      age: 26,
      gender: 'feminino',
      height: 168,
      weight: 59,
      goal: 'hipertrofia',
      frequency: 5,
      duration: 60,
      restrictions: 'Vegetariana (consome ovos e laticínios)',
      allergies: 'Frutos do mar',
      preferences: 'Ovos, tofu marinado, iogurte grego, chia e abóbora cabotiá',
    },
  },
];

export const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<UserInput>(
    initialData || {
      name: 'Lucas Silva',
      age: 25,
      gender: 'masculino',
      height: 178,
      weight: 78,
      goal: 'hipertrofia',
      frequency: 5,
      duration: 60,
      restrictions: '',
      allergies: '',
      preferences: 'Ovos, frango, aveia e banana',
    }
  );

  const applyPreset = (preset: UserInput) => {
    setFormData({ ...preset });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <section id="coleta" className="w-full">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        {/* Header & Quick Presets */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Etapa 01 · Coleta de Dados do Usuário</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Anamnese do Atleta de Academia
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Informe os parâmetros biométricos e de treino para o cálculo exato do metabolismo e personalização nutricional.
            </p>
          </div>

          {/* Quick Presets for 1-click test */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Carregar perfil teste:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.data)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white border border-slate-700/60 rounded-md transition-colors whitespace-nowrap"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Grid 1: Identificação Básica */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Dados Pessoais & Biometria</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nome do Aluno / Atleta <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Lucas Silva"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Idade (anos) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={14}
                  max={99}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tabular-nums transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Sexo Biológico <span className="text-emerald-400">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Altura (cm) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={120}
                  max={230}
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tabular-nums transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Grid 2: Peso, Objetivo & Treino */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Objetivo & Rotina de Academia</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Peso Atual (kg) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min={35}
                  max={250}
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tabular-nums transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Objetivo Principal <span className="text-emerald-400">*</span>
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value as Goal })}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  <option value="hipertrofia">Hipertrofia (Ganho de Massa Muscular)</option>
                  <option value="emagrecimento">Emagrecimento (Queima de Gordura)</option>
                  <option value="definicao">Definição (Preservar Músculo & Secar)</option>
                  <option value="manutencao">Manutenção (Recomposição Corporal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Frequência de Treino <span className="text-emerald-400">*</span>
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  <option value={1}>1 vez por semana</option>
                  <option value={2}>2 vezes por semana</option>
                  <option value={3}>3 vezes por semana (ABC)</option>
                  <option value={4}>4 vezes por semana (Upper / Lower)</option>
                  <option value={5}>5 vezes por semana (PPL + UL)</option>
                  <option value={6}>6 vezes por semana (PPL 2x)</option>
                  <option value={7}>7 vezes por semana (Atleta Diário)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Duração Média do Treino <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={20}
                    max={180}
                    step={5}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tabular-nums transition-colors pr-12"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid 3: Restrições, Alergias e Preferências */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Restrições, Alergias & Preferências Alimentares</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Restrições Alimentares
                </label>
                <input
                  type="text"
                  value={formData.restrictions}
                  onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                  placeholder="Ex: Vegetariano, Sem Lactose, Sem Glúten, Low Carb..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Deixe vazio se não possuir.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Possui Alergias? (quais?)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="Ex: Amendoim, Frutos do mar, Soja, Nozes..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">O motor excluirá 100% destes alimentos.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Preferências Alimentares
                </label>
                <input
                  type="text"
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  placeholder="Ex: Ovos, frango, aveia, café, batata doce..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Alimentos que você adora consumir no dia a dia.</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Motor Inteligente pronto · Fórmulas de Mifflin-St Jeor + IA Esportiva</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.99] rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Calculando Metas & Gerando Cardápio...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Calcular Metas & Gerar Plano Fit Completo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
