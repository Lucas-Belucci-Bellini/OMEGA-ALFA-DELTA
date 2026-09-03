# Auditoria — estacao-pc

> Fase A do ciclo: **leitura e medição, sem alterar código**.
> Verificação em Chromium via Playwright, com a rede bloqueada, nos viewports
> 390×844, 820×1180 e 1440×900.

## 1. O que foi conferido

| Item | Resultado |
| --- | --- |
| `css/style.css`, `js/script.js` e as duas imagens existem e carregam | ✅ |
| Erros de JavaScript | ✅ nenhum |
| Overflow horizontal | ✅ nenhum nos três tamanhos |
| Âncoras do menu (`#componentes`, `#montagem`, `#aprenda`) | ✅ todas têm destino |
| Abas de perfil (clique) | ✅ trocam código, título, descrição e as quatro peças |
| Só uma aba marcada por vez | ✅ |
| Imagens com `alt` descritivo | ✅ as duas |
| Link externo em nova aba | ✅ com `rel="noopener noreferrer"` |
| `<meta name="description">` | ✅ já existia |

## 2. Defeitos encontrados

### 🔴 D1 — No celular, o menu não fecha quando se clica em um link dele

Mesmo defeito dos outros dois projetos com menu: o botão ☰ alterna a classe
`menu-open` e nada trata o clique nos links de dentro.

**Medido:** depois de clicar em `#main-nav a[href="#componentes"]` a 390px,
`#main-nav` continua visível.

### 🔴 D2 — As abas prometem um comportamento de teclado que não existe

**Onde:** `index.html`, `<div class="build-tabs" role="tablist">` com três
`<button role="tab" aria-selected="…">`.

`role="tab"` não é decoração: é um **contrato**. Quem usa leitor de tela ouve
"aba, selecionada, 1 de 3" e sabe o que isso significa — que as setas do teclado
navegam entre as abas, que só a aba ativa está na ordem de tabulação e que existe
um painel associado a cada uma. Nada disso está implementado:

**Medido:**

| O que o `role="tab"` promete | O que existe |
| --- | --- |
| Setas ← → trocam de aba | ✅ nada acontece ao apertar → |
| `aria-controls` ligando aba e painel | `null` |
| `role="tabpanel"` no painel | `null` |
| Só a aba ativa na ordem de tabulação | as três estão |

O resultado é pior do que não ter ARIA nenhum: a pessoa recebe a instrução de
usar as setas, tenta, nada acontece, e precisa descobrir sozinha que o Tab
continua funcionando.

**Duas saídas honestas, e a escolhida:**

1. **Implementar o contrato inteiro** — setas, `tabindex` móvel, `aria-controls`,
   `role="tabpanel"`. Ensina um padrão real, mas acrescenta bastante código de
   acessibilidade a um projeto cujo objetivo é ensinar HTML, CSS e JS básicos.
2. **Dizer a verdade sobre o que os elementos são** — eles são três botões que
   trocam o conteúdo de um painel, e funcionam perfeitamente com Tab e Enter.
   Trocando `role="tab"`/`aria-selected` por `aria-pressed`, o leitor de tela
   anuncia "botão, pressionado", que é exatamente o que está acontecendo, sem
   prometer teclas que não existem.

**Escolhida a 2.** O projeto é educacional e a orientação do repositório é usar
ARIA só quando ele é necessário de verdade. Um `aria-pressed` correto vale mais
que um `role="tab"` pela metade.

### 🟡 D3 — A mesma fonte é pedida duas vezes

**Onde:** `css/style.css` linha 1 (`@import url('https://fonts.googleapis.com/…')`)
**e** `index.html` linha 11 (`<link rel="stylesheet" href="https://fonts.googleapis.com/…">`).

É exatamente a mesma URL nos dois lugares.

**Medido:** ao abrir a página, saem **duas requisições idênticas** para
`fonts.googleapis.com`.

O `@import` é o pior dos dois: o navegador só descobre que precisa da fonte
**depois** de baixar e começar a interpretar o CSS, então o pedido sai atrasado e
o texto demora mais para aparecer no tipo certo. O `<link>` do HTML, além de sair
antes, já vem acompanhado dos dois `preconnect`.

### 🟢 D4 — A numeração das peças quebra a partir do décimo item

**Onde:** `js/script.js`, `renderProfile()`: `` `0${index + 1}` ``.

Com quatro peças, o resultado é "01" a "04" e está certo. Com dez, sairia "010".
Hoje nenhum perfil chega lá — mas acrescentar peças é justamente um dos
exercícios sugeridos no README, então o aluno esbarraria nisso.

## 3. O que **não** é defeito (conferido e descartado)

- **`partsList.innerHTML` com template string.** Os dados vêm de um objeto fixo
  no próprio arquivo, sem entrada de usuário. É a forma mais legível para o
  objetivo didático.
- **Não há guarda `[hidden]` no CSS.** O projeto não usa o atributo `hidden`; a
  troca de perfil reescreve o conteúdo do painel. A regra não protegeria nada.
- **As duas imagens não têm `width`/`height` no HTML.** O CSS define as duas
  dimensões, então não há salto de layout.

## 4. Plano de correção

| Defeito | Ação | Fase |
| --- | --- | --- |
| D1 | Fechar o menu ao clicar em um link dele | B (funcional) |
| D2 | Trocar o `role="tab"` incompleto por `aria-pressed` em botões | G (acessibilidade) |
| D3 | Remover o `@import` do CSS e manter só o `<link>` do HTML | H (performance) |
| D4 | Numerar com `padStart(2, "0")` em vez de concatenar um zero | E (JavaScript) |
