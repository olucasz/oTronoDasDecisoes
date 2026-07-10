# Implementar Modal de Pré-checkout — O Trono das Decisões

Implemente o modal de pré-checkout da landing page **“O Trono das Decisões”**.

A landing já está pronta. Não refaça o site. Não altere o layout das seções, exceto para fazer todos os botões de compra abrirem este modal.

---

## Objetivo

Quando o usuário clicar no botão de compra da section de offer, como:

- “Comprar na pré-venda”

deve abrir um modal de pré-checkout em 2 passos.

O modal deve seguir exatamente a direção visual da referência aprovada: premium, clean, editorial, off-white, vinho escuro, dourado discreto, bordas arredondadas e aparência institucional.

Não deve parecer checkout genérico, loja virtual ou infoproduto.

---

## Estrutura visual do modal

### Desktop

Modal centralizado com overlay escuro translúcido por trás.

Layout em duas colunas.

### Coluna esquerda

- fundo visual com imagem do livro;
- logo oficial “O Trono das Decisões” no topo;
- texto pequeno “PRÉ-VENDA OFICIAL”;
- mockup do livro centralizado;
- estética igual à hero: fundo claro, palácio/livro, sombra suave;
- essa coluna é apenas visual e pode ser ocultada ou simplificada no mobile.

### Coluna direita

Conteúdo do formulário.

Topo:

- indicador “PASSO 1 DE 2” ou “PASSO 2 DE 2”;
- progress indicator simples com 2 bolinhas/linha;
- botão de fechar no canto superior direito.

---

## Passo 1 — Seus dados e entrega

Título:

```txt
Seus dados e entrega
```

Subtítulo:

```txt
Preencha seus dados para continuar sua pré-venda.
```

Campos:

### Nome completo

Placeholder:

```txt
Digite seu nome completo
```

### WhatsApp / Celular

Placeholder:

```txt
(00) 00000-0000
```

Aplicar máscara para telefone brasileiro.

### Forma de envio

Criar 3 opções em formato de cards/radio buttons.

#### Retirar no Julho para Jesus

Texto pequeno:

```txt
Sem custo de frete
```

#### Receber em casa

Texto pequeno:

```txt
Com frete
```

#### Retirar com o autor

Texto pequeno:

```txt
Sem custo de frete
```

Quando a opção **“Receber em casa”** estiver selecionada, exibir bloco de endereço.

Campos do endereço:

- CEP
- Rua
- Número
- Complemento
- Bairro
- Cidade
- Estado

O bloco de endereço deve aparecer com transição suave e manter visual limpo.

Adicionar checkbox:

```txt
Autorizo o contato pelo WhatsApp para confirmação da pré-venda e entrega.
```

Botão do Passo 1:

```txt
CONTINUAR PARA O PASSO 2
```

---

## Passo 2 — Confirme seus dados

Título:

```txt
Confirme seus dados
```

Subtítulo:

```txt
Confira suas informações e finalize sua pré-venda.
```

Mostrar um card/resumo com:

- Nome
- WhatsApp
- Forma de envio
- Endereço, somente se a pessoa escolheu “Receber em casa”

Também mostrar um aviso:

```txt
Você será direcionado para o Mercado Pago para finalizar sua compra com segurança.
```

Botão principal:

```txt
IR PARA PAGAMENTO SEGURO
```

Microcopy abaixo:

```txt
Ambiente seguro do Mercado Pago
```

Adicionar botão/ícone de voltar para retornar ao Passo 1.

---

## Links Mercado Pago

Usar dois links como placeholders no código:

```js
const MERCADO_PAGO_LINK_SEM_FRETE = "#";
const MERCADO_PAGO_LINK_COM_FRETE = "#";
```

Regra:

- Retirar no Julho para Jesus → usar link sem frete
- Retirar com o autor → usar link sem frete
- Receber em casa → usar link com frete

Ao clicar em **“IR PARA PAGAMENTO SEGURO”**, o sistema deve selecionar automaticamente o link correto com base na forma de envio.

---

## Envio do formulário para o autor

Antes de redirecionar para o Mercado Pago, enviar os dados do formulário para um endpoint.

Não colocar token, senha de e-mail, SMTP ou chave secreta no front-end.

Criar uma função de envio preparada para um endpoint configurável:

```js
const PREORDER_ENDPOINT = "/api/preorder";
```

Enviar JSON com:

- nome completo
- WhatsApp
- forma de envio
- endereço, se existir
- link de pagamento selecionado
- data/hora
- página de origem
- user agent, se for simples obter
- status: “redirect_to_payment”

Fluxo:

1. Usuário preenche dados.
2. Usuário confirma no Passo 2.
3. Enviar dados para `PREORDER_ENDPOINT`.
4. Se o envio funcionar, redirecionar para o link correto do Mercado Pago.
5. Se o envio falhar, mostrar mensagem de erro simples e não redirecionar automaticamente.

Mensagem de erro:

```txt
Não foi possível registrar seus dados agora. Tente novamente em alguns instantes ou entre em contato pelo WhatsApp.
```

Caso o projeto seja apenas estático e ainda não tenha backend/serverless, deixe a integração preparada e documentada com comentários claros no código, sem inventar credenciais.

---

## Validações

No Passo 1:

- Nome obrigatório.
- WhatsApp obrigatório.
- Forma de envio obrigatória.
- Checkbox de autorização obrigatório.
- Se “Receber em casa” estiver selecionado, endereço obrigatório:
  - CEP
  - Rua
  - Número
  - Bairro
  - Cidade
  - Estado

Não avançar para o Passo 2 enquanto os dados obrigatórios não estiverem preenchidos.

Mostrar mensagens de erro pequenas e elegantes, abaixo dos campos.

---

## UX

- Clicar fora do modal pode fechar o modal, mas não se houver dados preenchidos sem confirmação.
- Botão ESC deve fechar o modal.
- Botão X deve fechar o modal.
- Ao abrir o modal, focar no primeiro campo.
- Travar o scroll do body enquanto o modal estiver aberto.
- Restaurar o scroll ao fechar.
- Manter acessibilidade básica:
  - `role="dialog"`
  - `aria-modal="true"`
  - labels corretos
  - navegação por teclado funcional

---

## Mobile

No mobile:

- modal ocupa quase toda a tela;
- layout em uma coluna;
- ocultar ou simplificar a coluna visual do livro;
- logo no topo;
- formulário abaixo;
- botões full width;
- campos grandes e confortáveis para toque;
- manter espaçamentos compactos;
- não deixar o modal estourar horizontalmente;
- permitir scroll interno se necessário.

---

## Visual

Seguir identidade do projeto:

- fundo off-white;
- vinho escuro nos botões;
- dourado envelhecido nos detalhes;
- textos em chumbo/vinho;
- bordas suaves;
- sombra premium;
- campos com borda discreta;
- cards de opção de envio com estado ativo em borda dourada/vinho;
- animações leves.

Não usar componentes com cara de Bootstrap genérico.

---

## Arquivos

Organize o código sem jogar tudo no global.

Criar, se fizer sentido:

```txt
src/styles/components/preorder-modal.css
src/js/preorder-modal.js
```

Importar nos arquivos principais do projeto.

Se a estrutura atual for diferente, adapte mantendo separação entre CSS e JS.

---

## Critério de aceite

A implementação estará correta quando:

- todos os botões de compra abrirem o modal;
- modal tiver Passo 1 e Passo 2;
- forma de envio controlar link com frete ou sem frete;
- endereço aparecer somente para “Receber em casa”;
- validações funcionarem;
- dados forem enviados para endpoint antes do redirecionamento;
- redirecionamento para Mercado Pago acontecer com o link correto;
- mobile estiver funcional e bonito;
- visual estiver alinhado com a referência aprovada;
- nenhuma seção da landing for quebrada.

Use a skill `uiux pro max` para revisar o acabamento visual do modal, principalmente proporção, espaçamento, hierarquia, campos, botões e responsividade.
