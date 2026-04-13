# Configuração do Google Sheets para Auditoria Logística

Para que o sistema salve os dados automaticamente na planilha `1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4`, siga os passos abaixo:

## Passo 1: Preparar o Google Apps Script
1. Abra a sua planilha no Google Sheets: [https://docs.google.com/spreadsheets/d/1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4](https://docs.google.com/spreadsheets/d/1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4).
2. Vá em **Extensões** > **Apps Script**.
3. Apague todo o conteúdo do editor e cole o código abaixo:

```javascript
/**
 * SCRIPT UNIVERSAL - SALVA AUDITORIAS EM ABAS ESPECÍFICAS
 * Gerencia Volante, Físico e Perdido em uma única planilha.
 */
function doPost(e) {
  try {
    const spreadsheetId = "1AFuSWvdADrCD-EkDabdKkVFQcT274fVAj_QwqGR54s4";
    const ss = SpreadsheetApp.openById(spreadsheetId);
    
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    const tipo = data.tipo || "Geral"; // Identifica a aba (Volante, Fisico ou Perdido)
    
    // Seleciona a aba correta
    let sheet = ss.getSheetByName(tipo);
    if (!sheet) {
      // Se a aba não existir, tenta usar a primeira
      sheet = ss.getSheets()[0];
    }
    
    // LÓGICA DE PREENCHIMENTO POR TIPO
    if (tipo === "Perdido") {
      // REGISTRO DE SINISTRO: [Base, Serial, Tipo, Link B.O., Link Dano, Data]
      sheet.appendRow([
        data.base,
        data.serial,
        data.tipo_sinistro,
        `=HYPERLINK("${data.link_bo}"; "Ver B.O. PDF")`,
        data.link_dano ? `=HYPERLINK("${data.link_dano}"; "Ver Dano PDF")` : "N/A",
        data.data_envio
      ]);
    } else {
      // REGISTRO PADRÃO (Volante/Físico): [Base, Auditor, Serial, Link Fotos, Quant, Data]
      sheet.appendRow([
        data.base,
        data.auditor,
        data.serial,
        `=HYPERLINK("${data.links}"; "Clique aqui para ver a foto")`,
        data.arquivos_quant,
        data.data_envio
      ]);
    }
    
    return ContentService.createTextOutput("Sucesso").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
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

## Passo 4: Preparar as Abas da Planilha
Para que o roteamento funcione, você deve criar 3 abas na parte inferior da sua planilha do Google:

### Aba 1: `Volante` (e Aba 2: `Fisico`)
Ambas seguem a mesma estrutura. Coloque estes cabeçalhos na primeira linha (**A1 até F1**):
1. **A1:** Unidade Base
2. **B1:** Auditor Responsável
3. **C1:** Serial (SN)
4. **D1:** Link das Evidências
5. **E1:** Quant. Arquivos
6. **F1:** Data do Envio

### Aba 3: `Perdido`
Esta aba tem campos específicos para documentos. Cabeçalhos (**A1 até E1**):
1. **A1:** Base de Origem
2. **B1:** Serial (SN)
3. **C1:** Boletim de Ocorrência (PDF)
4. **D1:** Dano ao Patrimônio (PDF)
5. **E1:** Data do Envio

---

### Dicas de Otimização:
- **Tabela Supabase:** Como o projeto já possui o Supabase instalado, os arquivos reais ficam permanentemente salvos lá. A planilha serve como o seu "Índice de Auditoria".
- **Acesso rápido:** Você pode congelar a primeira linha (**Ver > Congelar > 1 linha**) para que os cabeçalhos fiquem sempre visíveis ao rolar os dados.
- **Formatação:** Recomendo centralizar as colunas e aumentar a largura das colunas de Link para facilitar a visualização.
