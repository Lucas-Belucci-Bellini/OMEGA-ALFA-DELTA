# Auditoria — portfolio-talles

> Fase A do ciclo: **leitura e medição, sem alterar código**.
> Verificação em Chromium via Playwright, com a rede bloqueada, nos viewports
> 390×844, 820×1180 e 1440×900.

## 1. O que foi conferido

| Item | Resultado |
| --- | --- |
| `css/style.css` e `js/script.js` existem e carregam | ✅ |
| Erros de JavaScript | ✅ nenhum |
| Overflow horizontal | ✅ nenhum nos três tamanhos |
| Âncoras do menu (`#sobre`, `#favoritos`, `#recomendacoes`) | ✅ todas têm destino |
| Avisos (`toast`) dos dois cartões | ✅ aparecem com a mensagem certa |
| Link externo em nova aba | ✅ com `rel="noopener noreferrer"` |
| Hierarquia de títulos | ✅ um `h1`, depois `h2` e `h3` |
| Anel de foco do teclado | ✅ intacto — nenhum `outline: none` no CSS |
| `<meta name="description">` | ✅ já existia |

## 2. Defeitos encontrados

### 🔴 D1 — No celular, o menu não fecha quando se clica em um link dele

**Onde:** `js/script.js`.

O botão ☰ alterna a classe `menu-open`, e nada trata o clique nos links de
dentro do menu. O visitante toca em "Sobre", a página rola até a seção, e o menu
continua aberto por cima dela.

**Medido:** depois de clicar em `#main-nav a[href="#sobre"]` a 390px de largura,
`#main-nav` continua visível e `aria-expanded` continua `"true"`.

> É o mesmo defeito que o `wiki-modern-warfare` tinha. Os dois projetos foram
> escritos com a mesma estrutura de menu, então herdaram a mesma falha. Cada um
> foi corrigido no seu próprio ciclo, como manda a regra de não misturar
> projetos — mas vale saber que a origem é comum.

### 🔴 D2 — Os dois botões dos cartões não têm nome para quem não vê a tela

**Onde:** `index.html`, `<button class="circle-button">↗</button>`.

O conteúdo do botão é a seta `↗`. Um leitor de tela anuncia literalmente o
símbolo — "seta para nordeste" — e o visitante não tem como saber o que o botão
faz. Não há `aria-label`, `title` nem texto escondido.

**Medido:** os dois `.circle-button` têm `aria-label = null` e texto `"↗"`.
O botão ☰ do menu, no mesmo arquivo, **tem** `aria-label` — a falha é só nestes dois.

### 🟡 D3 — `assets/portfolio-reference.png`: 263 KB que a página não usa, e que não é do projeto

O arquivo não é referenciado por HTML, CSS nem JS. Abrindo a imagem, ela **não é
o portfólio original do Talles**: é uma peça de divulgação de um *template*
comercial de portfólio de terceiros ("Developer X"), com layouts prontos e a
foto de uma pessoa real, provavelmente de banco de imagens.

Isso muda a natureza da decisão. Não se trata de "material original preservado
para estudo" — é obra de terceiros, sem licença nem crédito em lugar nenhum do
repositório, redistribuída dentro de um trabalho escolar.

**Decisão: remover do projeto.** Guardar uma referência de design é útil e
legítimo; o jeito de fazer isso sem redistribuir arquivo alheio é **anotar o
link** da referência, não copiar a imagem para dentro do repositório.

Como em qualquer remoção deste ciclo, nada se perde:

```bash
git show 7425544:portfolio-talles/assets/portfolio-reference.png > portfolio-talles/assets/portfolio-reference.png
```

E, como em qualquer remoção, **o clone do repositório não encolhe**: o arquivo
continua no histórico do Git. O ganho é de clareza e de procedência.

### 🟢 D4 — `aria-label` em `<div>` sem `role` não faz efeito

`<div class="hero__art" aria-label="Painel visual de apresentação">` — um `div`
comum não tem papel semântico, e a maioria dos leitores de tela ignora o
`aria-label` nesse caso. O atributo não atrapalha; só não faz o que parece fazer.

Como o painel é puramente decorativo (círculos, notas e uma estrela em CSS),
o certo é o contrário do que parece: marcar como decorativo com
`aria-hidden="true"`, para não poluir a leitura com conteúdo sem informação.

## 3. O que **não** é defeito (conferido e descartado)

- **Não há guarda `[hidden]` no CSS.** No `cloneYou` e no `wiki` ela era
  necessária porque os dois escondem elementos por esse atributo. Este projeto
  não usa `hidden` em lugar nenhum — o aviso aparece e some por classe. Colocar a
  regra aqui seria adicionar CSS que não protege nada.
- **O menu é `☰` como texto.** Tem `aria-label`, então é anunciado corretamente.
- **A `<blockquote>` da citação não tem título de seção.** É proposital: uma
  citação isolada não precisa de cabeçalho.

## 4. Plano de correção

| Defeito | Ação | Fase |
| --- | --- | --- |
| D1 | Fechar o menu ao clicar em um link dele | B (funcional) |
| D2 | Dar `aria-label` aos dois botões dos cartões | G (acessibilidade) |
| D3 | Remover o arquivo e registrar a decisão, a procedência e como recuperá-lo | H (performance) |
| D4 | Trocar o `aria-label` inócuo por `aria-hidden="true"` no painel decorativo | G (acessibilidade) |
