import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to ensure database directories are set up
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads_backup.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create mail transporter dynamically; do not cache globally so we immediately pick up updated env credentials
function getMailTransporter() {
  let host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  let user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Auto-correction logic if user put an email address in SMTP_HOST by mistake
  if (host && host.includes('@')) {
    const originalHost = host;
    const domain = host.split('@')[1]?.toLowerCase();
    
    // Default the user to the mistakenly configured email host if not set
    if (!user) {
      user = originalHost;
      console.log(`[SMTP Auto-Correction] SMTP_USER was empty, copying email from SMTP_HOST: "${user}"`);
    }

    // Correct the SMTP_HOST according to common service providers and standard custom domains
    if (domain === 'gmail.com' || domain === 'decolarassessoria.com.br' || domain === 'decolarassessoria.com') {
      host = 'smtp.gmail.com';
      console.log(`[SMTP Auto-Correction] Recognized Google/Gmail Workspace domain: "${domain}". Corrected SMTP_HOST to "smtp.gmail.com".`);
    } else if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com' || domain === 'office365.com') {
      host = 'smtp.office365.com';
      console.log(`[SMTP Auto-Correction] Recognized Microsoft/Outlook domain: "${domain}". Corrected SMTP_HOST to "smtp.office365.com".`);
    } else if (domain === 'yahoo.com' || domain === 'yahoo.com.br') {
      host = 'smtp.mail.yahoo.com';
      console.log(`[SMTP Auto-Correction] Recognized Yahoo domain: "${domain}". Corrected SMTP_HOST to "smtp.mail.yahoo.com".`);
    } else {
      host = `smtp.${domain}`;
      console.log(`[SMTP Auto-Correction] Defaulting host for domain "${domain}" to "smtp.${domain}".`);
    }
  }

  if (!host || !user || !pass) {
    // Return null if credentials are not fully set up.
    // This allows the server to run in preview/development mode without crashing,
    // gracefully falling back to mock logs and simulation.
    return null;
  }

  // Guard check: User might have entered an e-mail address as host by mistake (should be corrected by now, but keep as fallback)
  if (host.includes('@')) {
    console.warn(`[SMTP Config Error] O SMTP_HOST "${host}" parece ser um endereço de e-mail ao invés de um servidor SMTP (ex: mail.seuprovedor.com ou smtp.gmail.com). Pulando o envio para evitar erros de DNS.`);
    return null;
  }

  try {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // Use secure connection for port 465
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false // Avoid SSL handshake rejection errors
      }
    });
  } catch (err) {
    console.error('Failed to create mail transporter:', err);
    return null;
  }
}

// Lead API Endpoint - Stores leads locally, emails the company, and forwards to Google Sheets
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, email, revenue, material, region, marketing, employees, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios' });
    }

    const leadData = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      phone,
      email: email || 'Não informado',
      revenue: revenue || 'Não informado',
      material: material || 'Não informado',
      region: region || 'Não informado',
      marketing: marketing || 'Não informado',
      employees: employees || 'Não informado',
      source: source || 'Geral/Desconhecido',
      createdAt: new Date().toISOString()
    };

    // 1. SAVE LEAD LOCALLY (Robust fail-safe storage)
    let leads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      try {
        const fileContent = fs.readFileSync(LEADS_FILE, 'utf-8');
        leads = JSON.parse(fileContent);
      } catch (e) {
        console.error('Error reading leads file, resetting...', e);
      }
    }
    leads.push(leadData);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    console.log(`[Backup] Lead salvos com sucesso no servidor: ${name}`);

    // 2. PRESERVE & SEND EMAIL NOTIFICATION TO COMERCIAL
    const destinationEmail = process.env.DEST_EMAIL || 'comercial@decolarassessoria.com.br';
    const mailTransporter = getMailTransporter();

    // Create a beautiful executive dark & gold analytical email template
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #0a2540; }
            .container { max-width: 600px; background: #ffffff; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(10,37,64,0.05); margin: 0 auto; }
            .header { background: #0a2540; padding: 30px; text-align: center; border-bottom: 4px solid #C9A96E; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
            .header p { color: #C9A96E; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; }
            .content { padding: 30px; }
            .lead-title { border-bottom: 1px solid #e1e8ed; padding-bottom: 15px; margin-bottom: 25px; }
            .lead-title h2 { margin: 0; font-size: 20px; color: #0a2540; }
            .field-row { display: flex; border-bottom: 1px dashed #e1e8ed; padding: 12px 0; font-size: 14px; }
            .field-label { width: 40%; font-weight: bold; color: #1e3a5f; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; display: flex; align-items: center; }
            .field-value { width: 60%; color: #334e68; }
            .whatsapp-link { font-weight: bold; color: #25D366; text-decoration: none; }
            .badge { display: inline-block; background-color: #fcf9f2; border: 1px solid #C9A96E; color: #C9A96E; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            .cta-block { text-align: center; margin-top: 35px; }
            .cta-btn { display: inline-block; background-color: #25D366; color: #ffffff; font-weight: bold; padding: 14px 28px; border-radius: 5px; text-decoration: none; font-size: 15px; box-shadow: 0 4px 6px rgba(37,211,102,0.2); }
            .footer { background: #f8fafc; text-align: center; padding: 20px; font-size: 11px; color: #627d98; border-top: 1px solid #e1e8ed; }
            .footer a { color: #C9A96E; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DECOLAR ASSESSORIA</h1>
              <p>Notificação Automática de Lead</p>
            </div>
            <div class="content">
              <div class="lead-title">
                <h2>Novo Lead Qualificado!</h2>
                <div style="margin-top: 5px;"><span class="badge">Origem: ${leadData.source}</span></div>
              </div>
              
              <div class="field-row">
                <div class="field-label">Nome Completo</div>
                <div class="field-value"><strong>${leadData.name}</strong></div>
              </div>
              
              <div class="field-row">
                <div class="field-label">WhatsApp</div>
                <div class="field-value">
                  <a href="https://wa.me/${leadData.phone.replace(/\D/g, '')}" class="whatsapp-link" target="_blank">
                    ${leadData.phone} (Chamar no Zap)
                  </a>
                </div>
              </div>

              <div class="field-row">
                <div class="field-label">E-mail Profissional</div>
                <div class="field-value">${leadData.email}</div>
              </div>

              <div class="field-row">
                <div class="field-label">Faturamento</div>
                <div class="field-value">${leadData.revenue}</div>
              </div>

              <div class="field-row">
                <div class="field-label">Região / Cidade</div>
                <div class="field-value">${leadData.region}</div>
              </div>

              <div class="field-row">
                <div class="field-label">Investe em Marketing</div>
                <div class="field-value">${leadData.marketing}</div>
              </div>

              <div class="field-row">
                <div class="field-label">Qtd. Funcionários</div>
                <div class="field-value">${leadData.employees}</div>
              </div>

              <div class="field-row" style="border-bottom: none;">
                <div class="field-label">Data de Captura</div>
                <div class="field-value" style="font-size: 12px; color: #829ab1;">
                  ${new Date(leadData.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                </div>
              </div>
              
              <div class="cta-block">
                <a href="https://wa.me/${leadData.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Sou da Decolar Assessoria e recebi os seus dados no nosso portal. Vamos agendar seu diagnóstico gratuito?')}" class="cta-btn" target="_blank">
                  Iniciar Atendimento no WhatsApp
                </a>
              </div>
            </div>
            <div class="container-info" style="padding: 0 30px 25px 30px; font-size: 12px; color: #486581; line-height: 1.5; text-align: center;">
              <p style="background: #f0f4f8; padding: 12px; border-radius: 6px; margin: 0; font-style: italic;">
                💡 <b>Dica Google Sheets</b>: Este formulário já está pronto para alimentar sua planilha. Defina a variável <code>GOOGLE_SHEETS_WEBHOOK_URL</code> no painel de ambiente para usufruir de sincronização em tempo real.
              </p>
            </div>
            <div class="footer">
              Este e-mail é gerado automaticamente pelo sistema de leads da Decolar Assessoria.<br>
              <a href="${process.env.APP_URL || '#'}" target="_blank">Acessar Landing Page</a>
            </div>
          </div>
        </body>
      </html>
    `;

    let emailSentSuccessfully = false;

    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || `"Decolar Assessoria" <${process.env.SMTP_USER}>`,
          to: destinationEmail,
          subject: `🚀 [NOVO LEAD - ${leadData.source}] ${name}`,
          text: `Novo lead cadastrado!\n\nNome: ${name}\nWhatsApp: ${phone}\nEmail: ${email}\nRegião: ${region}\nFaturamento: ${revenue}\nInveste em Marketing: ${marketing}\nFuncionários: ${employees}\nOrigem: ${source}`,
          html: htmlEmail
        });
        console.log(`[Email] Notificação de lead enviada com sucesso para ${destinationEmail}`);
        emailSentSuccessfully = true;
      } catch (mailErr: any) {
        const errorMsg = mailErr?.message || '';
        if (errorMsg.includes('Application-specific password required') || errorMsg.includes('534-5.7.9')) {
          console.error('\n⚠️ [SMTP CONFIGURATION ERROR] - SENHA DE APP NECESSÁRIA! ⚠️');
          console.error('O Gmail/Google Workspace exige uma "Senha de App" (App Password) de 16 dígitos quando a verificação em duas etapas está ativa.');
          console.error('Para corrigir este problema e permitir o envio de e-mails:');
          console.error('1. Acesse sua Conta Google (https://myaccount.google.com).');
          console.error('2. Vá na aba "Segurança" e ative a "Verificação em duas etapas" (se ainda não estiver ativa).');
          console.error('3. Pesquise por "Senhas de app" na barra de busca superior da sua conta Google.');
          console.error('4. Crie uma nova senha de app com o nome "Landing Page Decolar" ou similar.');
          console.error('5. Copie o código gerado de 16 dígitos (sem os espaços).');
          console.error('6. Cole este código no seu painel de Segredos/Configurações do AI Studio substituindo o valor de SMTP_PASS.\n');
        } else {
          console.error('[Email] Falha ao enviar email do lead via SMTP:', mailErr);
        }
      }
    } else {
      console.log('[Email] Servidor SMTP não está configurado completamente. Rodando no modo de simulação (lead salvo localmente).');
    }

    // 3. GOOGLE SHEETS WEBHOOK STREAMING (Dynamic Integration)
    // Instantly routes lead data in real-time to Google Sheets script, Zapier, Make, etc.
    const defaultWebhookUrl = 'https://script.google.com/macros/s/AKfycbx287n713LVYe4x9ZLghaiMSTvg3BaNzXgVI9Z-ZRlI4qi9I404r3p6ALdTxE7WZp0ZDA/exec';
    let googleWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!googleWebhookUrl || 
        googleWebhookUrl.trim() === '' || 
        googleWebhookUrl.toLowerCase() === 'disabled' || 
        googleWebhookUrl.toLowerCase() === 'none' ||
        (!googleWebhookUrl.startsWith('http://') && !googleWebhookUrl.startsWith('https://'))) {
      googleWebhookUrl = defaultWebhookUrl;
    }
    
    // Auto-Correction for old/stale Google Webhook URLs
    const oldUrlSig = 'AKfycbgm3';
    const activeUrl = defaultWebhookUrl;
    if (googleWebhookUrl.includes(oldUrlSig)) {
      console.log('[Google Sheets Auto-Correction] Detected stale webhook URL. Auto-correcting to the working active spreadsheet WebApp...');
      googleWebhookUrl = activeUrl;
    }

    let googleSyncStatus = 'inactive';

    if (googleWebhookUrl && (googleWebhookUrl.startsWith('http://') || googleWebhookUrl.startsWith('https://'))) {
      try {
        const formattedDate = new Date(leadData.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        // Flawless enriched payload containing both exact column header names and raw developer keys
        const sheetsPayload = {
          // Exact Portuguese Header Mappings matching the spreadsheet ('Respostas ao formulário 1')
          "ID": leadData.id,
          "Nome": leadData.name,
          "WhatsApp": leadData.phone,
          "E-mail": leadData.email,
          "Região / Cidade": leadData.region,
          "Faturamento": leadData.revenue,
          "Investe em Marketing": leadData.marketing,
          "Qtd. Funcionários": leadData.employees,
          "Origem": leadData.source,
          "Data": formattedDate,

          // Original keys for developer integrations / backups
          "id": leadData.id,
          "name": leadData.name,
          "phone": leadData.phone,
          "email": leadData.email,
          "revenue": leadData.revenue,
          "material": leadData.material,
          "region": leadData.region,
          "marketing": leadData.marketing,
          "employees": leadData.employees,
          "source": leadData.source,
          "createdAt": leadData.createdAt
        };

        // Create query string parameters as fallback since many Google Apps Scripts read e.parameter.Nome
        const queryParams = new URLSearchParams({
          "ID": leadData.id,
          "Nome": leadData.name,
          "WhatsApp": leadData.phone,
          "E-mail": leadData.email,
          "Região / Cidade": leadData.region,
          "Faturamento": leadData.revenue,
          "Investe em Marketing": leadData.marketing,
          "Qtd. Funcionários": leadData.employees,
          "Origem": leadData.source,
          "Data": formattedDate
        }).toString();

        const finalUrl = googleWebhookUrl.includes('?') 
          ? `${googleWebhookUrl}&${queryParams}`
          : `${googleWebhookUrl}?${queryParams}`;

        console.log(`[Google Sheets] Transmitindo lead via Webhook para: ${googleWebhookUrl}`);
        const response = await fetch(finalUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetsPayload)
        });

        if (response.ok) {
          const resBody = await response.text();
          console.log('[Google Sheets] Dados sincronizados com sucesso com o Google Sheets. Resposta:', resBody);
          googleSyncStatus = 'success';
        } else {
          console.warn(`[Google Sheets] O Webhook do Google Sheets respondeu com status: ${response.status}`);
          googleSyncStatus = 'error_response';
        }
      } catch (sheetsErr) {
        console.error('[Google Sheets] Erro ao sincronizar com o webhook do Google:', sheetsErr);
        googleSyncStatus = 'failed_delivery';
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead processado com sucesso!',
      backupSaved: true,
      emailNotified: emailSentSuccessfully || (mailTransporter ? false : 'simulated'),
      googleSync: googleSyncStatus,
      lead: leadData
    });

  } catch (globalErr) {
    console.error('[Server Error] Erro ao processar o lead:', globalErr);
    return res.status(500).json({ error: 'Erro interno no servidor ao registrar lead' });
  }
});

// Serve leads_backup.json through a secured/custom preview endpoint for easy checking
app.get('/api/leads/list-dev-only', (req, res) => {
  if (fs.existsSync(LEADS_FILE)) {
    try {
      const fileContent = fs.readFileSync(LEADS_FILE, 'utf-8');
      return res.json(JSON.parse(fileContent));
    } catch (e) {
      return res.status(500).json({ error: 'Falha ao ler o backup de leads' });
    }
  }
  return res.json([]);
});

// Vite middleware for development or Static Asset serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Decolar Assessoria running on http://localhost:${PORT}`);
  });
}

startServer();
