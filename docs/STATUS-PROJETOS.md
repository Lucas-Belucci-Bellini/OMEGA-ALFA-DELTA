# Status dos projetos — OMEGA-ALFA-DELTA

Um projeto só é marcado como **finalizado** quando cumpre os 18 pontos do
critério de conclusão: estrutura organizada, funciona isolado, HTML correto, CSS
organizado, JavaScript funcional, assets carregam, ações principais funcionam,
mobile e desktop funcionam, console sem erro conhecido, README atualizado,
auditoria registrada e testes executados. Abrir sem erro não é suficiente.

## Projetos ativos

| Projeto | Auditoria | Correção | UI | Responsividade | Testes | Finalizado |
| --- | --- | --- | --- | --- | --- | --- |
| `cloneYou` | ✅ | ✅ | ✅ | ✅ | ✅ 16 testes | ✅ |
| `wiki-modern-warfare` | ✅ | ✅ | ✅ | ✅ | ✅ 16 testes | ✅ |
| `portfolio-talles` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| `estacao-pc` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

## Material preservado

| Diretório | Situação | Decisão |
| --- | --- | --- |
| `ALFA` | Quebrado (CSS com nome trocado, 9 imagens ausentes) | ⬜ a decidir |
| `site_DuDuzinVideoJogus_01` | `script.js` ausente | ⬜ a decidir |
| `site_pedrocamposcoimbra8-afk_01` | Sem `<link>` para o CSS | ⬜ a decidir |
| `site_felipebrayan1403-cell_01` | CSS aponta para `cdd/`, que não existe | ⬜ a decidir |
| `site_ajuda_pensamento_01` | Funcional | ⬜ a decidir |
| `projeto_analise_algoritmos` | Compilável | ⬜ a decidir |
| `projeto_analise_algoritmos_corrigido` | Sem `src/`; 20 MB de JDK versionado | ⬜ a decidir |

## Isolamento

`tests/isolamento.test.js`, na raiz, é o teste que protege a regra central: cada
projeto abre sozinho e nenhum usa arquivo de outro.

```bash
node --test tests/*.test.js
```

Estado atual: **17 verificações, todas passando** — reconferidas depois de cada ciclo. Os quatro projetos ativos e os
cinco diretórios originais estão isolados; os quatro ativos não têm nenhuma
referência local quebrada.

## Detalhe por projeto

### cloneYou — finalizado

- Auditoria: [`cloneYou/docs/auditoria.md`](../cloneYou/docs/auditoria.md)
- Dois defeitos reais corrigidos, os dois de teclado:
  - **D1** — o botão "Mais opções" (⋮) abria o modal em vez de agir, porque o
    handler de `keydown` capturava o card inteiro. Quem usa mouse nunca viu esse
    defeito; quem usa teclado não conseguia usar o botão.
  - **D2** — ao abrir o modal, o foco continuava no card atrás da sobreposição.
- Melhorias menores: `video.image` passou a ser escapado como os demais campos,
  e a página ganhou `<meta name="description">`.
- Testes: 8 estruturais (só Node) + 8 de interface (Chromium, rede bloqueada).
  Dois deles são regressão, verificados falhando antes da correção.
- Nada de visual foi alterado. O CSS não foi tocado: a auditoria conferiu os
  quatro seletores "repetidos" e concluiu que são o padrão regra-agrupada +
  regra-específica, que está correto.

### wiki-modern-warfare — finalizado

- Auditoria: [`wiki-modern-warfare/docs/auditoria.md`](../wiki-modern-warfare/docs/auditoria.md)
- **D1 corrigido** — no celular, o menu não fechava ao clicar em um link dele:
  o visitante escolhia "Linha do tempo", a página rolava, e o menu continuava
  por cima da seção que ele acabou de pedir para ver.
- **D2 descartado com medição.** A suspeita era que o cartão filtrado ficava
  espremido em um quarto da linha. Medindo, os 276px dele são a largura normal
  do cartão — ele não encolhe, a linha é que não fica cheia. A correção com
  `auto-fit` foi aplicada, medida e revertida: dava 3 colunas onde havia 2
  (820px) e 5 onde havia 4 (1920px).
- **Guarda `[hidden]` acrescentada ao CSS.** O filtro escondia cartões pelo
  atributo `hidden`, o que funcionava só porque nenhuma regra definia `display`
  para `.timeline-card`. Sem a guarda, o filtro quebraria em silêncio no dia em
  que alguém definisse.
- **2,2 MB removidos**: `assets/ghost-price-team.png` não era usado por ninguém.
  A pasta caiu de 2,5 MB para 296 KB. O clone não encolhe (o Git guarda o
  histórico) e o comando para recuperar o arquivo está na auditoria.
- Testes: 9 estruturais + 7 de interface. Um é regressão, verificado falhando
  antes da correção.

## Problemas encontrados em um projeto que pertencem a outro

Nada registrado até aqui. Conforme a regra 19, um problema descoberto durante o
ciclo de um projeto mas pertencente a outro é anotado aqui e corrigido no ciclo
do dono, nunca no ciclo em andamento.

| Descoberto em | Pertence a | Problema | Situação |
| --- | --- | --- | --- |
| `cloneYou` | os 3 outros ativos | `cloneYou/docs/validacao-novos-projetos.md` documenta a validação de `wiki-modern-warfare`, `portfolio-talles` e `estacao-pc` — documentação de três projetos dentro de um quarto | 🔄 1 de 3 absorvido (`wiki-modern-warfare`); o arquivo sai quando o último absorver a sua parte |
