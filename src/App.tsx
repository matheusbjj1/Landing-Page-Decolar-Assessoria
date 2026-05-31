import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Menu, 
  X, 
  TrendingDown, 
  AlertCircle, 
  Ban, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  PhoneCall,
  Mail,
  MapPin
} from 'lucide-react';
import LeadModal from './components/LeadModal';
import DecolarLogo from './components/DecolarLogo';
import Testimonials from './components/Testimonials';
import EbookSection from './components/EbookSection';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalSource, setModalSource] = useState<string>('Navbar CTA');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Track scroll for active section indicator & dynamic effects
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Identify active section
      const sections = ['inicio', 'problemas', 'mercado', 'solucao', 'por-que-decolar', 'baixe-material', 'depoimentos', 'cta-final'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModalWithSource = (source: string) => {
    setModalSource(source);
    setIsModalOpen(true);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Navbar height offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Content Configurations for mapping
  const problems = [
    {
      text: "O potencial cliente chega mas o comercial não fecha.",
      icon: <XCircleIcon />
    },
    {
      text: "O faturamento sobe e desce conforme a indicação aparece.",
      icon: <TrendingDown className="w-6 h-6 text-brand-gold" />
    },
    {
      text: "Você já pagou agência genérica e não viu resultado nenhum.",
      icon: <Ban className="w-6 h-6 text-brand-gold" />
    },
    {
      text: "Você não tem tempo pra aprender marketing, tem uma empresa pra operar.",
      icon: <Clock className="w-6 h-6 text-brand-gold" />
    },
    {
      text: "Quando um cliente fixo some, você sente no caixa imediatamente.",
      icon: <DollarSign className="w-6 h-6 text-brand-gold" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-gold selection:text-brand-blue-dark">
      
      {/* FIXED NAVBAR */}
      <nav className="sticky top-0 z-30 bg-brand-blue/95 backdrop-blur-md border-b border-brand-gold/10 h-20 transition-luxury">
        {/* Scroll Progress indicator indicator */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-brand-gold/60 transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo Decolar */}
          <div 
            onClick={() => scrollToSection('inicio')} 
            className="flex items-center gap-3 cursor-pointer group select-none translate-y-[3px]"
          >
            <DecolarLogo size="md" className="group-hover:scale-105 transition-luxury shrink-0" />
            <div className="flex flex-col">
              <span className="font-sans text-base sm:text-lg lg:text-xl tracking-wider text-white font-black leading-tight uppercase">
                DECOLAR ASSESSORIA
              </span>
              <span className="block text-[9px] sm:text-[10px] font-medium tracking-normal text-white/95">
                Aumente suas vendas com tecnologia e gestão
              </span>
            </div>
          </div>

          {/* Central Links (50% Opacity) */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { id: 'inicio', label: 'Início' },
              { id: 'solucao', label: 'Como Funciona' },
              { id: 'por-que-decolar', label: 'Diferenciais' },
              { id: 'depoimentos', label: 'Depoimentos' },
              { id: 'baixe-material', label: 'Baixar Material 📚' }
            ].map((link) => (
              <button
                id={`nav-link-${link.id}`}
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-luxury relative py-2 ${
                  activeSection === link.id 
                    ? 'text-brand-gold opacity-100 font-semibold' 
                    : 'text-white opacity-60 hover:opacity-100'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div 
                    layoutId="activeNavLine" 
                    className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-gold"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Button (Gold BG, Navy Text) */}
          <div className="hidden lg:block">
            <button
              id="navbar-cta-btn"
              onClick={() => openModalWithSource('Navbar CTA')}
              className="bg-brand-gold hover:bg-[#b8975f] text-brand-blue font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-sm transition-luxury flex items-center gap-1.5 cursor-pointer"
            >
              Falar com especialista
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-burger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-blue-dark border-b border-brand-gold/10 fixed top-20 left-0 w-full z-20 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {[
                { id: 'inicio', label: 'Início' },
                { id: 'solucao', label: 'Como Funciona' },
                { id: 'por-que-decolar', label: 'Diferenciais' },
                { id: 'depoimentos', label: 'Depoimentos' },
                { id: 'baixe-material', label: 'Baixar Material 📚' }
              ].map((link) => (
                <button
                  id={`mobile-nav-link-${link.id}`}
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left text-base text-white/85 py-2 border-b border-white/5 font-serif"
                >
                  {link.label}
                </button>
              ))}
              <button
                id="mobile-nav-cta"
                onClick={() => openModalWithSource('Mobile Navbar CTA')}
                className="w-full bg-brand-gold text-brand-blue py-3.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                Falar com especialista
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEÇÃO 1 — HERO */}
      <section 
        id="inicio" 
        className="relative bg-brand-blue overflow-hidden pt-4 pb-[48px] md:pt-10 md:pb-[80px]"
      >
        {/* Geometric thin lines overlay */}
        <div className="absolute top-0 right-0 h-full w-full pointer-events-none overflow-hidden select-none opacity-10 bg-editorial-diagonal" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Tag with gold border */}
            <div className="inline-block border border-brand-gold px-3 py-1.5 bg-white/5 rounded-sm">
              <span className="font-mono uppercase text-[10.5px] tracking-[0.1em] text-brand-gold block font-bold">
                MARKETING, GESTÃO DE VENDAS E TECNOLOGIA PARA ESQUADRIAS
              </span>
            </div>

            {/* Headline with 'indicação' highlighted in gold */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-semibold leading-[1.1] tracking-[-0.02em]">
              Chega de depender de <span className="text-brand-gold relative inline-block">indicação<span className="absolute bottom-[2px] left-0 w-full h-[3px] bg-brand-gold/30 rounded-full" /></span> para vender.
            </h1>

            {/* Subhead */}
            <p className="font-sans text-base sm:text-lg text-white/80 leading-[1.7] max-w-2xl font-light">
              A Decolar gera clientes qualificados para empresas de esquadrias todos os meses, com tecnologia, processo comercial e foco total no seu setor.
            </p>

            {/* Two Action Buttons side by side */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md sm:max-w-none">
              <button
                id="hero-primary-btn"
                onClick={() => openModalWithSource('Hero Primary CTA')}
                className="bg-brand-gold hover:bg-[#b8975f] text-brand-blue hover:scale-[1.01] transition-luxury font-bold text-base py-4 px-8 rounded-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Quero orçamentos todos os dias →
              </button>

              <button
                id="hero-secondary-btn"
                onClick={() => scrollToSection('solucao')}
                className="border border-brand-gold text-brand-gold hover:bg-brand-gold/5 transition-luxury font-bold text-base py-4 px-8 rounded-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Como funciona
              </button>
            </div>
          </div>

          {/* Credibility Divider */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Block 1 */}
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[0.1em] text-brand-gold uppercase font-bold">
                  ÚNICO FOCO
                </span>
                <span className="text-white text-sm md:text-base font-light">
                  Só atendemos esquadrias
                </span>
              </div>

              {/* Block 2 */}
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[0.1em] text-brand-gold uppercase font-bold">
                  CICLO COMPLETO
                </span>
                <span className="text-white text-sm md:text-base font-light">
                  Do lead ao fechamento
                </span>
              </div>

              {/* Block 3 */}
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[0.1em] text-brand-gold uppercase font-bold">
                  SEM ACHISMO
                </span>
                <span className="text-white text-sm md:text-base font-light">
                  Resultado mensurável
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO 2 — O PROBLEMA */}
      <section 
        id="problemas" 
        className="bg-brand-offwhite py-[48px] md:py-[80px]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            
            {/* Tag */}
            <span className="font-mono uppercase text-[11px] tracking-[0.1em] text-brand-gold block font-bold">
              VOCÊ SE IDENTIFICA?
            </span>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-blue font-semibold tracking-[-0.02em]">
              Todo mês é a mesma história.
            </h2>

            {/* Subhead */}
            <p className="font-sans text-brand-blue/70 text-base leading-[1.7]">
              Você trabalha duro, tem produto bom, atende bem, e ainda assim não sabe quantos clientes vão entrar no mês que vem.
            </p>
          </div>

          {/* Cards Grid: 3 in Row 1, 2 Centered in Row 2 */}
          <div className="space-y-6">
            
            {/* Row 1 (3 items on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {problems.slice(0, 3).map((problem, idx) => (
                <motion.div
                  key={idx}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-brand-gold/15 flex flex-col gap-4 text-left hover:shadow-md transition-luxury"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#C9A96E]/12 flex items-center justify-center shrink-0">
                    {problem.icon}
                  </div>
                  <p className="text-brand-blue text-base sm:text-lg font-medium leading-relaxed">
                    {problem.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Row 2 (2 items on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {problems.slice(3, 5).map((problem, idx) => (
                <motion.div
                  key={idx + 3}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-brand-gold/15 flex flex-col gap-4 text-left hover:shadow-md transition-luxury"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#C9A96E]/12 flex items-center justify-center shrink-0">
                    {problem.icon}
                  </div>
                  <p className="text-brand-blue text-base sm:text-lg font-medium leading-relaxed">
                    {problem.text}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Closing Italic phrase below cards */}
          <div className="mt-12 text-center">
            <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-brand-blue max-w-2xl mx-auto leading-relaxed">
              &ldquo;Isso não é azar. É ausência de sistema. E tem solução.&rdquo;
            </p>
          </div>

        </div>
      </section>

      {/* SEÇÃO 3 — O MERCADO */}
      <section 
        id="mercado" 
        className="bg-brand-blue py-[48px] md:py-[80px]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            
            {/* Tag */}
            <div className="inline-block bg-[#C9A96E]/12 px-3 py-1.5 rounded-full">
              <span className="font-mono uppercase text-[11px] tracking-[0.1em] text-brand-gold block font-bold">
                O MOMENTO É AGORA
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-semibold tracking-[-0.02em]">
              O mercado de esquadrias está crescendo. Sua empresa está aproveitando?
            </h2>

            {/* Subtext (55% opacity) */}
            <p className="font-sans text-white/55 text-base md:text-lg leading-[1.7]">
              O dinheiro está no setor. A demanda está garantida. A única pergunta é quem vai capturar esses clientes, você ou seu concorrente.
            </p>
          </div>

          {/* Metrics Grid 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { value: "R$ 10,5 bilhões", desc: "Faturamento do setor em 2024" },
              { value: "+19,8%", desc: "Crescimento em relação a 2023" },
              { value: "880 mil moradias", desc: "Contratadas pelo MCMV em 2025" },
              { value: "2026 e 2027", desc: "Demanda de obras já garantida" }
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.98 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="glass-editorial p-6 md:p-8 rounded-sm flex flex-col justify-center text-center hover:bg-white/[0.08] transition-luxury"
              >
                <div className="font-serif text-3xl sm:text-4xl text-brand-gold font-bold mb-2">
                  {metric.value}
                </div>
                <div className="font-sans text-sm sm:text-base text-white/60">
                  {metric.desc}
                </div>
              </motion.div>
            ))}
          </div>



          {/* Standard paragraph below metrics */}
          <div className="mt-10 max-w-3xl mx-auto text-center">
            <p className="font-sans text-sm md:text-base text-white/45 leading-[1.8]">
              As obras já foram contratadas. Os clientes vão comprar esquadria de alguém. Empresas com sistema de geração de clientes vão fechar esses pedidos. As outras vão continuar esperando o telefone tocar.
            </p>
          </div>

        </div>
      </section>

      {/* SEÇÃO 4 — A SOLUÇÃO */}
      <section 
        id="solucao" 
        className="bg-brand-offwhite py-[48px] md:py-[80px]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            
            {/* Tag */}
            <span className="font-mono uppercase text-[11px] tracking-[0.1em] text-brand-gold block font-bold">
              O QUE A DECOLAR FAZ
            </span>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-blue font-semibold tracking-[-0.02em]">
              Clientes qualificados todo mês. Sem você depender de indicação.
            </h2>

            {/* Subhead */}
            <p className="font-sans text-brand-blue/80 text-base leading-[1.7]">
              A gente resolve o que agência genérica nunca resolveu: o ciclo inteiro, do primeiro clique ao orçamento fechado. Com tecnologia e inteligência artificial trabalhando enquanto você cuida da operação.
            </p>
          </div>

          {/* 3 Step Cards in Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {[
              {
                num: "01",
                title: "Clientes certos, no momento certo",
                desc: "Atraímos donos de obra, construtoras, incorporadoras e arquitetos com projeto real, não lead curioso que nunca vai comprar."
              },
              {
                num: "02",
                title: "Nenhum lead desperdiçado",
                desc: "Usamos automação e IA para acompanhar cada contato ao longo do ciclo de compra. O lead que não fechou hoje é trabalhado até fechar."
              },
              {
                num: "03",
                title: "Seu comercial fecha mais",
                desc: "Não paramos no lead. Estruturamos o processo para que sua equipe converta mais, com menos esforço e resultado previsível."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 25 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.12 }}
                className="bg-white rounded-sm p-8 shadow-sm border border-brand-gold/15 flex flex-col relative text-left"
              >
                {/* Big Number */}
                <div className="font-serif text-4xl md:text-5xl text-[#C9A96E]/30 font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="font-sans text-lg md:text-xl text-brand-blue font-semibold mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="font-sans text-brand-blue/70 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Anchor to Section 6 / CTA */}
          <div className="text-center">
            <button
              id="solution-cta-btn"
              onClick={() => openModalWithSource('Solução Passos CTA')}
              className="bg-brand-gold hover:bg-[#b8975f] text-brand-blue font-bold text-base py-4 px-10 rounded-sm transition-luxury inline-flex items-center gap-2 cursor-pointer"
            >
              Quero isso na minha empresa →
            </button>
          </div>

        </div>
      </section>

      {/* SEÇÃO 5 — POR QUE A DECOLAR */}
      <section 
        id="por-que-decolar" 
        className="bg-brand-blue py-[48px] md:py-[80px]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            
            {/* Tag */}
            <div className="inline-block bg-[#C9A96E]/12 px-3 py-1.5 rounded-full">
              <span className="font-mono uppercase text-[11px] tracking-[0.1em] text-brand-gold block font-bold">
                POR QUE NÓS
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-semibold tracking-[-0.02em]">
              Qualquer agência faz tráfego. Nenhuma entende de esquadria como a gente.
            </h2>

            {/* Subtext */}
            <p className="font-sans text-white/55 text-base md:text-lg leading-[1.7]">
              Agência genérica vai levar meses pra entender seu ciclo de venda, sua linguagem e seu cliente. A gente já chegou sabendo, porque esquadria é tudo que a gente faz.
            </p>
          </div>

          {/* 4 Differential blocks in grid 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Especialização que nenhuma agência tem",
                desc: "Conhecemos o ciclo de 18 a 24 meses da obra ao pedido. Sabemos como falar com construtor, arquiteto e dono de imóvel. Não existe curva de aprendizado.",
                icon: <Compass className="w-6 h-6 text-brand-gold" />
              },
              {
                title: "Do lead ao fechamento, sem parar no meio",
                desc: "A maioria das agências entrega o lead e some. A gente acompanha até o orçamento ser fechado. Você não paga por clique. Você paga por resultado.",
                icon: <ShieldCheck className="w-6 h-6 text-brand-gold" />
              },
              {
                title: "Você sabe exatamente o que está comprando",
                desc: "Sem relatório de alcance. Sem slide de engajamento. Você recebe leads com nome, telefone e produto de interesse, e acompanha tudo em tempo real.",
                icon: <Eye className="w-6 h-6 text-brand-gold" />
              },
              {
                title: "Tecnologia funcionando desde o primeiro dia",
                desc: "Automação e IA aplicadas diretamente no processo comercial da sua empresa. Não é promessa, é infraestrutura rodando antes do fim da primeira semana.",
                icon: <Layers className="w-6 h-6 text-brand-gold" />
              }
            ].map((block, idx) => (
              <motion.div
                key={idx}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-editorial rounded-sm p-6 md:p-8 flex flex-col gap-4 text-left hover:bg-white/[0.08] transition-luxury"
              >
                <div className="w-10 h-10 rounded-sm bg-brand-gold/10 flex items-center justify-center shrink-0">
                  {block.icon}
                </div>
                <div>
                  <h3 className="font-sans text-white text-lg font-semibold mb-2">
                    {block.title}
                  </h3>
                  <p className="font-sans text-white/45 text-sm leading-relaxed font-light">
                    {block.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO DE MATERIAIS - EBOOK */}
      <EbookSection />

      {/* SEÇÃO DE DEPOIMENTOS - TESTIMONIALS */}
      <Testimonials />

      {/* SEÇÃO 6 — CTA FINAL */}
      <section 
        id="cta-final" 
        className="bg-brand-blue py-[56px] md:py-[100px] border-t border-brand-gold/10 text-center relative"
      >
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          
          {/* Tag */}
          <div className="inline-block bg-[#C9A96E]/12 px-3 py-1.5 rounded-full">
            <span className="font-mono uppercase text-[11px] tracking-[0.1em] text-brand-gold block font-bold">
              BORA CRESCER
            </span>
          </div>

          {/* Title - "concorrência" in gold */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-semibold leading-[1.2] tracking-[-0.02em] max-w-3xl mx-auto">
            Sua <span className="text-brand-gold relative inline-block">concorrência<span className="absolute bottom-[2px] left-0 w-full h-[3px] bg-brand-gold/30 rounded-full" /></span> já está no digital. Você vai ficar esperando a indicação chegar?
          </h2>

          {/* Subtitle - max 420px width centered */}
          <p className="font-sans text-white/55 text-sm sm:text-base max-w-[420px] mx-auto leading-relaxed font-light">
            Todo mês que passa sem sistema é receita que vai pro concorrente. A conversa não custa nada, e pode mudar o faturamento da sua empresa.
          </p>

          {/* Centered Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-md mx-auto">
            <button
              id="cta-primary-btn"
              onClick={() => openModalWithSource('CTA Final Primary')}
              className="bg-brand-gold hover:bg-[#b8975f] text-brand-blue hover:scale-[1.01] transition-luxury font-bold text-base py-4 px-8 rounded-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Falar com especialista agora →
            </button>

            <button
              id="cta-secondary-btn"
              onClick={() => scrollToSection('solucao')}
              className="border border-brand-gold text-brand-gold hover:bg-brand-gold/5 transition-luxury font-bold text-base py-4 px-8 rounded-sm"
            >
              Ver como funciona
            </button>
          </div>

          {/* Mono tagline line below buttons */}
          <div className="pt-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/25 block">
              Sem enrolação. Sem compromisso. Só resultado.
            </span>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-blue-dark text-white pt-12 pb-8 border-t border-brand-gold/15 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          
          {/* Logo Decolar */}
          <div className="flex items-center gap-3 select-none">
            <DecolarLogo size="lg" className="shrink-0" />
            <div className="text-left flex flex-col justify-center">
              <span className="font-sans text-xl sm:text-2xl tracking-wider text-white font-black leading-tight uppercase">
                DECOLAR ASSESSORIA
              </span>
              <span className="block text-[10px] sm:text-[11px] font-medium tracking-normal text-white/90">
                Aumente suas vendas com tecnologia e gestão
              </span>
            </div>
          </div>

          {/* Tagline label */}
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.1em] text-brand-gold uppercase text-center max-w-2xl font-medium leading-relaxed">
            A única assessoria especializada em Marketing, Gestão de Vendas e Tecnologia para o setor de esquadrias no Brasil.
          </p>

          {/* Seção de Contatos Rápidos */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 pb-2">
            {/* E-mail */}
            <div className="flex flex-col items-center p-5 bg-white/[0.02] border border-white/5 rounded-sm hover:border-brand-gold/20 hover:bg-white/[0.04] transition-all text-center">
              <Mail className="w-5 h-5 text-brand-gold mb-2 shrink-0" />
              <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase block mb-1">E-mail Comercial</span>
              <a 
                href="mailto:comercial@decolarassessoria.com.br"
                className="text-white hover:text-brand-gold font-sans font-medium text-sm transition-colors break-all"
              >
                comercial@decolarassessoria.com.br
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col items-center p-5 bg-white/[0.02] border border-white/5 rounded-sm hover:border-brand-gold/20 hover:bg-white/[0.04] transition-all text-center">
              <PhoneCall className="w-5 h-5 text-brand-gold mb-2 shrink-0" />
              <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase block mb-1">WhatsApp Comercial</span>
              <div className="flex flex-col items-center gap-1">
                <a 
                  id="footer-whatsapp-link"
                  href="https://wa.me/5573991160287?text=Ol%C3%A1%21%2520Gostaria%2520de%2520saber%2520mais%2520sobre%2520a%2520Decolar%2520Assessoria."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-gold font-sans font-medium text-sm transition-colors"
                >
                  (73) 99116-0287
                </a>
                <span className="inline-block bg-[#25D366]/10 text-[#25D366] text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[3px] font-bold border border-[#25D366]/20">
                  Suporte Ativo
                </span>
              </div>
            </div>

            {/* Atendimento */}
            <div className="flex flex-col items-center p-5 bg-white/[0.02] border border-white/5 rounded-sm hover:border-brand-gold/20 hover:bg-white/[0.04] transition-all text-center">
              <Clock className="w-5 h-5 text-brand-gold mb-2 shrink-0" />
              <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase block mb-1">Horário de Canais</span>
              <div className="flex flex-col items-center gap-0.5 font-sans font-medium text-xs sm:text-sm text-white/80">
                <span>Segunda a Sexta: 9h às 18h</span>
                <span>Sábado: 9h às 16h</span>
              </div>
            </div>
          </div>

          {/* Fine Legal Notice Line */}
          <div className="w-full h-[1px] bg-white/10 my-4" />

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-mono">
            <span>&copy; {new Date().getFullYear()} Decolar Assessoria LTDA. Todos os direitos reservados.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-white cursor-pointer transition-luxury">Políticas de Privacidade</span>
              <span>&bull;</span>
              <span className="hover:text-white cursor-pointer transition-luxury">Termos de Uso</span>
            </div>
          </div>

        </div>
      </footer>

      {/* LEAD QUALIFICATION MODAL */}
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        ctaSource={modalSource} 
      />

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />

    </div>
  );
}

// Simple fallback premium component for Lucide XCircle to make code robust and completely clean
function XCircleIcon() {
  return (
    <svg className="w-6 h-6 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
