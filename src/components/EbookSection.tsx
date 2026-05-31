import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import DecolarLogo from './DecolarLogo';

export default function EbookSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }
    if (formData.phone.length < 14) {
      setErrorMsg('Por favor, informe um número de WhatsApp comercial válido.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Por favor, informe seu e-mail profissional.');
      return;
    }

    setLoading(true);

    // Construct lead tracking payload for Ebook
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      revenue: 'Não informado (Ebook)',
      material: 'Não informado (Ebook)',
      region: 'Não informado (Ebook)',
      source: 'Interesse Compra Ebook'
    };

    try {
      // Send data to full-stack backend server for email alert + Google Sheets webhook
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error submitting ebook lead to server API:', error);
    } finally {
      setLoading(false);
      setDownloaded(true);

      // CONFIGURATION: Substitute with your payment platform checkout URL (Kiwify, Hotmart, Eduzz, Stripe, etc.)
      const platformCheckoutURL = 'https://pay.kiwify.com.br/k4Dj6tp'; 

      // Redirect user to payment platform in a new tab
      window.open(platformCheckoutURL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="baixe-material" className="bg-brand-offwhite py-[56px] md:py-[88px] text-brand-blue relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Core Presentation Headers Centered in the middle */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.2] tracking-[-0.02em]">
            O guia que empresas de esquadria estão usando para dominar as vendas pela internet
          </h2>
          <p className="font-sans text-brand-blue/70 text-base leading-relaxed font-light">
            Nós escrevemos este material com um único propósito: ensinar os donos de fábricas e empresas de esquadrias a saírem do completo passivo comercial e criarem um fluxo previsível de captação de obras de alto padrão pelo digital.
          </p>
        </div>

        {/* CSS Centered 3D Book Presentation Container */}
        <div className="flex justify-center mb-14">
          <motion.div 
            whileInView={{ rotateY: -10, rotateX: 4, opacity: 1 }}
            initial={{ rotateY: 0, rotateX: 0, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ perspective: 1200 }}
            className="relative w-full max-w-[440px] rounded-[6px] shadow-[16px_20px_60px_rgba(0,0,0,0.6)] select-none group"
          >
            {/* Book Body Container */}
            <div 
              className="relative w-full flex flex-col overflow-hidden rounded-[6px] border border-white/5"
              style={{
                background: 'linear-gradient(160deg, #0a2540 0%, #0e3460 60%, #0a5c8c 100%)',
                boxShadow: '-4px 0 0 #0a1e30, -8px 0 0 #071528, 16px 20px 60px rgba(0,0,0,0.7)',
                minHeight: '580px'
              }}
            >
              {/* Spine edge */}
              <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-b from-[#f59e0b] to-[#d97706] z-10" />

              {/* Top bar */}
              <div className="bg-white/[0.06] border-b border-white/10 py-3.5 pr-6 pl-9 flex items-center justify-between gap-2.5">
                <div className="bg-[#f59e0b] text-[#0a2540] text-[10px] md:text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-[3px] font-sans">
                  Livro Digital Premium
                </div>
                <DecolarLogo size="sm" className="h-12 w-auto" />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 py-7 pr-8 pl-10 flex flex-col text-left">
                <div className="text-[11px] md:text-[12px] tracking-[0.14em] uppercase text-[#f59e0b] font-semibold mb-3 font-sans">
                  Captação de Clientes Online
                </div>

                <div className="font-oswald text-[36px] md:text-[46px] leading-[1.0] text-white font-bold uppercase mb-1">
                  Tenha <span className="text-[#f59e0b] block mt-1">Orçamentos</span> Todo Dia
                </div>
                
                <div className="font-oswald text-[18px] md:text-[22px] text-white/55 font-bold uppercase tracking-wider mb-1.5">
                  na Internet
                </div>

                <p className="text-[13px] md:text-[14px] text-white/65 leading-relaxed mt-2 max-w-[340px] italic font-source font-light">
                  O sistema que fábricas e instaladores de esquadrias usam para atrair clientes sem depender de indicação.
                </p>

                <div className="w-12 h-[3px] bg-[#f59e0b] rounded-[2px] my-5" />

                {/* Highlight Tag */}
                <div className="inline-flex items-center gap-2.5 bg-[#f59e0b]/15 border border-[#f59e0b]/45 rounded-sm px-3.5 py-2 mb-4 w-fit">
                  <div className="w-2 h-2 bg-[#f59e0b] rounded-full shrink-0 animate-pulse" />
                  <span className="font-oswald text-xs md:text-[14px] text-[#f59e0b] font-bold tracking-wider uppercase">
                    Anúncios que Convertem
                  </span>
                </div>

                {/* Promises List */}
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex items-start gap-3">
                    <div className="w-[18px] h-[18px] bg-[#f59e0b] rounded-full shrink-0 flex items-center justify-center mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 10 10" className="stroke-[#0a2540] stroke-[2.5] stroke-linecap-round stroke-linejoin-round fill-none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-[14px] text-white/85 leading-[1.4] font-source">
                      Como aparecer no Google quando o cliente precisa de esquadria
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-[18px] h-[18px] bg-[#f59e0b] rounded-full shrink-0 flex items-center justify-center mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 10 10" className="stroke-[#0a2540] stroke-[2.5] stroke-linecap-round stroke-linejoin-round fill-none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-[14px] text-white/85 leading-[1.4] font-source">
                      O que postar no Instagram para gerar pedidos de orçamento
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-[18px] h-[18px] bg-[#f59e0b] rounded-full shrink-0 flex items-center justify-center mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 10 10" className="stroke-[#0a2540] stroke-[2.5] stroke-linecap-round stroke-linejoin-round fill-none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5"/>
                      </svg>
                    </div>
                    <span className="text-xs md:text-[14px] text-white/85 leading-[1.4] font-source">
                      Anúncios que convertem: como converter visitas em clientes prontos para comprar
                    </span>
                  </div>
                </div>
              </div>

              {/* Windows and Graph Illustration Section */}
              <div className="relative h-[130px] overflow-hidden bg-black/15">
                {/* Windows Frame Backdrop */}
                <div className="flex items-end justify-center h-full gap-2.5 px-6 pb-2">
                  <div className="bg-white/5 border border-white/20 border-b-0 rounded-t-[4px] relative flex items-center justify-center" style={{ width: '48px', height: '72px' }}>
                    <div className="absolute w-full h-[1.5px] bg-white/10 top-1/2 -translate-y-1/2" />
                    <div className="absolute h-full w-[1.5px] bg-white/10 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="bg-white/5 border border-white/20 border-b-0 rounded-t-[4px] relative flex items-center justify-center" style={{ width: '76px', height: '100px' }}>
                    <div className="absolute w-full h-[1.5px] bg-white/10 top-[40%] -translate-y-1/2" />
                    <div className="absolute h-full w-[1.5px] bg-white/10 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="bg-white/5 border border-white/10 border-b-0 rounded-t-[4px] relative flex items-center justify-center" style={{ width: '56px', height: '84px' }}>
                    <div className="absolute w-full h-[1.5px] bg-white/10 top-[45%] -translate-y-1/2" />
                    <div className="absolute h-full w-[1.5px] bg-white/10 left-1/2 -translate-x-1/2" />
                  </div>
                </div>

                {/* Arrow indicator line and head overlay */}
                <div className="absolute bottom-[16px] left-[24px] right-[24px] h-[2px] bg-[#f59e0b]/40" />
                <div className="absolute right-[18px] bottom-[10px] w-0 h-0 border-l-[9px] border-l-[#f59e0b]/80 border-t-[5px] border-t-transparent border-bottom-[5px] border-b-transparent" />

                {/* Graph bars overlaying up nicely */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[6px] px-6 h-[60px] pointer-events-none">
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/35" style={{ height: '16px' }} />
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/45" style={{ height: '24px' }} />
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/40" style={{ height: '18px' }} />
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/50" style={{ height: '32px' }} />
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/50" style={{ height: '28px' }} />
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/60" style={{ height: '42px' }} />
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/55" style={{ height: '38px' }} />
                  <div className="rounded-t-[3px] w-4.5 bg-[#f59e0b]/95" style={{ height: '56px' }} />
                </div>
              </div>

              {/* Bottom tag bar */}
              <div className="bg-black/30 border-t border-white/10 py-3 pr-6 pl-10 flex items-center justify-between">
                <div className="text-[11px] md:text-[12px] text-white/50 uppercase tracking-wider font-source font-medium">
                  Guia de Vendas Online
                </div>
                <div className="flex items-center gap-2 bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#f59e0b] text-[10px] md:text-[11px] font-semibold px-2.5 py-1.5 rounded-[3px] tracking-wider font-sans">
                  <DecolarLogo size="sm" className="h-10 w-auto" />
                  <span>Decolar Assessoria</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Centered Registration Card Block */}
        <div className="max-w-xl mx-auto">
          {!downloaded ? (
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 border border-brand-gold/20 rounded-sm shadow-xl space-y-6 text-center">
              
              {/* Personal Info Group */}
              <div className="space-y-4">
                <div className="space-y-1.5 text-center">
                  <label htmlFor="ebook-input-name" className="block text-center text-xs uppercase tracking-wider text-[#C9A96E] font-mono font-bold">
                    Seu Nome Completo
                  </label>
                  <input
                    id="ebook-input-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Carlos Souza"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrorMsg('');
                    }}
                    className="w-full text-center p-3 bg-brand-offwhite border border-brand-gold/15 rounded-sm focus:outline-none focus:border-brand-gold text-brand-blue font-sans text-sm focus:ring-1 focus:ring-brand-gold/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-center">
                    <label htmlFor="ebook-input-phone" className="block text-center text-xs uppercase tracking-wider text-[#C9A96E] font-mono font-bold">
                      WhatsApp Comercial
                    </label>
                    <input
                      id="ebook-input-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full text-center p-3 bg-brand-offwhite border border-brand-gold/15 rounded-sm focus:outline-none focus:border-brand-gold text-brand-blue font-sans text-sm focus:ring-1 focus:ring-brand-gold/30"
                    />
                  </div>

                  <div className="space-y-1.5 text-center">
                    <label htmlFor="ebook-input-email" className="block text-center text-xs uppercase tracking-wider text-[#C9A96E] font-mono font-bold">
                      E-mail Profissional
                    </label>
                    <input
                      id="ebook-input-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="seuemail@empresa.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrorMsg('');
                      }}
                      className="w-full text-center p-3 bg-brand-offwhite border border-brand-gold/15 rounded-sm focus:outline-none focus:border-brand-gold text-brand-blue font-sans text-sm focus:ring-1 focus:ring-brand-gold/30"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Errors Block */}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="bg-red-50 text-red-700 text-xs p-3 rounded-sm border border-red-200 font-medium"
                >
                  ⚠️ {errorMsg}
                </motion.div>
              )}

              {/* Interactive Form Action Submit Button */}
              <button
                id="submit-ebook-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold hover:bg-[#b8975f] text-brand-blue font-bold py-4 rounded-sm transition-luxury flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4.5 w-4.5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecionando para Plataforma...
                  </span>
                ) : (
                  <>
                    Garantir Meu Livro Digital →
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 justify-center text-center pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span className="text-[10px] font-mono text-brand-blue/50 uppercase tracking-widest leading-none">
                  Seus dados estão 100% seguros com a LGPD.
                </span>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 border border-brand-gold/20 rounded-sm shadow-xl text-center space-y-5"
            >
              <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-brand-blue">
                Registro efetuado com sucesso!
              </h4>
              <p className="text-sm text-brand-blue/70 leading-relaxed font-sans font-light">
                Seus dados foram de prontidão salvos. Agora, estamos abrindo a plataforma de checkout seguro para você concluir sua compra e baixar o livro completo.
              </p>
              <a
                id="download-whatsapp-fallback-btn"
                href="https://pay.kiwify.com.br/k4Dj6tp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 bg-brand-gold hover:bg-[#b8975f] text-brand-blue font-bold py-3.5 rounded-sm transition-luxury shadow-sm uppercase tracking-wider text-xs"
              >
                <BookOpen className="w-4 h-4" />
                Ir para o Checkout de Pagamento
              </a>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
