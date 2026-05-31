import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Target, ArrowRight } from 'lucide-react';

interface MarketCalculatorProps {
  onOpenModal: (source: string) => void;
}

export default function MarketCalculator({ onOpenModal }: MarketCalculatorProps) {
  const [citySize, setCitySize] = useState<string>('medio');
  const [targetRev, setTargetRev] = useState<number>(150000); // Standard R$ 150.000 current or target

  // Dynamic calculations based on industry averages (medium/high end profiles and templates)
  const getCalculations = () => {
    let multiplier = 1;
    if (citySize === 'pequeno') multiplier = 0.65;
    if (citySize === 'medio') multiplier = 1;
    if (citySize === 'grande') multiplier = 1.45;
    if (citySize === 'metropolitana') multiplier = 2.1;

    const estimatedLocalDemand = Math.round(targetRev * 8.4 * multiplier);
    const potentialMonthlyLeads = Math.round(15 + (targetRev / 18000) * multiplier);
    const estimatedRecoverableAnnual = Math.round(targetRev * 0.28 * 12 * multiplier);

    return {
      estimatedLocalDemand,
      potentialMonthlyLeads,
      estimatedRecoverableAnnual,
    };
  };

  const calcs = getCalculations();

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full bg-brand-blue-dark/40 border border-brand-gold/15 rounded-sm p-6 md:p-8 mt-12 transition-luxury">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Sliders and Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase block mb-1">
              Simulação de Demanda Regional
            </span>
            <h4 className="font-serif text-xl md:text-2xl text-white mb-2">
              Orçamentos Todos os Dias
            </h4>
            <p className="text-sm text-white/60">
              Ajuste as características do seu mercado para mensurar o volume de oportunidades qualificadas invisíveis na sua região.
            </p>
          </div>

          {/* City Size Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-brand-gold/80 block">
              Tamanho do Mercado de Atuação
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'pequeno', label: 'Até 150k hab (Pequeno)' },
                { id: 'medio', label: '150k a 500k hab (Médio)' },
                { id: 'grande', label: '500k a 1M hab (Grande)' },
                { id: 'metropolitana', label: '1M+ ou Capital' },
              ].map((item) => (
                <button
                  id={`city-size-${item.id}`}
                  key={item.id}
                  onClick={() => setCitySize(item.id)}
                  className={`p-2.5 text-xs text-left rounded-sm border transition-luxury ${
                    citySize === item.id
                      ? 'bg-brand-gold text-brand-blue border-brand-gold font-medium'
                      : 'bg-brand-blue-dark/60 text-white/70 border-white/10 hover:border-brand-gold/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Target Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-mono uppercase">
              <span className="text-brand-gold/80">Meta de Faturamento Comercial</span>
              <span className="text-white font-medium">{formatBRL(targetRev)} /mês</span>
            </div>
            <input
              id="revenue-target-slider"
              type="range"
              min="50000"
              max="1000000"
              step="25000"
              value={targetRev}
              onChange={(e) => setTargetRev(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-white/40">
              <span>R$ 50k</span>
              <span>R$ 500k</span>
              <span>R$ 1 Milhão+</span>
            </div>
          </div>
        </div>

        {/* Dynamic Calculations Display */}
        <div className="lg:col-span-7 bg-brand-blue border border-brand-gold/10 rounded-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden self-stretch justify-center content-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />

          {/* Demand Indicator */}
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
            <div className="w-8 h-8 rounded-sm bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase text-white/50 block">
              Demanda de Obras Estimada
            </span>
            <div className="font-serif text-lg md:text-xl text-brand-gold font-semibold">
              {formatBRL(calcs.estimatedLocalDemand)}
            </div>
            <span className="text-[10px] text-white/40 block">
              Prontas para compra no seu raio de frete
            </span>
          </div>

          {/* Monthly Leads Indicator */}
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
            <div className="w-8 h-8 rounded-sm bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase text-white/50 block">
              Média de Leads / Mês
            </span>
            <div className="font-serif text-xl md:text-2xl text-white font-semibold">
              +{calcs.potentialMonthlyLeads} contatos
            </div>
            <span className="text-[10px] text-white/40 block">
              Interessados altamente qualificados (quentes)
            </span>
          </div>

          {/* Lost Revenue Indicator */}
          <div className="space-y-2 pb-2 md:pb-0">
            <div className="w-8 h-8 rounded-sm bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-1">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase text-white/50 block">
              Faturamento Recuperável
            </span>
            <div className="font-serif text-lg md:text-xl text-brand-gold font-semibold">
              + {formatBRL(calcs.estimatedRecoverableAnnual)} /ano
            </div>
            <span className="text-[10px] text-white/40 block">
              Com apenas 8% de taxa de conversão sistêmica
            </span>
          </div>
        </div>

      </div>

      {/* Action Prompt */}
      <div className="mt-6 pt-4 border-t border-brand-gold/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-white/60 font-sans">
          💡 <strong>Como convertemos esses leads?</strong> Desenvolvemos funis segmentados para arquitetos, engenheiros e proprietários de obras residenciais de alto padrão na sua região.
        </p>
        <button
          id="calc-cta-btn"
          onClick={() => onOpenModal('Calculadora de Demanda')}
          className="text-xs text-brand-gold font-mono uppercase tracking-wider flex items-center gap-2 hover:text-white transition-luxury"
        >
          Capturar essas obras agora
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
