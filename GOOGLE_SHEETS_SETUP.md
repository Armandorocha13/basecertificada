# Configuração do Google Sheets para Auditoria Logística

Para que o sistema salve os dados automaticamente na planilha `1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4`, siga os passos abaixo:

## Passo 1: Preparar o Google Apps Script
1. Abra a sua planilha no Google Sheets: [https://docs.google.com/spreadsheets/d/1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4](https://docs.google.com/spreadsheets/d/1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4).
2. Vá em **Extensões** > **Apps Script**.
3. Apague todo o conteúdo do editor e cole o código abaixo:

```javascript
/**
 * Script de Ponte para salvar dados do Formulário de Auditoria
 */
function doPost(e) {
  try {
    const spreadsheetId = "1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets()[0];
    
    // Parse dos dados recebidos do formulário
    const data = JSON.parse(e.postData.contents);
    
    // Ordem correta seguindo os cabeçalhos da sua planilha (Base, Nome, Serial, URL, etc)
    sheet.appendRow([
      data.base,                                                  // Coluna A (base)
      data.auditor,                                               // Coluna B (nome)
      data.serial,                                                // Coluna C (serial)
      `=HYPERLINK("${data.links}"; "Clique aqui para ver a foto")`, // Coluna D (URL clicável)
      data.arquivos_quant,                                        // Coluna E (quantidade)
      data.data_envio                                             // Coluna F (data do envio)
    ]);
    
    return ContentService.createTextOutput("Sucesso").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    Logger.log("Erro no processamento: " + error.toString());
    return ContentService.createTextOutput("Erro: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

4. Clique no ícone de **Salvar** (disquete) e dê um nome ao projeto (ex: `Ponte-Auditoria-Excel`).

## Passo 2: Implantar como Web App
1. Clique no botão azul **Implantar** (Deploy) > **Nova implantação**.
2. No ícone de engrenagem, selecione o tipo **App da Web**.
3. Configurações:
   - **Descrição:** V1.0
   - **Executar como:** Eu (sua conta google)
   - **Quem pode acessar:** Qualquer pessoa (Anyone)
4. Clique em **Implantar**.
5. O Google pedirá autorização. Clique em "Autorizar acesso", escolha sua conta e em "Avançado" clique em "Ir para Ponte-Auditoria (não seguro)".
6. **IMPORTANTE:** Copie a **URL do App da Web** que será gerada.

## Passo 3: Adicionar a URL no Código do Projeto
1. Abra o arquivo `src/main.js` no seu editor.
2. Localize a variável `const GOOGLE_SCRIPT_URL = '';` (por volta da linha 116).
3. Cole a URL copiada entre as aspas simples.
4. Salve o arquivo e faça o teste de envio no site.

---

### Dicas de Otimização:
- **Tabela Supabase:** Como o projeto já possui o Supabase instalado, podemos futuramente espelhar esses dados em uma tabela `auditorias` para redundância.
- **Upload de Fotos:** Se precisar salvar as fotos reais no Google Drive, o código do script acima pode ser expandido para aceitar arquivos binários (Base64).
