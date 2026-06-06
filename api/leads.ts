import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';

// Helper for SMTP setup (exact diagnostic logic from server.ts)
function getMailTransporter() {
  let host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  let user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Auto-correction logic if user put an email address in SMTP_HOST by mistake
  if (host && host.includes('@')) {
    const originalHost = host;
    const domain = host.split('@')[1]?.toLowerCase();
    
    if (!user) {
      user = originalHost;
    }

    if (domain === 'gmail.com' || domain === 'decolarassessoria.com.br' || domain === 'decolarassessoria.com') {
      host = 'smtp.gmail.com';
    } else if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com' || domain === 'office365.com') {
      host = 'smtp.office365.com';
    } else if (domain === 'yahoo.com' || domain === 'yahoo.com.br') {
      host = 'smtp.mail.yahoo.com';
    } else {
      host = `smtp.${domain}`;
    }
  }

  if (!host || !user || !pass) {
    return null;
  }

  if (host.includes('@')) {
    return null;
  }

  try {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (err) {
    console.error('Failed to create mail transporter:', err);
    return null;
  }
}

export default async function handler(req: Request, res: Response) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { name, phone, email, revenue, material, region, marketing, employees, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios' });
    }

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    const leadData = {
      id: leadId,
      name,
      phone,
      email: email || 'Não informado',
      revenue: revenue || 'Não informado',
      material: material || 'Não informado',
      region: region || 'Não informado',
      marketing: marketing || 'Não informado',
      employees: employees || 'Não informado',
      source: source || 'Vercel Deployment',
      createdAt
    };

    console.log(`[Vercel Serverless] Recebido lead de: ${name}`);

    // 1. PRESERVE & SEND EMAIL NOTIFICATION TO COMERCIAL
    const destinationEmail = process.env.DEST_EMAIL || 'comercial@decolarassessoria.com.br';
    const mailTransporter = getMailTransporter();

    let emailSentSuccessfully = false;

    if (mailTransporter) {
      const formattedDate = new Date(createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
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
                    ${formattedDate}
                  </div>
                </div>
                
                <div class="cta-block">
                  <a href="https://wa.me/${leadData.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Sou da Decolar Assessoria e recebi os seus dados no nosso portal. Vamos agendar seu diagnóstico gratuito?')}" class="cta-btn" target="_blank">
                    Iniciar Atendimento no WhatsApp
                  </a>
                </div>
              </div>
              <div class="footer">
                Este e-mail é gerado automaticamente pelo sistema de leads da Decolar Assessoria.
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || `"Decolar Assessoria" <${process.env.SMTP_USER}>`,
          to: destinationEmail,
          subject: `🚀 [NOVO LEAD - ${leadData.source}] ${name}`,
          text: `Novo lead cadastrado!\n\nNome: ${name}\nWhatsApp: ${phone}\nEmail: ${email}\nRegião: ${region}\nFaturamento: ${revenue}\nInveste em Marketing: ${marketing}\nFuncionários: ${employees}\nOrigem: ${source}`,
          html: htmlEmail
        });
        emailSentSuccessfully = true;
      } catch (mailErr) {
        console.error('[Vercel SMTP Error] Email dispatch failed:', mailErr);
      }
    }

    // 2. GOOGLE SHEETS WEBHOOK STREAMING
    // Default webhook URL configured in Vercel environment variables as GOOGLE_SHEETS_WEBHOOK_URL
    const defaultWebhookUrl = 'https://script.google.com/macros/s/AKfycby685zGEv3Fu-spHnDSh_XWYQb-ZsbBnzA6-xHfUPO5TXQ1n3FwPKnbW6UWTAB-4Qvwnw/exec';
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
      googleWebhookUrl = activeUrl;
    }

    let googleSyncStatus = 'inactive';

    if (googleWebhookUrl && (googleWebhookUrl.startsWith('http://') || googleWebhookUrl.startsWith('https://'))) {
      try {
        const formattedDate = new Date(createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const sheetsPayload = {
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

        const response = await fetch(finalUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetsPayload)
        });

        if (response.ok) {
          googleSyncStatus = 'success';
        } else {
          googleSyncStatus = `error_response_${response.status}`;
        }
      } catch (sheetsErr) {
        console.error('[Vercel Webhook Error] Google Sheets synchronization failed:', sheetsErr);
        googleSyncStatus = 'failed_delivery';
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead processado com sucesso.',
      leadId,
      emailSent: emailSentSuccessfully,
      googleSync: googleSyncStatus
    });

  } catch (error: any) {
    console.error('Unified generic handler crash:', error);
    return res.status(500).json({ error: 'Erro interno no servidor correspondente', details: error?.message || '' });
  }
}
