/**
 * CONECTOR DE LEADS DECOLAR ASSESSORIA
 * 
 * Como instalar na sua planilha do Google Sheets:
 * 1. Abra sua planilha do Google Sheets.
 * 2. No menu superior, clique em "Extensões" -> "Apps Script".
 * 3. Apague todo o conteúdo que estiver na tela e cole este código completo.
 * 4. Clique no ícone de Salvar (um disquete no topo).
 * 5. Clique em "Implantar" (canto superior direito) -> "Nova implantação".
 * 6. Na engrenagem, selecione "Web App" (ou "Aplicativo da Web").
 * 7. Configure:
 *    - Executar como: "Eu (seu-email@gmail.com)"
 *    - Quem tem acesso: "Qualquer pessoa" (ou "Anyone")
 * 8. Clique em "Implantar" e conceda as permissões de gravação caso o Google solicite.
 * 9. Copie a "URL do Web App" gerada.
 * 10. Configure essa URL na variável de ambiente GOOGLE_SHEETS_WEBHOOK_URL do seu servidor.
 */

function doPost(e) {
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
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ "status": "online", "message": "Conector Decolar está pronto e operando." }))
                       .setMimeType(ContentService.MimeType.JSON);
}
