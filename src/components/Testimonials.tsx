import React from 'react';
import { motion } from 'motion/react';
import { Quote, Sparkles } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      text: "Minha empresa não tinha presença nenhuma no digital. Depois que fechei com a Decolar, o WhatsApp não para. Todo dia chega orçamento novo.",
      author: "Arete Esquadria",
      label: "Alumínio & PVC"
    },
    {
      text: "Os clientes começaram a elogiar nossas postagens e, junto com isso, vieram os orçamentos. A internet virou um dos principais canais de vendas para nós.",
      author: "Divi Esquadria",
      label: "Vidros e Esquadrias"
    },
    {
      text: "Já tinha investido em agência antes. Os leads chegavam, mas não fechavam. Com a Decolar é diferente: uma grande porcentagem realmente compra.",
      author: "Inovação Esquadria",
      label: "Alto Padrão"
    }
  ];

  return (
    <section id="depoimentos" className="bg-brand-blue py-[56px] md:py-[88px] relative overflow-hidden">
      {/* Background elegant details */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-editorial-diagonal" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex bg-[#C9A96E]/12 px-3 py-1.5 rounded-full">
            <span className="font-mono uppercase text-[11px] tracking-[0.1em] text-brand-gold block font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              RESULTADOS REAIS
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-semibold tracking-[-0.02em]">
            O que dizem os donos de empresas de esquadrias
          </h2>
          <p className="font-sans text-white/55 text-sm sm:text-base leading-relaxed">
            Parcerias de alta performance e resultados reais no faturamento. Depoimentos reais de quem decolou as vendas.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 25 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className="glass-editorial p-8 rounded-sm hover:bg-white/[0.08] transition-luxury flex flex-col justify-between relative text-left h-full group"
            >
              {/* Elegant quote icon */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#C9A96E]/12 flex items-center justify-center border border-brand-gold/20 opacity-40 group-hover:opacity-100 transition-luxury">
                <Quote className="w-4 h-4 text-brand-gold" />
              </div>

              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-brand-gold text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans font-light italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-gold/15">
                <h4 className="font-serif text-lg text-brand-gold font-bold">
                  {review.author}
                </h4>
                <span className="text-xs font-mono uppercase tracking-wider text-white/40 block mt-0.5">
                  {review.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
