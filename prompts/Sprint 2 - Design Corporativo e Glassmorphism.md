# Sprint 02: Design Corporativo, Glassmorphism e Pop-up de Instruções

**Objetivo:** Refinar a identidade visual do portal corporativo de auditoria, garantindo um visual "premium", integrando logos, fundos dinâmicos em alta resolução, melhorando contraste (Efeito Vidro/Glassmorphism) e criar um passo a passo interativo inicial.

## Lista de Prompts Executados

1. **Inserção do Logo**
   *Prompt:* `@[/home/armando/Área de trabalho/basesCertificadas/logo.jpeg] utiliza essa lgoo no site`
   *Ação:* Substituída a logo SVG genérica pela imagem solicitada, ajustando classes Tailwind para tamanho correto no header.

2. **Remoção de Fundo e Favicon**
   *Prompt:* `remove o fundo dela antes de adicionar e cloque ela no favicon do navegador tambem`
   *Ação:* Criação de script Node.js com a biblioteca `jimp` para limpar o fundo branco de `logo.jpeg` e salvá-lo como `logo.png` transparente. A imagem gerada foi inserida como favicon na tag `<head>` e substituída na barra de navegação.

3. **Inclusão de Background**
   *Prompt:* `@[/home/armando/Área de trabalho/basesCertificadas/torres.jpeg] adicoone essa imagem comom background do site`
   *Ação:* Adição da imagem em plano de fundo no `body`, cobrindo e fixando ao fundo. Posteriormente organizou-se todos os assets (imagens) para dentro da pasta `public/img/` seguindo padrões modernos do Vite.
   *Ajuste de Cobre Tela:* Adição de estilos explícitos `background-size: cover;` solicitada no prompt `adiicone um background covver na imagem para ela caber certinho no site`.

4. **Tratamento de Filtro e Resolução**
   *Prompt:* `a imgem no fundo ta ficando com a qualidade ruim.`
   *Ação:* Adicionado um elemento fixo atrás do site (z-index negativo) com CSS `filter: blur(8px)` e leve transparência preta (overlay) para transformar o baixo-res da imagem em estética de desfoque premium sem quebra de pixels.

5. **Geração de Novo Background Dinâmico (IA)**
   *Prompt:* `remove a imagem do background e gere uma imagem profissional que combine com a identidade do site e coloque ela no lugar da antiga`
   *Ação:* Utilizada IA para gerar uma arte 4K de alta qualidade focado em estética coorporativa de infraestrutura de telecom, salva e setada no site, além de restabelecer o *blur* posteriormente com o prompt: `deixe a imagem com um embaçamento`.

6. **Glassmorphism (Transparência no Design)**
   *Prompts:*
   - `coloque o card com a cor de meio transparente com um embaçado. nao sei o nome tecnico. to achando ele muito branco`
   - `mais visivel e adapte o site inteiro para esse tipo de design`
   *Ação:* Modificou o design global do sistema para um tema escuro (Dark Mode) transparente com a técnica Glassmorphism (`bg-white/10`, `backdrop-blur-xl`, `border-white/20`), resultando numa mescla ultra-profissional das cores com o background premium. Textos escuros do Tailwind foram alternados para branco e cinza claro.

7. **Modal / Pop-up de Instruções**
   *Prompt:* `agora gere um pop-up de bem vindo contendo o passo a passo de como preencher corretamente as informacoes do site. esse pop-up vai aparecer assim que o site abri. mantenha o mesmo design do site e no final alimente a pasta de prompts para registro`
   *Ação:* Adicionado um Modal contendo as regras de preenchimento logo na abertura do site e programada a lógica JS para fechar no botão Entendi. Esse MD documentando a Sprint foi originado dessa solicitação final.
