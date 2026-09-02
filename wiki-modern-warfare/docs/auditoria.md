# Auditoria — wiki-modern-warfare

> Fase A do ciclo: **leitura e medição, sem alterar código**.
> Verificação em Chromium via Playwright, com a rede bloqueada, nos viewports
> 390×844, 820×1180 e 1440×900.

## 1. O que foi conferido

| Item | Resultado |
| --- | --- |
| `css/style.css` e `js/script.js` existem e carregam | ✅ |
| `assets/ghost-price.jpg` existe e é usado | ✅ |
| Erros de JavaScript | ✅ nenhum |
| Overflow horizontal | ✅ nenhum nos três tamanhos |
| Imagens sem `alt` | ✅ nenhuma |
| Hierarquia de títulos | ✅ um `h1`, depois `h2` e `h3` |
| Filtros da linha do tempo | ✅ 4 → 1 → 3 → 4 cartões, como esperado |
| Menu mobile abre | ✅ `aria-expanded` acompanha o estado |
| Link meme externo | ✅ com `target="_blank"` **e** `rel="noopener noreferrer"` |
| Anel de foco do teclado | ✅ intacto — o CSS não tem nenhum `outline: none` |

## 2. Defeitos encontrados

### 🔴 D1 — No celular, o menu não fecha quando se clica em um link dele

**Onde:** `js/script.js`.

**O que acontece:** o botão ☰ alterna a classe `menu-open` na topbar. Não existe
nenhum tratamento para o clique nos links de dentro do menu. O visitante toca em
"Linha do tempo", a página rola até a seção — e o menu continua aberto por cima
do conteúdo que ele acabou de pedir para ver. Para continuar lendo, ele precisa
descobrir sozinho que tem que tocar no ☰ de novo.

**Medido:** depois de clicar em `.topbar__nav a[href="#timeline"]` com 390px de
largura, `.topbar__nav` continua visível e `aria-expanded` continua `"true"`.

### 🟡 D2 — Ao filtrar, o cartão que sobra fica espremido em um quarto da linha

**Onde:** `css/style.css`, regra `.timeline`.

**O que acontece:** a grade é `repeat(4, minmax(0, 1fr))` — quatro colunas fixas.
Quando o filtro esconde três cartões, o que sobra **continua ocupando só a
primeira coluna**, com três colunas vazias ao lado. O filtro funciona, mas o
resultado parece quebrado.

**Medido:** com o filtro "Personagens" a 1280px, o cartão restante tem **276px de
uma linha de 1152px**.

### 🟡 D3 — 2,2 MB de imagem que nenhuma página usa

`assets/ghost-price-team.png` (1280×960, **2228 KB**) não é referenciado pelo
HTML, pelo CSS nem pelo JS. Sozinho, ele é **quase dez vezes** o peso da imagem
que a página realmente usa (`ghost-price.jpg`, 962×1200, 237 KB) e responde por
quase toda a pasta `assets/`.

Além de não ser usado, está no formato errado: PNG é para desenho e captura de
tela; para fotografia o JPEG dá o mesmo resultado visual com uma fração do peso.

### 🟢 D4 — O filtro depende de um detalhe frágil do CSS

`script.js` esconde cartões com `card.hidden = true`. Isso funciona **porque**
nenhuma regra do CSS define `display` para `.timeline-card`: sem isso, o
`display: none` do navegador prevalece.

Não é um defeito hoje. É uma armadilha: no dia em que alguém escrever
`.timeline-card { display: flex }`, o filtro **para de esconder** os cartões sem
nenhum erro no console — e a causa é muito difícil de achar. Uma regra
`[hidden] { display: none !important }` no CSS elimina a armadilha de vez.
(O `cloneYou` já tem essa regra; esta folha, não.)

## 3. O que **não** é defeito (conferido e descartado)

- **A imagem do herói não tem `width`/`height` no HTML.** Normalmente isso causa
  salto de layout, mas aqui o CSS fixa `height: 28rem` **e** `width: 100%`.
  Colocar `width="962" height="1200"` no HTML não mudaria nada na tela e ainda
  confundiria quem está estudando o arquivo.
- **Não existe estado vazio para os filtros.** Nenhuma combinação de filtro
  resulta em zero cartões, então não há tela vazia para tratar.
- **O botão de menu usa o caractere ☰ como conteúdo.** Tem `aria-label`, o que
  resolve a leitura; não há motivo para trocar por ícone de biblioteca externa.

## 4. Plano de correção

| Defeito | Ação | Fase |
| --- | --- | --- |
| D1 | Fechar o menu ao clicar em um link dele | B (funcional) |
| D2 | Trocar as 4 colunas fixas por `auto-fit`, mantendo as 4 colunas quando há espaço | D (CSS) |
| D3 | Remover o arquivo não usado e registrar a decisão e como recuperá-lo | H (performance) |
| D4 | Acrescentar a guarda `[hidden]` ao CSS | D (CSS) |
