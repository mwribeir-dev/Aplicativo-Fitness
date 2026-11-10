import React, { useState } from 'react';
import { UserInput, NutritionCalculations } from '../types/nutrition';
import { askNutritionAssistant } from '../services/api';
import { MessageSquare, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

interface NutritionChatProps {
  user: UserInput;
  calculations: NutritionCalculations;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const NutritionChat: React.FC<NutritionChatProps> = ({ user, calculations }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Olá, ${user.name}! Sou o assistente de nutrição esportiva do NutriFit Pro. Posso tirar dúvidas sobre substituição de alimentos, suplementação (creatina, whey), timing de refeições ao redor do seu treino de ${user.duration}min ou como adaptar o cardápio no fim de semana. Como posso te ajudar hoje?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    'Posso trocar a tilápia do jantar por patinho moído?',
    'Qual o melhor momento para tomar creatina?',
    'O que comer se meu treino for às 6h da manhã?',
    'Como manter as calorias no fim de semana?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const reply = await askNutritionAssistant(text, user, calculations);
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Tive uma oscilação na conexão, mas a regra de ouro é: mantenha sua ingestão proteica constante e priorize hidratação!',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="assistente" className="w-full">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>Dúvidas & Ajustes Nutricionais</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Assistente Nutricional Inteligente
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            Respostas orientadas ao objetivo de <strong className="text-white capitalize">{user.goal}</strong>
          </div>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="text-xs text-slate-300 bg-slate-950/70 hover:bg-slate-800/80 hover:text-emerald-400 border border-slate-800 rounded-lg px-3 py-1.5 transition-colors text-left flex items-center gap-1.5 disabled:opacity-50"
            >
              <HelpCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        <div className="mt-4 h-64 overflow-y-auto space-y-3 p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] text-xs sm:text-sm p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 w-fit px-3 py-2 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>O motor nutricional está analisando sua dúvida...</span>
            </div>
          )}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-3 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite uma dúvida sobre seu treino, refeições ou suplementação..."
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Enviar</span>
          </button>
        </form>
      </div>
    </section>
  );
};
