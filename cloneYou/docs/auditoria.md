# Auditoria — cloneYou

> Fase A do ciclo: **leitura e medição, sem alterar código**.
> Base: commit `23d9d60`. Verificação em Chromium via Playwright, viewports
> 390×844, 820×1180 e 1440×900.

## 1. O que foi conferido

| Item | Método | Resultado |
| --- | --- | --- |
| Arquivos referenciados existem | conferência de `href`/`src` no sistema de arquivos | ✅ `./css/style.css` e `./js/script.js` resolvem |
| Renderização dos cards | contagem no DOM | ✅ 12 cards, contador diz "12 vídeos" |
| Busca sem resultado | busca por termo inexistente | ✅ grade some, estado vazio aparece |
| Limpar busca | clique em "Limpar busca" | ✅ volta para 12 cards |
| Erros de JavaScript | `pageerror` do Chromium | ✅ nenhum |
| Overflow horizontal | `scrollWidth > clientWidth` | ✅ nenhum nos três tamanhos |
| Menu mobile | visibilidade por viewport | ✅ aparece só até 48rem |
| Atributo `hidden` | CSS | ✅ protegido por `[hidden] { display: none !important }` — sem ele, `display:grid`/`flex` venceriam o atributo |

O projeto está **funcional**. Os defeitos abaixo são reais, mas nenhum deles
impede a página de abrir.

## 2. Defeitos encontrados

### 🔴 D1 — O botão "Mais opções" (⋮) não funciona pelo teclado

**Onde:** `js/script.js`, handler de `keydown`.

**O que acontece:** o handler procura `event.target.closest(".video-card")`. Como
o botão ⋮ fica **dentro** do card, apertar Enter ou Espaço com o foco no botão
faz o `closest()` encontrar o card, chamar `preventDefault()` e **abrir o modal**.
O clique nativo do botão nunca acontece, então o aviso ("Mais opções para este
vídeo em breve") nunca aparece.

**Medido:** com foco no botão ⋮ e Enter → `modal aberto = true`, `toast = false`.
Com o mouse, o mesmo botão funciona. É um defeito que só atinge quem usa teclado.

### 🟡 D2 — Ao abrir o modal, o foco fica atrás dele

**Onde:** `js/script.js`, `openModal()`.

**O que acontece:** o modal aparece, mas o foco continua no card que está atrás
da sobreposição. Quem navega por teclado abre o modal e, ao apertar Tab, percorre
a página de trás em vez do conteúdo do modal.

**Medido:** após abrir por teclado, `document.activeElement` continua sendo o
`.video-card`, não um elemento dentro de `#video-modal`.

Relacionado: `closeModal()` roda a cada Escape, mesmo com o modal já fechado.
Hoje isso é inofensivo, mas passa a importar quando o fechamento devolver o foco.

### 🟡 D3 — A pasta `docs/` do cloneYou documenta outros três projetos

`docs/validacao-novos-projetos.md` registra a validação de `wiki-modern-warfare`,
`portfolio-talles` e `estacao-pc`. É documentação de três projetos morando dentro
de um quarto — exatamente o tipo de amarra invisível que a reorganização quer
desfazer. Cada projeto deve levar a sua própria validação.

> **Resolvido.** Cada um dos três absorveu a sua parte no próprio ciclo, e o
> arquivo compartilhado foi removido no fim do ciclo do `estacao-pc`, o último
> deles. O `cloneYou` ficou só com a documentação que é dele.

### 🟡 D4 — A página depende de internet para ficar completa

Três origens externas: as 12 miniaturas (Unsplash), os ícones (Font Awesome via
cdnjs) e a fonte Roboto (Google Fonts).

**Medido offline:** 14 requisições falham. O layout **não quebra** — `.video-card__thumb`
tem `aspect-ratio: 16/9` e `background-color`, então as miniaturas viram blocos
cinza do tamanho certo. Mas os ícones somem, e como vários botões são só ícone,
eles ficam visualmente vazios (o `aria-label` continua lá, então o leitor de tela
não é afetado).

Não é um defeito a "consertar" baixando 12 imagens para dentro do repositório —
isso engordaria o repositório, que já tem um problema de peso. É uma **limitação
que precisa estar escrita no README**.

### 🟢 D5 — `escapeHtml` não é aplicado em `video.image`

`createVideoCard()` escapa título, canal, duração e avatar, mas interpola
`video.image` cru dentro de `style="background-image: url('...')"`. Com o catálogo
fixo no próprio arquivo não há risco real hoje; é uma inconsistência que vale
corrigir enquanto o hábito está sendo ensinado.

### 🟢 D6 — Faltam `<meta name="description">` e um `<h1>` estável

A página tem `<h1 id="section-title">`, mas o texto dele muda com a busca
("Resultados para ..."). Funciona; só não há descrição para buscadores.

### 🟢 D7 — O teste do módulo opcional valida uma cópia da função

`opcionais/interacoes-video/tests/validate-comments.js` **reescreve** `addComment`
dentro do próprio teste em vez de importar a função real do módulo. Se o
`script.js` mudar, o teste continua passando. Ele ainda tem valor (confere se os
`id` que o JS procura continuam no HTML), mas essa parte não é uma garantia.

## 3. O que **não** é defeito (conferido e descartado)

- **Seletores repetidos no CSS** (`.searchbar`, `.brand__name`, `.sidebar__footer p`,
  `.sidebar__item.is-active`): não é duplicação. É o padrão de uma regra agrupada
  com as propriedades comuns seguida de uma regra específica. Está correto.
- **Miniaturas sem `alt`**: são `background-image` em CSS, que leitores de tela
  ignoram por definição; o card inteiro já tem `aria-label` com o título.
- **`state` global e catálogo no mesmo arquivo**: é proposital e didático. Não há
  motivo para introduzir módulos ou build em um projeto de estudo.

## 4. Plano de correção (o que a Fase B em diante vai fazer)

| Defeito | Ação | Fase |
| --- | --- | --- |
| D1 | Exigir que o alvo do teclado seja o próprio card | B (funcional) |
| D2 | Levar o foco para dentro do modal e devolvê-lo ao fechar | G (acessibilidade) |
| D3 | Cada projeto absorve a sua validação; o arquivo compartilhado sai no fim | ciclo dos outros 3 |
| D4 | Registrar a limitação no README | J (documentação) |
| D5 | Escapar `video.image` como os demais campos | E (JavaScript) |
| D6 | Adicionar `<meta name="description">` | C (HTML) |
| D7 | Registrar a limitação no README do módulo | J (documentação) |
