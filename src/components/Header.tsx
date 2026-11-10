import React from 'react';
import { Dumbbell, PlusCircle, Share2, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewStudent: () => void;
  onOpenExport: () => void;
  hasPlan: boolean;
  engineSource?: 'gemini-3.8-flash' | 'local-deterministic';
}

export const Header: React.FC<HeaderProps> = ({
  onNewStudent,
  onOpenExport,
  hasPlan,
  engineSource,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            NutriFit <span className="text-emerald-400">Pro</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#coleta"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Coleta de Dados
          </a>
          <a
            href="#biometria"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Cálculo & IMC
          </a>
          <a
            href="#cardapio"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Cardápio Fit
          </a>
          <a
            href="#rotina"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Rotina Semanal
          </a>
          <a
            href="#assistente"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Assistente IA
          </a>
        </nav>

        {/* Zone 3: Primary Action & Export */}
        <div className="flex items-center gap-3 shrink-0">
          {hasPlan && (
            <button
              onClick={onOpenExport}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Exportar para WhatsApp ou Imprimir"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar</span>
            </button>
          )}

          <button
            onClick={onNewStudent}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Aluno</span>
          </button>
        </div>
      </div>
    </header>
  );
};
