# Implementar Seção 2 — Universo do Livro / Slideshow Interativo

Agora vamos implementar a **Seção 2** da landing page do livro **O Trono das Decisões**.

A Hero já foi estruturada anteriormente. Nesta etapa, implemente **apenas a segunda seção**, mantendo a organização do projeto e reutilizando os arquivos/documentos já criados.

---

## 1. Antes de implementar

Leia primeiro:

```txt
docs/PROJECT_CONTEXT.md
docs/ASSET_MANIFEST.md
```

Use esses arquivos como fonte principal de contexto para não reler todos os assets pesados.

Se precisar localizar os assets novos desta seção, procure na pasta de imagens/refs/assets por arquivos relacionados a:

- fundo vinho/vermelho da seção;
- carta O Rei;
- carta O Trono;
- carta O Reino;
- carta O Mordomo;
- carta O Bobo da Corte;
- carta O Cuco;
- carta Os Guardas do Palácio.

Não recrie as imagens. Use os assets prontos.

---

## 2. Objetivo da seção

Criar a seção **“Universo do Livro”**, com um slideshow/carrossel interativo apresentando os símbolos centrais da obra.

Essa seção deve gerar:

- curiosidade;
- atmosfera;
- profundidade simbólica;
- conexão com o conceito do livro;
- sensação premium/editorial.

A base conceitual vem da introdução do livro:

> Existe um trono interior, centro das escolhas, prioridades e direções. Esse trono jamais fica vazio.

---

## 3. Direção visual

A seção deve seguir a estética do mockup visual de referência criado para o carrossel:

- fundo vinho escuro/profundo;
- textura sutil;
- detalhes dourados ornamentais;
- visual editorial;
- cartas em pergaminho;
- sensação de livro antigo/premium;
- centro em destaque;
- laterais com redução de escala, opacidade e leve blur;
- nada com aparência de template genérico.

Use como fundo principal o asset vermelho/vinho com ornamentos dourados que está na pasta de assets.

Se houver mais de uma versão de fundo, escolha a que tem:

- vinho escuro;
- textura elegante;
- ornamentos dourados nos cantos;
- área central livre para as cartas.

---

## 4. Copy da seção

Título da seção:

```txt
O universo por trás de cada decisão
```

Subtítulo:

```txt
Toda escolha nasce em um reino invisível.
E tudo no reino revela quem está no governo.
```

Pode adicionar uma pequena eyebrow acima do título:

```txt
UNIVERSO DO LIVRO
```

---

## 5. Itens do slideshow

Use exatamente estes itens:

### 01. O REI

```txt
Todo reino revela a grandeza do seu Rei.
Por isso, o Criador é o único capaz de conduzir a história segundo o seu verdadeiro propósito.
```

### 02. O TRONO

```txt
O trono não cria decisões.
Ele apenas revela quem realmente governa o reino.
```

### 03. O REINO

```txt
Todo reino carrega as marcas de quem o governa.
Assim também é a nossa vida.
```

### 04. O MORDOMO

```txt
O mordomo não é lembrado pelas decisões que tomou, mas pela fidelidade com que executou as decisões do Rei.
```

### 05. O BOBO DA CORTE

```txt
O bobo não precisa de autoridade para influenciar.
Às vezes, basta uma palavra distorcida no momento certo para mudar o rumo de um reino.
```

### 06. O CUCO

```txt
O cuco não chama atenção para si.
Ele apenas lembra, no tempo certo, aquilo que jamais deveria ser esquecido.
```

### 07. OS GUARDAS DO PALÁCIO

```txt
Os melhores guardas não protegem apenas portas.
```

---

## 6. Ordem inicial do carrossel

A seção deve iniciar com **O TRONO** no centro.

A ordem visual inicial deve ser:

```txt
O CUCO
O REI
O BOBO DA CORTE
O TRONO
O MORDOMO
OS GUARDAS DO PALÁCIO
O REINO
```

O item ativo inicial é:

```txt
02. O TRONO
```

---

## 7. Uso das imagens das cartas

Como já existem cartas prontas separadas, use essas imagens diretamente no carrossel.

Não redesenhe as cartas em HTML neste momento.

As cartas devem ser usadas como assets visuais, por exemplo:

```html
<img src="/assets/universe/card-rei.png" alt="Carta O Rei" />
```

Adapte os nomes reais dos arquivos conforme o que existir no projeto.

Importante:

- não recortar texto das cartas;
- não aplicar filtros que prejudiquem a leitura;
- não distorcer proporção;
- manter sombra e escala premium;
- manter boa resolução.

Para acessibilidade, mesmo usando imagem com texto embutido, adicione conteúdo textual escondido com classe `.sr-only` ou `aria-label` descrevendo o card.

---

## 8. Layout desktop

No desktop, o slideshow deve ter a aparência de um carrossel 3D/editorial, mas implementado com CSS simples.

Características:

- seção full width;
- fundo vinho cobrindo toda a seção;
- título e subtítulo centralizados no topo;
- cartas posicionadas horizontalmente;
- carta ativa grande no centro;
- cartas laterais diminuem gradativamente;
- cartas mais distantes ficam com menor opacidade e leve blur;
- setas laterais para navegar;
- dots abaixo das cartas;
- miniaturas inferiores opcionais, se ficar elegante;
- transição suave entre os estados.

Exemplo de comportamento visual:

```txt
far-left: scale(.72), opacity(.35), blur(2px)
left: scale(.84), opacity(.65), blur(1px)
near-left: scale(.94), opacity(.9), blur(0)
active: scale(1.08), opacity(1), blur(0), z-index alto
near-right: scale(.94), opacity(.9), blur(0)
right: scale(.84), opacity(.65), blur(1px)
far-right: scale(.72), opacity(.35), blur(2px)
```

A carta ativa deve parecer em destaque, com:

- sombra mais forte;
- leve glow dourado;
- z-index maior;
- scale maior;
- nitidez total.

---

## 9. Layout mobile

No mobile, use carrossel horizontal com scroll/swipe.

Características:

- título centralizado;
- subtítulo legível;
- cards ocupando quase a tela inteira;
- `scroll-snap-type: x mandatory`;
- cada carta com `scroll-snap-align: center`;
- botões e dots funcionando;
- sem miniaturas se ficar apertado;
- boa legibilidade;
- espaçamento confortável;
- sem overflow vertical estranho.

No mobile, a ordem inicial ainda deve começar com **O TRONO** visível primeiro, se tecnicamente simples. Se for complexo, mantenha a ordem natural, mas garanta que o JS faça scroll até o card **O TRONO** ao carregar.

---

## 10. Arquivos a criar/alterar

Mantenha a arquitetura separada.

Crie ou edite:

```txt
src/styles/sections/universe.css
src/js/universe-carousel.js
```

Importe o CSS em:

```txt
src/styles/main.css
```

Importe o JS em:

```txt
src/js/main.js
```

Se já existir outro padrão de organização no projeto, siga o padrão existente.

Não coloque tudo em `main.css`.

Não coloque todo o JS dentro do HTML.

---

## 11. Estrutura HTML sugerida

Adicione a seção depois da Hero:

```html
<section class="universe-section" id="universo-do-livro" aria-labelledby="universe-title">
  <div class="universe-section__bg" aria-hidden="true"></div>

  <div class="container universe-section__container">
    <header class="universe-section__header">
      <span class="section-eyebrow">Universo do livro</span>
      <h2 id="universe-title">O universo por trás de cada decisão</h2>
      <p>
        Toda escolha nasce em um reino invisível.<br />
        E tudo no reino revela quem está no governo.
      </p>
    </header>

    <div class="universe-carousel" data-universe-carousel>
      <button class="universe-carousel__arrow universe-carousel__arrow--prev" type="button" aria-label="Ver item anterior">
        ‹
      </button>

      <div class="universe-carousel__track">
        <!-- cards aqui -->
      </div>

      <button class="universe-carousel__arrow universe-carousel__arrow--next" type="button" aria-label="Ver próximo item">
        ›
      </button>
    </div>

    <div class="universe-carousel__dots" aria-label="Navegação do slideshow"></div>
  </div>
</section>
```

Pode ajustar a estrutura se necessário, desde que mantenha semântica, responsividade e organização.

---

## 12. Estados do carrossel

Implemente via JS classes dinâmicas, por exemplo:

```css
.is-active
.is-near
.is-side
.is-far
```

O JS deve:

- controlar índice ativo;
- iniciar com o item “O TRONO”;
- avançar;
- voltar;
- atualizar dots;
- atualizar `aria-current`;
- permitir clique em cards laterais para ativar;
- permitir swipe/scroll no mobile;
- não quebrar se alguma imagem não carregar.

---

## 13. Acessibilidade

Cada card deve ter:

- `alt` descritivo;
- texto acessível com título e descrição;
- botão/setas com `aria-label`;
- dots com `aria-label`;
- estado ativo com `aria-current="true"` quando aplicável.

Exemplo:

```html
<article class="universe-card" aria-label="O Trono: O trono não cria decisões. Ele apenas revela quem realmente governa o reino.">
  <img src="..." alt="Carta O Trono" />
</article>
```

---

## 14. Design tokens

Use as variáveis já existentes em `tokens.css`.

Se precisar adicionar tokens novos, adicione apenas o necessário, por exemplo:

```css
--section-wine-bg: #23090D;
--section-wine-soft: #3A0F16;
--section-gold-border: rgba(176, 138, 69, 0.58);
--section-card-glow: 0 0 34px rgba(217, 190, 121, 0.22);
```

Não crie cores soltas espalhadas no CSS.

---

## 15. Motion e acabamento

Use animações leves:

- fade-in ao entrar na tela;
- transição suave entre cards;
- hover discreto nos cards laterais;
- glow sutil no card ativo;
- nada exagerado.

Evite:

- rotação 3D muito forte;
- animação pesada;
- loop infinito chamativo;
- elementos pulando;
- excesso de blur.

---

## 16. Skill Impeccable

Use a skill **impeccable** para revisar a UI desta seção, especialmente:

- composição do carrossel;
- hierarquia visual;
- espaçamentos;
- responsividade;
- refinamento premium;
- consistência com a identidade visual do projeto.

A seção deve parecer parte da mesma landing da Hero, porém com mudança de atmosfera para o vinho escuro.

---

## 17. O que NÃO fazer

Não implemente outras seções.

Não altere drasticamente a Hero.

Não refaça os assets.

Não tente gerar imagens novas.

Não substitua as cartas por cards genéricos.

Não use biblioteca pesada de carousel.

Não coloque CSS novo dentro de um arquivo global gigante.

Não use React.

Não invente copy nova.

Não use estética medieval/RPG além dos símbolos já aprovados.

---

## 18. Critério de aceite

A implementação estará correta se:

- a seção estiver logo abaixo da Hero;
- o fundo vinho estiver aplicado corretamente;
- o título e subtítulo estiverem centralizados e elegantes;
- o carrossel iniciar com **O TRONO** no centro;
- as cartas laterais aparecerem com escala/opacidade/blur progressivo;
- as setas funcionarem;
- os dots funcionarem;
- no mobile o usuário conseguir deslizar horizontalmente;
- os assets das cartas forem usados sem distorção;
- o CSS estiver em arquivo separado;
- o JS estiver em arquivo separado;
- a seção estiver visualmente próxima do mockup aprovado;
- a experiência parecer premium, editorial e simbólica.

Implemente agora somente esta seção.
