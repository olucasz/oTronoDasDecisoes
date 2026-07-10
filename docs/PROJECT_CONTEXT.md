# Contexto do Projeto

## Resumo

Landing page de pre-venda do livro **O Trono das Decisões**, de **Mateus Chaves Generoso**. A direção visual deve ser editorial, premium, cristã, clássica e contemplativa, vendendo pela autoridade e atmosfera da mensagem, sem parecer RPG, fantasia medieval exagerada, infoproduto agressivo ou template genérico.

## Identidade Visual

- Maturidade, reverência, discernimento e sobriedade.
- Base clara com textura de papel, mármore e arquitetura clássica.
- Uso de vinho profundo para contraste, CTAs e detalhes institucionais.
- Dourado aplicado com discrição em linhas, ornamentos, estados de hover e microelementos.
- Composição com muito respiro, hierarquia tipográfica editorial e ornamentação mínima.

## Paleta

- Pergaminho: `#F8F3EB`
- Off white: `#FCFAF6`
- Vinho imperial: `#311117`
- Quase preto: `#18080B`
- Marrom editorial: `#4A3026`
- Chumbo: `#2D2D2D`
- Cinza secundario: `#5F5F5F`
- Dourado: `#B28B43`
- Dourado claro: `#D9BE79`
- CTA: `#43151D`
- CTA hover: `#5B1D29`
- Borda: `#E9DDCC`

## Tipografia

- Titulos: `Cormorant Garamond`, pesos 600 a 800.
- Subtitulos e chamadas editoriais: `Libre Baskerville`.
- Texto, navegacao e microcopy: `Inter`.
- Assinatura manuscrita pontual: `Allura`, usada apenas na mensagem final do autor.
- Carregamento inicial usa Google Fonts com apenas pesos essenciais.

## Assets Prioritarios

- Hero principal: `public/assets/hero/fundo-livroHero-hq.png`.
  - Fundo claro de sala/palacio com colunas, marmore, pedestal e livro em pe a direita.
  - Area livre a esquerda para copy da Hero no desktop.
  - Deve ser usado sem edicao visual nesta etapa.
- Fundo limpo: `public/assets/hero/fundoHero-hq.png`.
  - Mesma sala sem o livro, util para secoes futuras ou composicoes alternativas.
- Logo: `public/assets/logo/logo.png`.
  - Marca do livro em PNG com transparencia, usada no Header.
- Mockups de livro: `public/assets/book/`.
  - Mockups finais usados na galeria da oferta: `livroEmPe.png`, `livroDeitado.png`, `livroDeitado2.png` e `livroDeitado3.png`.
- Universo do livro: `public/assets/universe/`.
  - Fundo vinho ornamentado e cartas em pergaminho usadas na segunda secao.
  - `fundo.png` deve ser o fundo principal da secao.
  - A ordem visual inicial do carrossel e: Cuco, Rei, Bobo, Trono, Mordomo, Guardas, Reino.
  - O item ativo inicial e `trono.png`.
- Leitura interativa: `public/assets/reading/`.
  - Paginas reais do trecho em PNG de alta qualidade a partir da pasta raiz `reading/`.
  - Arquivos atuais, na ordem do leitor: `reading-trono-hq.png`, `reading-intro-hq.png`, `reading-cap1-hq.png` e `reading-o-trono-das-decisoes-hq.png`.
  - A secao usa `page-flip` para folhear as paginas por imagem, com fallback horizontal por swipe caso a biblioteca nao carregue.
- Autor: `public/assets/author/`.
  - `autor.jpg` e usado como retrato principal na secao Sobre o autor.
  - `familia.jpg` e usado como imagem menor sobreposta ao retrato principal.
  - Referencias de proporcao ficam na pasta raiz `refAutor/` e nao sao assets de producao.
- Oferta de pre-venda: `public/assets/book/`.
  - Usa os mockups reais do livro em galeria com imagem principal e miniaturas.
  - Referencias visuais ficam em `livromockup/esquerda.png` e `livromockup/direita.png`, mantidas fora de `public`.
- Mensagem final do autor:
  - Faixa compacta em fundo vinho texturizado usando `public/assets/universe/fundo.png`.
  - Sem imagem, sem card e sem CTA; funciona como fechamento editorial breve antes do rodape.
- Rodape:
  - Bloco final em vinho texturizado com logo, informacoes institucionais, links rapidos e redes sociais em icones.
  - O copyright fica separado por uma linha fina dourada no rodape inferior.

## Decisoes Tecnicas Iniciais

- Projeto estatico com HTML, CSS modular e JavaScript simples.
- Sem React nesta etapa.
- Sem Vite por enquanto: a pagina abre diretamente em `index.html` e tambem roda por servidor estatico simples.
- CSS separado por tokens, base, layout, componentes e secoes.
- JavaScript dividido entre inicializacao, UI de menu e animacoes leves.
- Assets copiados para `public/assets/` mantendo os arquivos originais nas pastas recebidas.

## Direcao da Hero

- Desktop: Header no topo, logo a esquerda, navegacao e CTA a direita. Hero com texto a esquerda e imagem `fundo-livroHero-hq.png` preenchendo a composicao, preservando o livro a direita.
- Mobile: Header compacto com logo e botao de menu. Imagem do livro aparece acima do texto, seguida da copy e CTAs empilhados.
- Copy provisoria do PRD deve ser mantida sem inventar novas secoes.
- CTAs: primario vinho com texto claro; secundario contornado com dourado/vinho.
- Microcopy: "Compra segura pelo Mercado Pago."

## Observacoes Futuras

- As proximas secoes devem continuar usando os tokens ja criados em `src/styles/tokens.css`.
- O visual deve permanecer limpo e editorial, com animacoes discretas de fade-in e hover suave.
- Evitar excesso de ornamentos, sombras pesadas e composicao escura.
- A segunda secao muda a atmosfera para vinho escuro, mas deve continuar premium/editorial e usar as cartas como imagens reais, sem recriacao em HTML.
- A terceira secao retoma a base clara/papel e deve priorizar leitura, proporcao do livro aberto e controles simples.
- A quarta secao apresenta o autor com retrato principal, imagem familiar sobreposta e texto editorial, sem cards de credenciais.
- A quinta secao apresenta a oferta de pre-venda com layout editorial claro: mockups do livro a esquerda, copy/preco/CTA a direita, sem checklist e sem cara de checkout.
- A mensagem final do autor deve permanecer como faixa horizontal compacta, aproximadamente um terco da altura das secoes principais.
- O rodape deve fechar a pagina como um bloco compacto e funcional, sem parecer uma nova secao alta.
