import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, PhoneCall, Clock, CheckCircle2, AlertCircle, ArrowLeft, Send, MapPin, Building2, MessageSquare } from 'lucide-react';
import DecolarLogo from './DecolarLogo';

interface FaleConoscoProps {
  onBackToHome: () => void;
}

export default function FaleConosco({ onBackToHome }: FaleConoscoProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    segment: 'Fábrica de Alumínio',
    revenue: 'Até R$ 50 mil / mês',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setError('Por favor, preencha os campos obrigatórios (Nome, E-mail e WhatsApp).');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      revenue: formData.revenue,
      material: formData.segment,
      region: 'Formulário Fale Conosco',
      marketing: 'Sim (Informado via Fale Conosco)',
      employees: 'Não informado',
      source: `Subpágina Fale Conosco - Mensagem: ${formData.message || 'Nenhuma'}`
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccess(true);
        // Clear form
        setFormData({
          name: '',
          phone: '',
          email: '',
          segment: 'Fábrica de Alumínio',
          revenue: 'Até R$ 50 mil / mês',
          message: ''
        });
      } else {
        throw new Error('Falha ao enviar os dados. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente enviar novamente ou fale conosco diretamente pelo WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="faleconosco-page" className="min-h-screen bg-brand-blue text-white flex flex-col pt-4 pb-16">
      
      {/* Decorative Diagonal Background Cover */}
      <div className="absolute top-20 right-0 h-96 w-full pointer-events-none overflow-hidden select-none opacity-5 bg-editorial-diagonal" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        
        {/* Back Button and Breadcrumbs */}
        <div className="flex items-center gap-3 mb-8">
          <button
            id="back-to-home-btn"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-white/50 hover:text-brand-gold transition-luxury cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início
          </button>
          <span className="text-white/20">/</span>
          <span className="text-brand-gold text-sm font-light">Fale Conosco</span>
        </div>

        {/* Title Block */}
        <div className="max-w-3xl mb-12">
          <div className="inline-block border border-brand-gold/40 px-3 py-1 bg-white/5 rounded-sm mb-4">
            <span className="font-mono uppercase text-[10px] tracking-[0.1em] text-brand-gold block font-bold">
              Canais de Atendimento Direto
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-semibold leading-tight tracking-tight">
            Como podemos <span className="text-brand-gold relative inline-block">ajudar<span className="absolute bottom-[2px] left-0 w-full h-[3px] bg-brand-gold/30 rounded-full" /></span> sua empresa?
          </h1>
          <p className="font-sans text-base sm:text-lg text-white/75 mt-4 leading-relaxed font-light">
            Tem dúvidas sobre nossos planos, assessoria em marketing digital, estruturação de CRM ou deseja um diagnóstico de vendas gratuito? Deixe seu contato ou fale com nossa equipe.
          </p>
        </div>

        {/* Two-Column Grid Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct channels list */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick action card: Active Support WhatsApp */}
            <div className="p-6 bg-brand-blue-dark border border-brand-gold/15 rounded-sm hover:border-brand-gold/30 transition-luxury relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 text-brand-gold/[0.03] pointer-events-none select-none">
                <PhoneCall className="w-32 h-32" />
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-sm shrink-0">
                  <PhoneCall className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono tracking-wider text-brand-gold uppercase font-bold block">Fale Conosco Agora</span>
                  <h3 className="text-lg font-serif font-semibold text-white">Central de WhatsApp</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    Fale diretamente com os nossos assessores em poucos cliques para tirar dúvidas e agendar avaliações.
                  </p>
                  <div className="pt-3">
                    <a
                      id="faleconosco-whatsapp"
                      href="https://wa.me/5573991160287?text=Olá! Gostaria de falar com um especialista sobre diagnóstico para minha empresa de esquadrias."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-luxury font-sans"
                    >
                      Iniciar Conversa WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action card: E-mail Channel */}
            <div className="p-6 bg-brand-blue-dark border border-brand-gold/15 rounded-sm hover:border-brand-gold/30 transition-luxury relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 text-brand-gold/[0.03] pointer-events-none select-none">
                <Mail className="w-32 h-32" />
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-sm shrink-0">
                  <Mail className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono tracking-wider text-brand-gold uppercase font-bold block">Envie um E-mail</span>
                  <h3 className="text-lg font-serif font-semibold text-white">E-mail Corporativo</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    Ideal para parcerias mais complexas, contatos corporativos e envio de portfólios.
                  </p>
                  <p className="pt-3 font-mono text-sm text-brand-gold select-all font-semibold">
                    comercial@decolarassessoria.com.br
                  </p>
                </div>
              </div>
            </div>

            {/* Coverage details card */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
              <div className="flex items-center gap-2 text-brand-gold">
                <MapPin className="w-5 h-5 shrink-0" />
                <span className="font-mono text-xs uppercase tracking-wider font-bold">Atendimento Nacional</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                A <strong>Decolar Assessoria</strong> é uma operação totalmente digital presente em mais de 18 estados do Brasil. Nossos assessores atuam de forma 100% conectada garantindo agilidade no setup comercial da sua empresa, de onde você estiver.
              </p>
              <div className="h-[1px] bg-white/10" />
              <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Segunda a Sexta das 9:00h às 18:00h</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 bg-brand-blue-dark border border-brand-gold/15 rounded-sm relative">
              
              <div className="mb-6">
                <h2 className="text-xl font-serif text-white font-semibold">Mensagem Rápida</h2>
                <p className="text-xs text-white/50 mt-1">Preencha o formulário abaixo que retornaremos em menos de 1 hora comercial.</p>
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-brand-gold/10 border border-brand-gold/30 rounded-sm text-center py-12 space-y-4"
                >
                  <div className="w-14 h-14 bg-brand-gold/20 flex items-center justify-center rounded-full mx-auto border border-brand-gold/40">
                    <CheckCircle2 className="w-8 h-8 text-brand-gold" />
                  </div>
                  <h3 className="text-2xl font-serif text-white font-semibold">Solicitação recebida!</h3>
                  <p className="text-sm text-white/80 max-w-sm mx-auto leading-relaxed">
                    Muito obrigado pelo seu interesse. Nossa equipe comercial já foi alertada em tempo real e entrará em contato em menos de 1 hora via WhatsApp.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={onBackToHome}
                      className="px-6 py-2.5 bg-brand-gold text-brand-blue font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#b8975f] transition-luxury"
                    >
                      Voltar para Home
                    </button>
                    <a
                      href="https://wa.me/5573991160287?text=Olá, acabei de preencher o formulário no site e gostaria de agilizar o atendimento."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 border border-brand-gold text-brand-gold hover:bg-brand-gold/5 font-bold text-xs uppercase tracking-wider rounded-sm transition-luxury inline-block"
                    >
                      Chamar WhatsApp comercial
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-100 text-xs rounded-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-mono tracking-wider text-white/50 uppercase block font-semibold">
                      Nome da Empresa ou Responsável *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cazuza Alumínios / Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/30 focus:border-brand-gold focus:outline-none p-3.5 text-sm text-white font-sans rounded-none transition-all placeholder:text-white/20"
                    />
                  </div>

                  {/* WhatsApp and Email Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-mono tracking-wider text-white/50 uppercase block font-semibold">
                        WhatsApp (com DDD) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: (11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/30 focus:border-brand-gold focus:outline-none p-3.5 text-sm text-white font-sans rounded-none transition-all placeholder:text-white/20"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-mono tracking-wider text-white/50 uppercase block font-semibold">
                        E-mail de Trabalho *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: contato@suaempresa.com.br"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/30 focus:border-brand-gold focus:outline-none p-3.5 text-sm text-white font-sans rounded-none transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Segment Select and Revenue Select Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-mono tracking-wider text-white/50 uppercase block font-semibold">
                        Segmento de Atuação
                      </label>
                      <select
                        value={formData.segment}
                        onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        className="w-full bg-[#1E2E42] border border-white/10 hover:border-brand-gold/30 focus:border-brand-gold focus:outline-none p-3.5 text-sm text-white font-sans rounded-none transition-all"
                      >
                        <option value="Fábrica de Alumínio">Fábrica de Alumínio</option>
                        <option value="Fábrica de PVC">Fábrica de PVC</option>
                        <option value="Serralharia Tradicional">Serralharia Tradicional</option>
                        <option value="Revendedor e Instalador">Revendedor e Instalador</option>
                        <option value="Construtora / Engenharia">Construtora / Engenharia</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-mono tracking-wider text-white/50 uppercase block font-semibold">
                        Faturamento Estimado
                      </label>
                      <select
                        value={formData.revenue}
                        onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                        className="w-full bg-[#1E2E42] border border-white/10 hover:border-brand-gold/30 focus:border-brand-gold focus:outline-none p-3.5 text-sm text-white font-sans rounded-none transition-all"
                      >
                        <option value="Até R$ 50 mil / mês">Até R$ 50 mil / mês</option>
                        <option value="R$ 50 mil a R$ 100 mil / mês">R$ 50 mil a R$ 100 mil / mês</option>
                        <option value="R$ 100 mil a R$ 300 mil / mês">R$ 100 mil a R$ 300 mil / mês</option>
                        <option value="R$ 300 mil a R$ 500 mil / mês">R$ 300 mil a R$ 500 mil / mês</option>
                        <option value="Acima de R$ 500 mil / mês">Acima de R$ 500 mil / mês</option>
                      </select>
                    </div>
                  </div>

                  {/* Message/Goal field */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-mono tracking-wider text-white/50 uppercase block font-semibold">
                      Como podemos ajudar? (Mensagem)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Gostaria de alinhar meu marketing e automatizar meu comercial. Tenho interesse em começar..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/30 focus:border-brand-gold focus:outline-none p-3.5 text-sm text-white font-sans rounded-none transition-all placeholder:text-white/20 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      id="faleconosco-submit shadow-sm"
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-brand-gold hover:bg-[#b8975f] text-brand-blue disabled:opacity-55 py-4 px-6 text-sm font-bold uppercase tracking-wider rounded-sm transition-luxury flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>Enviando dados comerciais...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar Mensagem à Decolar
                        </>
                      )}
                    </button>
                    <div className="text-center mt-3">
                      <span className="font-mono text-[10px] text-white/30 tracking-[0.05em]">
                        ✓ Seus dados são criptografados e enviados à planilha do drive comercial.
                      </span>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
