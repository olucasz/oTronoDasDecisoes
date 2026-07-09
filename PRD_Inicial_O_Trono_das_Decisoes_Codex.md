# PRD Inicial — Landing Page “O Trono das Decisões”

Este documento deve ser usado como prompt inicial para o Codex iniciar o projeto da landing page de vendas do livro **O Trono das Decisões**, de **Mateus Chaves Generoso**.

O objetivo desta etapa **não é construir a landing page inteira agora**.

O objetivo inicial é:

1. Ler e entender todos os arquivos da pasta do projeto.
2. Organizar a estrutura base do projeto.
3. Criar uma base técnica limpa, escalável e bem separada.
4. Preparar o ambiente para desenvolver a landing seção por seção.
5. Começar pela estrutura da Hero e do Header base, sem inventar copy final além do necessário.

---

## 1. Contexto do projeto

Você está trabalhando no projeto da landing page de vendas do livro **O Trono das Decisões**, de Mateus Chaves Generoso.

Esta será uma landing page simples, estática, premium, editorial, cristã, simbólica e mobile first para a pré-venda do livro.

A estética deve seguir o material de referência presente na pasta do projeto, incluindo:

- imagens do livro;
- mockups;
- fundos da Hero;
- manual de identidade visual;
- referências de composição;
- assets visuais;
- possíveis imagens do autor;
- qualquer arquivo de documentação existente.

A identidade visual do projeto deve transmitir:

- maturidade;
- autoridade;
- reverência;
- discernimento;
- sobriedade;
- elegância;
- atmosfera cristã;
- visual editorial premium.

Evite qualquer estética de:

- RPG;
- fantasia medieval exagerada;
- infoproduto genérico;
- landing agressiva de venda;
- template comum;
- excesso de animação;
- visual pesado.

A página deve parecer uma peça editorial refinada, como uma landing de lançamento de um livro premium.

---

## 2. Leitura inicial dos arquivos

Antes de criar ou alterar arquivos, faça uma leitura estratégica da pasta do projeto.

Você deve identificar:

- quais imagens são fundos;
- quais imagens são mockups do livro;
- quais imagens são referências visuais;
- quais arquivos são documentos de marca;
- quais arquivos são assets utilizáveis na landing;
- quais arquivos são apenas referência;
- quais cores, fontes e elementos visuais aparecem no manual de identidade;
- quais arquivos devem ser usados prioritariamente na Hero.

Depois dessa leitura, crie o arquivo:

```txt
docs/PROJECT_CONTEXT.md
```

Esse arquivo deve resumir o contexto do projeto para que você não precise reler todos os assets e documentos a cada nova tarefa.

Inclua nele:

- resumo da identidade visual;
- paleta de cores;
- tipografias sugeridas;
- assets principais encontrados;
- quais imagens devem ser usadas na Hero;
- decisões técnicas iniciais;
- observações importantes para desenvolvimento futuro.

Também crie:

```txt
docs/ASSET_MANIFEST.md
```

Esse arquivo deve listar os principais assets encontrados, com uma descrição curta de uso provável.

Exemplo:

```md
## Hero

- `assets/hero/bg-hero-desktop.png` — fundo principal desktop com sala clássica.
- `assets/book/book-mockup.png` — mockup do livro em pé.
```

Importante: depois de criar esses arquivos, use-os como referência principal nas próximas etapas para economizar contexto. Só releia arquivos pesados se for realmente necessário.

---

## 3. Stack técnica

Use uma estrutura simples, performática e fácil de manter.

Preferência:

- HTML;
- CSS modularizado;
- JavaScript simples;
- Vite apenas se for útil para organização, build e desenvolvimento local.

Não use React nesta etapa, a menos que exista um motivo técnico muito forte. A landing é simples e deve carregar rápido.

Pode usar bibliotecas somente se realmente ajudarem no design ou na experiência, por exemplo:

- biblioteca leve para animações on-scroll;
- biblioteca leve para carrossel futuramente;
- biblioteca de ícones, se necessário.

Nesta primeira etapa, priorize CSS e JavaScript nativos.

---

## 4. Organização obrigatória dos arquivos

Não crie um único arquivo CSS enorme.

Crie uma estrutura organizada desde o início.

Estrutura sugerida:

```txt
/
├── index.html
├── package.json
├── README.md
├── docs/
│   ├── PROJECT_CONTEXT.md
│   └── ASSET_MANIFEST.md
├── public/
│   └── assets/
│       ├── hero/
│       ├── book/
│       ├── author/
│       ├── icons/
│       └── references/
└── src/
    ├── js/
    │   ├── main.js
    │   ├── animations.js
    │   └── ui.js
    └── styles/
        ├── main.css
        ├── tokens.css
        ├── base.css
        ├── layout.css
        ├── components/
        │   ├── buttons.css
        │   ├── header.css
        │   └── cards.css
        └── sections/
            └── hero.css
```

Se a estrutura atual já existir, adapte sem quebrar nada.

---

## 5. Design tokens

Crie o arquivo:

```txt
src/styles/tokens.css
```

Com variáveis globais para:

- cores;
- tipografia;
- espaçamentos;
- border-radius;
- sombras;
- z-index;
- transições;
- largura máxima do container.

Use os valores encontrados no manual de marca. Caso precise de fallback, use:

```css
:root {
  --color-paper: #F8F3EB;
  --color-off-white: #FCFAF6;
  --color-wine: #311117;
  --color-wine-deep: #18080B;
  --color-wine-cta: #43151D;
  --color-wine-hover: #5B1D29;
  --color-gold: #B28B43;
  --color-gold-light: #D9BE79;
  --color-text: #2D2D2D;
  --color-muted: #5F5F5F;
  --color-border: #E9DDCC;
}
```

Tipografia sugerida:

- títulos: `Cormorant Garamond`;
- subtítulos: `Libre Baskerville`;
- texto: `Inter`.

Pode usar Google Fonts no `index.html`, mas carregue apenas os pesos necessários.

---

## 6. Hero inicial

Nesta primeira etapa, implemente apenas a Hero e o Header base.

A Hero deve seguir as referências visuais da pasta:

- fundo clássico claro;
- ambiente de palácio/sala com colunas;
- livro em pé à direita no desktop;
- área livre à esquerda para texto;
- composição premium;
- muito respiro;
- visual limpo;
- sem exagero de ornamentos.

No desktop:

- header no topo;
- logo à esquerda;
- menu à direita;
- botão “Garantir meu exemplar”;
- texto da Hero à esquerda;
- imagem/fundo com o livro à direita.

No mobile:

- logo no topo;
- botão/menu simplificado;
- imagem do livro acima ou no topo da Hero;
- texto abaixo;
- CTAs empilhados;
- tudo legível e confortável.

Use a imagem de fundo/mockup disponível nos assets da Hero.

Não recrie nem altere visualmente as imagens nesta etapa.

---

## 7. Copy provisória da Hero

Use esta copy provisória apenas para estruturar o layout:

```txt
Pré-venda oficial

O Trono das Decisões

O trono nunca fica vazio.
A questão é: quem está sentado nele?

Suas escolhas não nascem no vazio. Elas revelam o que governa seus pensamentos, seus impulsos e os caminhos que você decide seguir.

Um livro sobre decisões, propósito e discernimento espiritual para quem deseja viver com mais clareza diante de Deus.

[Garantir meu exemplar]
[Ler um trecho]

Compra segura pelo Mercado Pago.
```

Não escreva outras seções ainda.

---

## 8. Skill Impeccable

Quando for tomar decisões de UI, composição, refinamento visual, hierarquia, espaçamento, responsividade ou acabamento premium, utilize a skill **impeccable**, que já está instalada neste ambiente.

Use essa skill principalmente para:

- revisar a composição da Hero;
- evitar aparência genérica;
- melhorar espaçamentos;
- avaliar hierarquia visual;
- garantir acabamento premium;
- validar responsividade;
- manter consistência visual com a identidade do livro.

Não use a skill para reescrever o PRD inteiro.

Use a skill apenas para decisões de design e revisão visual.

---

## 9. Regras de qualidade

Siga obrigatoriamente:

- mobile first;
- HTML semântico;
- CSS bem separado;
- nada de CSS gigante global;
- evitar IDs desnecessários;
- classes claras e consistentes;
- componentes reutilizáveis;
- boa performance;
- imagens otimizadas;
- `alt` em imagens importantes;
- botões acessíveis;
- contraste adequado;
- layout responsivo;
- sem dependências pesadas sem justificativa;
- visual premium;
- composição limpa;
- hierarquia tipográfica clara.

---

## 10. O que NÃO fazer agora

Não implemente a landing inteira.

Não crie as próximas seções ainda.

Não invente copy final.

Não invente checkout próprio.

Não adicione formulário de pagamento.

Não use elementos de fantasia medieval exagerada.

Não use animações pesadas.

Não misture todos os estilos em um único arquivo.

Não ignore os assets e documentos enviados.

Não reinterprete a identidade visual de forma radical.

Não tente criar uma landing genérica.

---

## 11. Entregáveis desta etapa

Ao finalizar, entregue:

1. Estrutura organizada do projeto.
2. `docs/PROJECT_CONTEXT.md`.
3. `docs/ASSET_MANIFEST.md`.
4. `src/styles/tokens.css`.
5. Arquivos base de CSS separados.
6. Header inicial.
7. Hero inicial responsiva.
8. README com instruções de execução local.


---

## 12. Critério de aceite

A tarefa estará correta se:

- o projeto estiver organizado;
- a Hero estiver visualmente próxima das referências;
- o fundo e o livro estiverem bem posicionados;
- o texto estiver legível;
- o layout funcionar bem em desktop e mobile;
- os arquivos estiverem separados;
- o Codex tiver criado documentação interna para não precisar reler tudo sempre;
- a base estiver pronta para receber as próximas seções em prompts futuros;
- o design estiver premium, limpo e coerente com a identidade do livro;
- a implementação não estiver presa em um único CSS global enorme.

Comece fazendo a leitura dos arquivos e criando os documentos de contexto antes de implementar a Hero.
