# Implementar Seção 3 — Leitura Interativa

Implemente agora **apenas a Seção 3** da landing page: **Leitura Interativa**.

A Seção 2 já está funcionando e aprovada. Não altere a Hero nem a Seção 2, exceto se precisar apenas ajustar âncoras/links internos.

---

## Objetivo

Criar uma seção clara, premium e editorial onde o visitante possa visualizar um trecho real do livro com efeito de página virando.

A composição deve seguir a referência aprovada:

- fundo claro/off-white, igual ou muito próximo da Hero;
- texto editorial à esquerda;
- livro/leitor interativo à direita;
- bastante respiro, mas sem exagerar na altura vertical;
- layout equilibrado dentro da viewport desktop;
- visual limpo, nobre e coerente com a identidade do projeto.

---

## Biblioteca

Use a biblioteca **page-flip** / **StPageFlip** para o efeito de virar página.

Instale:

```bash
npm install page-flip
```

Use a lib para carregar páginas por imagem.

Não use DearFlip.  
Não use iframe de PDF.  
Não embedar PDF diretamente.  
Não usar biblioteca pesada.

---

## Assets

Use imagens renderizadas das páginas do livro, em `.png` de alta qualidade, dentro de:

```txt
public/assets/reading/
```

Estrutura esperada:

```txt
public/assets/reading/reading-trono-hq.png
public/assets/reading/reading-intro-hq.png
public/assets/reading/reading-cap1-hq.png
public/assets/reading/reading-o-trono-das-decisoes-hq.png
```

Essas imagens serão as páginas do flipbook.

Caso os nomes estejam diferentes, localize no `ASSET_MANIFEST.md` ou na pasta de assets e ajuste os paths.

---

## Copy da seção

Eyebrow:

```txt
LEITURA INTERATIVA
```

Título:

```txt
Leia antes de decidir.
```

Texto:

```txt
As primeiras páginas de O Trono das Decisões apresentam a pergunta central desta obra:

quem realmente governa as escolhas que moldam a nossa vida?

Folheie um trecho da introdução e entre no coração da mensagem.
```

CTA:

```txt
Quero garantir meu exemplar
```

---

## Layout desktop

A seção deve ter duas colunas.

### Esquerda

- Eyebrow pequeno;
- título grande, mas menor e mais controlado que o da Hero;
- texto com boa leitura;
- frase principal em destaque;
- botão CTA vinho;
- pequenos itens de apoio opcionais, no máximo 3, com ícones discretos.

### Direita

- leitor com efeito flip usando `page-flip`;
- aparência de livro aberto;
- tamanho grande o suficiente para perceber as páginas;
- centralizado verticalmente em relação ao texto;
- setas e dots abaixo do leitor;
- não deixar o leitor pequeno demais.

---

## Proporção e espaçamento

A seção precisa ficar bem encaixada na tela.

Ajuste com atenção:

- reduzir gaps verticais exagerados;
- evitar título gigante;
- evitar respiros excessivos acima e abaixo;
- manter o conteúdo principal visível dentro de uma viewport desktop comum;
- deixar o livro como elemento principal do lado direito;
- manter o texto da esquerda elegante e compacto.

Use uma altura mínima controlada, algo próximo de:

```css
min-height: calc(100vh - var(--header-height));
```

Mas sem forçar corte de conteúdo.

---

## Layout mobile

No mobile:

- manter fundo claro;
- título e copy primeiro;
- leitor abaixo;
- usar o `page-flip` em modo portrait, se ficar estável;
- caso fique ruim, criar fallback simples com swipe horizontal das imagens;
- CTA logo abaixo do leitor;
- reduzir espaçamentos para a seção não ficar longa demais.

---

## Arquivos

Crie ou edite:

```txt
src/styles/sections/reading.css
src/js/reading-viewer.js
```

Importe o CSS em:

```txt
src/styles/main.css
```

Importe o JS em:

```txt
src/js/main.js
```

Não colocar tudo no CSS global.  
Não colocar JS inline no HTML.

---

## Configuração sugerida do PageFlip

Use uma configuração leve e responsiva, ajustando conforme necessário:

```js
new PageFlip(element, {
  size: "stretch",
  width: 520,
  height: 720,
  minWidth: 300,
  maxWidth: 760,
  minHeight: 420,
  maxHeight: 920,
  drawShadow: true,
  flippingTime: 700,
  usePortrait: true,
  startZIndex: 1,
  autoSize: true,
  maxShadowOpacity: 0.25,
  showCover: false,
  mobileScrollSupport: false
});
```

Ajuste valores para ficar visualmente proporcional ao layout.

---

## Acessibilidade e performance

- usar `alt` descritivo nas imagens;
- lazy load nas imagens que não forem iniciais;
- manter CTA acessível;
- não bloquear scroll no mobile;
- não carregar assets desnecessários;
- não criar animações pesadas.

---

## Critério de aceite

A seção estará correta se:

- aparecer logo abaixo da Seção 2;
- tiver fundo claro e composição limpa;
- texto ficar à esquerda no desktop;
- leitor ficar à direita no desktop;
- o efeito de virar página funcionar;
- o layout não ficar alto demais nem com gaps exagerados;
- o livro/leitor tiver presença visual forte;
- no mobile a experiência continuar estável;
- o CSS e JS estiverem separados;
- a seção parecer premium, editorial e coerente com a identidade já aprovada.

Implemente somente esta seção.
