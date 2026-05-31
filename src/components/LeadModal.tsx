import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { LeadFormData } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ctaSource: string;
}

export default function LeadModal({ isOpen, onClose, ctaSource }: LeadModalProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    revenue: '',
    material: 'Não aplicável',
    region: '',
    marketing: 'Sim, já investimos com agência/gestor',
    employees: 'Apenas eu / Autônomo'
  });

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Auto-format phone input (Brazilian WhatsApp)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setFormData({ ...formData, phone: value });
  };

  const handleNextStep = () => {
    if (step === 1 && !formData.name.trim()) return;
    if (step === 2 && formData.phone.length < 14) return;
    if (step === 3 && !formData.region.trim()) return;
    
    if (step < 6) {
      setStep(step + 1);
    } else {
      triggerSubmit();
    }
  };

  const triggerSubmit = async () => {
    setSubmitting(true);
    
    // Construct lead tracking payload
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: 'Não informado (modal)',
      revenue: formData.revenue || 'Não informado',
      material: formData.material,
      region: formData.region,
      marketing: formData.marketing || 'Não informado',
      employees: formData.employees || 'Não informado',
      source: `Landing Page - Botão "${ctaSource}"`
    };

    try {
      // Send data to full-stack backend server for email alert + Google Sheets webhook
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error submitting lead to server API:', error);
    } finally {
      setSubmitting(false);
      setSuccess(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="lead-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-blue-dark/80 backdrop-blur-md">
        <motion.div
          id="lead-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg overflow-hidden border border-brand-gold/30 bg-brand-blue rounded-sm shadow-2xl"
        >
          {/* Top Decorative Champagne Border Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-gold/40 via-brand-gold to-brand-gold/40" />

          {/* Close button */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-luxury"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8">
            {!success ? (
              <div>
                <span className="inline-block text-[10px] font-mono tracking-[0.15em] text-brand-gold uppercase mb-2">
                  Diagnóstico Comercial Ativo
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-6">
                  Preencha o formulário
                </h3>

                {/* Progress bar */}
                <div className="w-full bg-white/10 h-1 rounded-sm mb-6 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 bg-brand-gold h-full transition-all duration-300"
                    style={{ width: `${(step / 6) * 100}%` }}
                  />
                </div>

                {/* Step contents */}
                <div className="min-h-[140px] mb-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm text-brand-gold font-mono uppercase tracking-wider">
                        Qual é o seu nome?
                      </label>
                      <input
                        id="modal-input-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Ex: Carlos Silva"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                        className="w-full p-3.5 bg-brand-blue-dark/50 border border-white/10 text-white rounded-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-base font-sans"
                        autoFocus
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm text-brand-gold font-mono uppercase tracking-wider">
                        WhatsApp de Contato Comercial
                      </label>
                      <input
                        id="modal-input-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="Ex: (11) 99999-9999"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                        className="w-full p-3.5 bg-brand-blue-dark/50 border border-white/10 text-white rounded-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-base font-sans"
                        autoFocus
                      />
                      <span className="text-[11px] text-white/40 block">
                        🔒 Seus dados comerciais estão protegidos pela LGPD.
                      </span>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm text-brand-gold font-mono uppercase tracking-wider">
                        Em qual Cidade e Estado fica sua empresa?
                      </label>
                      <input
                        id="modal-input-region"
                        type="text"
                        placeholder="Ex: Sorocaba / SP"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                        className="w-full p-3.5 bg-brand-blue-dark/50 border border-white/10 text-white rounded-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-base font-sans"
                        autoFocus
                      />
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm text-brand-gold font-mono uppercase tracking-wider">
                        Já investem em marketing/anúncios?
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Sim, já investimos com agência/gestor',
                          'Sim, investimos por conta própria',
                          'Não, mas queremos começar imediatamente',
                          'Não, nunca investimos em anúncios'
                        ].map((option) => (
                          <button
                            id={`marketing-btn-${option}`}
                            key={option}
                            onClick={() => {
                              setFormData({ ...formData, marketing: option });
                              setTimeout(() => handleNextStep(), 200);
                            }}
                            type="button"
                            className={`p-3 text-sm rounded-sm border text-left transition-luxury ${
                              formData.marketing === option
                                ? 'bg-brand-gold text-brand-blue border-brand-gold font-medium'
                                : 'bg-brand-blue-dark/50 text-white border-white/10 hover:border-brand-gold/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm text-brand-gold font-mono uppercase tracking-wider">
                        Você tem quantos funcionários?
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Apenas eu / Autônomo',
                          'De 2 a 5 funcionários',
                          'De 6 a 15 funcionários',
                          'Mais de 15 funcionários'
                        ].map((option) => (
                          <button
                            id={`employees-btn-${option}`}
                            key={option}
                            onClick={() => {
                              setFormData({ ...formData, employees: option });
                              setTimeout(() => handleNextStep(), 200);
                            }}
                            type="button"
                            className={`p-3 text-sm rounded-sm border text-left transition-luxury ${
                              formData.employees === option
                                ? 'bg-brand-gold text-brand-blue border-brand-gold font-medium'
                                : 'bg-brand-blue-dark/50 text-white border-white/10 hover:border-brand-gold/50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 6 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm text-brand-gold font-mono uppercase tracking-wider">
                        Seu faturamento médio mensal de esquadrias
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Até R$ 50 mil / mês',
                          'De R$ 50 mil a R$ 150 mil / mês',
                          'De R$ 150 mil a R$ 500 mil / mês',
                          'Acima de R$ 500 mil / mês'
                        ].map((rev) => (
                          <button
                            id={`rev-btn-${rev}`}
                            key={rev}
                            onClick={() => setFormData({ ...formData, revenue: rev })}
                            type="button"
                            className={`p-3 text-sm rounded-sm border text-left transition-luxury ${
                              formData.revenue === rev
                                ? 'bg-brand-gold text-brand-blue border-brand-gold font-medium'
                                : 'bg-brand-blue-dark/50 text-white border-white/10 hover:border-brand-gold/50'
                            }`}
                          >
                            {rev}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    id="prev-btn"
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                    className="text-xs text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-luxury"
                  >
                    Voltar
                  </button>

                  <button
                    id="next-btn"
                    onClick={handleNextStep}
                    className="bg-brand-gold hover:bg-[#b8975f] text-brand-blue px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-luxury cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Qualificando...
                      </span>
                    ) : (
                      <>
                        {step === 6 ? 'Enviar Respostas' : 'Avançar'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-2xl text-white mb-2">
                  Tudo pronto! Obrigado por preencher o formulário.
                </h4>
                <p className="text-sm text-white/60 max-w-sm mx-auto mb-6">
                  Com base nas suas respostas, vamos te direcionar agora para um especialista. Ele já está analisando o seu perfil para te dar o melhor atendimento.
                </p>
                <button
                  id="final-conclude-btn"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 w-full max-w-xs bg-brand-gold hover:bg-[#b8975f] text-brand-blue font-semibold py-3.5 px-6 rounded-sm transition-luxury"
                >
                  Concluir Diagnóstico
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
