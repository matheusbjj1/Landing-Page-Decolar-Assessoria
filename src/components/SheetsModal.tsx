import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Code, 
  Check, 
  Copy, 
  Sparkles, 
  Share2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface SheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SheetsModal({ isOpen, onClose }: SheetsModalProps) {
  const [activeTab, setActiveTab] = useState<'download' | 'script' | 'connect'>('download');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const googleAppsScriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data;
    
    // Tenta parsear os dados enviados em formato JSON
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter; // Fallback se enviado via Query Params
    }
    
    // Se a planilha estiver vazia, cria os cabeçalhos automaticamente com identidade visual Decolar
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data", 
        "Nome", 
        "WhatsApp", 
        "E-mail", 
        "Região / Cidade", 
        "Faturamento", 
        "Investe em Marketing", 
        "Qtd. Funcionários", 
        "Origem", 
        "ID"
      ]);
      
      // Aplica estilo premium aos cabeçalhos (Fonte Negrito, Cor de Fundo Escura e Texto Amarelo Ouro)
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0a2540"); // Azul escuro Decolar
      headerRange.setFontColor("#C9A96E");   // Dourado brand-gold
      sheet.setRowHeight(1, 28);
    }
    
    // Adiciona as informações do Lead capturado do formulário
    sheet.appendRow([
      data.Data || data.createdAt || new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      data.Nome || data.name || "",
      data.WhatsApp || data.phone || "",
      data.E-mail || data.email || "",
      data["Região / Cidade"] || data.region || "",
      data.Faturamento || data.revenue || "",
      data["Investe em Marketing"] || data.marketing || "",
      data["Qtd. Funcionários"] || data.employees || "",
      data.Origem || data.source || "",
      data.ID || data.id || ""
    ]);
    
    // Organiza largura das colunas automaticamente
    sheet.autoResizeColumns(1, 10);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "Lead registrado com sucesso!" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-blue-dark/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl h-[85vh] flex flex-col bg-brand-blue border border-brand-gold/30 rounded-sm shadow-2xl overflow-hidden"
        >
          {/* Top colored accent line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-gold/20 via-brand-gold to-brand-gold/20" />

          {/* Header */}
          <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-brand-blue-dark/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gold/10 rounded-sm flex items-center justify-center border border-brand-gold/30">
                <FileSpreadsheet className="w-5 h-5 text-brand-gold" />
              </div>
              <div className="text-left">
                <h3 className="font-serif text-lg md:text-xl text-white font-semibold">
                  Guia Real-Time Google Sheets
                </h3>
                <p className="text-[10px] md:text-xs text-brand-gold font-mono uppercase tracking-widest leading-none mt-1">
                  Decolar Assessoria &bull; Automação de Leads
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Secondary Navigation Tags */}
          <div className="bg-brand-blue-dark/20 px-5 flex border-b border-white/5 gap-2 md:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('download')}
              className={`py-3.5 px-3 border-b-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'download' 
                  ? 'border-brand-gold text-brand-gold font-semibold' 
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4 shrink-0" />
              1. Baixar Planilha configurada
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`py-3.5 px-3 border-b-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'script' 
                  ? 'border-brand-gold text-brand-gold font-semibold' 
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 shrink-0" />
              2. Configurar Script (.gs)
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`py-3.5 px-3 border-b-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'connect' 
                  ? 'border-brand-gold text-brand-gold font-semibold' 
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4 shrink-0" />
              3. Ativar Integração
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 text-left">
            
            {/* TAB 1: DOWNLOAD CONFIG SYSTEM */}
            {activeTab === 'download' && (
              <div className="space-y-6 max-w-3xl">
                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-white font-serif">Planilha Modelo de Entrada de Leads</h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Nós criamos o modelo de planilha perfeito e estruturado para capturar os contatos da sua assessoria de esquadrias. Ele possui colunas sob medida para nome, WhatsApp clicável, faturamento mensal, e região de atendimento.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Semicolon Card */}
                  <div className="border border-white/10 p-5 rounded-sm bg-brand-blue-dark/30 hover:border-brand-gold/30 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-brand-gold rounded-full" />
                        <span className="font-mono text-[10px] text-brand-gold uppercase tracking-widest font-bold">Padrão Brasileiro</span>
                      </div>
                      <h5 className="text-sm font-bold text-white font-mono">leads-decolar (Ponto e Vírgula)</h5>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Recomendado para usuários brasileiros. Formato ideal para abrir no Excel, LibreOffice ou importar diretamente no Google Sheets sem desconfigurações regionais.
                      </p>
                    </div>
                    <a
                      href="/modelo-planilha-leads-decolar.csv"
                      download="modelo-planilha-leads-decolar.csv"
                      className="mt-5 w-full bg-brand-gold text-brand-blue py-3 px-4 rounded-sm text-xs font-bold font-mono tracking-wider text-center uppercase flex items-center justify-center gap-1.5 hover:bg-[#b8975f] transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Baixar CSV (.csv)
                    </a>
                  </div>

                  {/* Comma Card */}
                  <div className="border border-white/10 p-5 rounded-sm bg-brand-blue-dark/30 hover:border-brand-gold/30 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-brand-gold rounded-full" />
                        <span className="font-mono text-[10px] text-brand-gold uppercase tracking-widest font-bold">Padrão Internacional</span>
                      </div>
                      <h5 className="text-sm font-bold text-white font-mono">leads-decolar (Vírgula)</h5>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Para navegadores ou suítes de planilhas configuradas em idioma inglês. Composto com formato de vírgula padrão nativo de bancos de dados.
                      </p>
                    </div>
                    <a
                      href="/modelo-planilha-leads-decolar-comma.csv"
                      download="modelo-planilha-leads-decolar-comma.csv"
                      className="mt-5 w-full border border-white/20 hover:border-brand-gold hover:bg-white/5 text-white py-3 px-4 rounded-sm text-xs font-bold font-mono tracking-wider text-center uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-brand-gold" />
                      Baixar CSV virgula (.csv)
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-brand-blue-dark/50 border border-brand-gold/10 rounded-sm flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div className="text-xs text-white/70 space-y-1.5 leading-relaxed">
                    <p className="font-semibold text-white">Como carregar essa planilha no seu Google Drive:</p>
                    <ol className="list-decimal list-inside pl-1 space-y-1 text-white/60">
                      <li>Acesse o seu <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-brand-gold underline font-bold inline-flex items-center gap-0.5">Google Drive <ExternalLink className="w-3 h-3 inline" /></a>.</li>
                      <li>Clique em <b>Novo</b> (New) &bull; Criar nova <b>Planilhas Google</b> (Google Sheets).</li>
                      <li>Vá em <b>Arquivo</b> (File) &bull; <b>Importar</b> (Import).</li>
                      <li>Faça o upload do arquivo <code>modelo-planilha-leads-decolar.csv</code> que você acabou de baixar e clique em importar. Pronto! Sua estrutura de cabeçalhos está criada!</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COPY CODE APPS SCRIPT */}
            {activeTab === 'script' && (
              <div className="space-y-5 max-w-3xl">
                <div>
                  <h4 className="text-base font-semibold text-white font-serif">O código conector para automatizar</h4>
                  <p className="text-sm text-white/70 leading-relaxed mt-1">
                    Não é preciso usar ferramentas integradoras terceiras (Zapier, Make, Pluga). Cole este conector leve em JavaScript no Apps Script da planilha e gere sua própria API sem custos futuros.
                  </p>
                </div>

                <div className="relative rounded-sm border border-white/10 overflow-hidden bg-brand-blue-dark/50">
                  <div className="flex items-center justify-between px-4 py-2 bg-brand-blue-dark/80 border-b border-white/5">
                    <span className="text-[11px] font-mono text-white/40">Código Conector Google Apps Script</span>
                    <button
                      onClick={copyScriptToClipboard}
                      className="text-xs text-brand-gold hover:text-white flex items-center gap-1 font-mono hover:scale-105 transition-all text-left"
                    >
                      {copiedScript ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado com Sucesso!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[10px] font-mono text-brand-gold/85 text-left leading-normal h-48 max-w-full">
                    {googleAppsScriptCode}
                  </pre>
                </div>

                <div className="p-4 bg-brand-blue-dark/30 border border-white/5 rounded-sm">
                  <h5 className="font-mono text-xs uppercase tracking-wider text-brand-gold font-bold mb-2">Instruções de Instalação:</h5>
                  <ul className="text-xs text-white/70 pl-4 list-disc space-y-1.5 leading-relaxed">
                    <li>Na planilha carregada no Google Sheets, clique no menu superior em <b>Extensões (Extensions)</b> &bull; <b>Apps Script</b>.</li>
                    <li>Substitua qualquer linha existente pelo código que acabou de copiar acima.</li>
                    <li>Clique no ícone roxo/azul de <b>Salvar Projeto (Disquete)</b>.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: ACTIVATE INTEGRATION */}
            {activeTab === 'connect' && (
              <div className="space-y-6 max-w-3xl text-xs sm:text-sm">
                <div>
                  <h4 className="text-base font-semibold text-white font-serif">Implantar e Conectar</h4>
                  <p className="text-sm text-white/70 leading-relaxed mt-1">
                    Gere uma URL segura para colar no seu Painel de Segredos no AI Studio.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      1
                    </div>
                    <div className="text-left space-y-1 flex-1">
                      <p className="font-semibold text-white text-xs uppercase font-mono tracking-wider text-brand-gold">
                        Implantar como Aplicativo da Web
                      </p>
                      <p className="text-xs text-white/70 leading-relaxed">
                        No editor de Scripts (canto superior direito), clique no botão azul <b>"Implantar"</b> (Deploy) e escolha <b>"Nova Implantação"</b>. 
                        Na engrenagem, certifique-se de que está selecionado <b>"Aplicativo da Web"</b> (Web App).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      2
                    </div>
                    <div className="text-left space-y-1.5 flex-1 col-span-12">
                      <p className="font-semibold text-white text-xs uppercase font-mono tracking-wider text-brand-gold">
                        Configurações Obrigatórias de Permissão
                      </p>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Defina as opções exatamente nos valores listados para autorizar a gravação de leads sem travar sua planilha:
                      </p>
                      <ul className="list-disc list-inside bg-brand-blue-dark/40 p-3 rounded-sm border border-white/10 space-y-1 mt-1 font-mono text-[11px] leading-relaxed text-left">
                        <li><b className="text-white">Descrição:</b> Sincronizador de Leads Decolar</li>
                        <li><b className="text-white">Executar como:</b> Eu (seu-email@gmail.com)</li>
                        <li><b className="text-amber-300">Quem tem acesso:</b> Qualquer pessoa (ou "Anyone")</li>
                      </ul>
                      <p className="text-[11px] text-amber-300 bg-amber-500/5 p-2 rounded-sm border border-amber-500/10 mt-1">
                        ⚠️ <b>ATENÇÃO:</b> Deixar o acesso como "Apenas eu" impedirá que o servidor registre os leads. Defina como <b>"Qualquer pessoa"</b> de forma segura (a planilha só responde ao payload das chaves autorizadas do site).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      3
                    </div>
                    <div className="text-left space-y-1 flex-1">
                      <p className="font-semibold text-white text-xs uppercase font-mono tracking-wider text-brand-gold">
                        Vincular no AI Studio (Servidor)
                      </p>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Ao clicar em Implantar, o Google mostrará a sua <b>"URL do aplicativo da Web"</b> (que termina com <code>/exec</code>). Copie-a e siga as instruções para adicionar nas variáveis de ambiente:
                      </p>
                      <div className="bg-brand-blue-dark/50 border border-white/10 p-4 rounded-sm space-y-2 mt-2">
                        <p className="text-xs font-bold text-brand-gold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 shrink-0" />
                          <span>Como adicionar no Servidor do AI Studio:</span>
                        </p>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Abra o painel de configurações (Settings) do seu Workspace, crie ou altere o segredo com o nome <b>GOOGLE_SHEETS_WEBHOOK_URL</b> e preencha com a URL do Script que copiou. Pronto! Todos os novos leads cairão direto na sua planilha.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer of modal */}
          <div className="p-4 md:p-5 border-t border-white/10 bg-brand-blue-dark/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] font-mono text-white/40 text-center sm:text-left">
              📊 Decolar Assessoria &bull; Inteligência & Tecnologia de Vendas
            </span>
            <button
              onClick={onClose}
              className="bg-white/15 hover:bg-white/20 text-white py-2 px-5 text-xs font-bold rounded-sm uppercase tracking-wider transition-all w-full sm:w-auto"
            >
              Concluir Configuração
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
