/**
 * DECOLAR ASSESSORIA - Sincronizador de Leads via Google Apps Script
 * 
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Abra a planilha: https://docs.google.com/spreadsheets/d/1Wnjswbv0P9fndKI5GIfs-rYwCu2Qe8ZDSaBKCmL408w/edit
 * 2. Vá em: Extensões > Apps Script
 * 3. Apague o conteúdo existente e cole TODO este código
 * 4. Clique em Salvar (ícone de disquete)
 * 5. Clique em "Implantar" > "Nova implantação"
 * 6. Tipo: "Aplicativo da Web"
 *    - Executar como: Eu (seu e-mail)
 *    - Quem tem acesso: Qualquer pessoa
 * 7. Clique em "Implantar" e copie a URL gerada (termina em /exec)
 * 8. Cole essa URL no arquivo .env do projeto: GOOGLE_SHEETS_WEBHOOK_URL="<url copiada>"
 */

// ID da planilha alvo (fixo para maior segurança)
var SPREADSHEET_ID = '1Wnjswbv0P9fndKI5GIfs-rYwCu2Qe8ZDSaBKCmL408w';

// Nome da aba onde os leads serão salvos
var SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // Cria a aba se não existir
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    var data;

    // Tenta parsear os dados enviados em formato JSON
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter; // Fallback via Query Params
    }

    // Se a planilha estiver vazia, cria os cabeçalhos com estilo Decolar
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

      // Estilo premium nos cabeçalhos
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0a2540"); // Azul escuro Decolar
      headerRange.setFontColor("#C9A96E");  // Dourado brand
      headerRange.setHorizontalAlignment("center");
      sheet.setRowHeight(1, 32);
      sheet.setFrozenRows(1);
    }

    // Formata a data em PT-BR
    var formattedDate = data.Data || data.createdAt
      ? new Date(data.createdAt || data.Data).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
      : new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    // Adiciona a linha do lead
    sheet.appendRow([
      data.ID || data.id || "",
      data.Nome || data.name || "",
      data.WhatsApp || data.phone || "",
      data["E-mail"] || data.email || "",
      data["Região / Cidade"] || data.region || "",
      data.Faturamento || data.revenue || "",
      data["Investe em Marketing"] || data.marketing || "",
      data["Qtd. Funcionários"] || data.employees || "",
      data.Origem || data.source || "",
      formattedDate
    ]);

    // Ajusta largura das colunas automaticamente
    sheet.autoResizeColumns(1, 10);

    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Lead registrado com sucesso!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Retorna o erro para debugging
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste manual (rode pelo editor para verificar se está funcionando)
function testarIntegracao() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        "Nome": "Empresa Teste",
        "WhatsApp": "(11) 99999-9999",
        "E-mail": "teste@empresa.com",
        "Região / Cidade": "São Paulo",
        "Faturamento": "R$ 50 mil a R$ 100 mil / mês",
        "Investe em Marketing": "Sim",
        "Qtd. Funcionários": "10 a 30",
        "Origem": "Teste Manual",
        "ID": "test_" + Date.now(),
        "createdAt": new Date().toISOString()
      })
    }
  };
  
  var resultado = doPost(mockEvent);
  Logger.log("Resultado do teste: " + resultado.getContent());
}
