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
| `portfolio-talles` | ✅ | ✅ | ✅ | ✅ | ✅ 14 testes | ✅ |
| `estacao-pc` | ✅ | ✅ | ✅ | ✅ | ✅ 18 testes | ✅ |

## Material preservado

| Diretório | Situação | Decisão |
| --- | --- | --- |
| `ALFA` | Quebrado (CSS com nome trocado, 9 imagens ausentes) | ✅ **fica intocado** + `LEIA-ME.md` |
| `site_DuDuzinVideoJogus_01` | `script.js` ausente | ✅ **fica intocado** + `LEIA-ME.md` |
| `site_pedrocamposcoimbra8-afk_01` | Sem `<link>` para o CSS | ✅ **fica intocado** + `LEIA-ME.md` |
| `site_felipebrayan1403-cell_01` | CSS aponta para `cdd/`, que não existe | ✅ **fica intocado** + `LEIA-ME.md` |
| `site_ajuda_pensamento_01` | 🟡 **JavaScript inteiro morto** — `var(--secondary)` na linha 69 do `script.js` | ✅ **fica intocado** + `LEIA-ME.md` |

Nenhum arquivo original foi editado. Cada pasta ganhou **só** um `LEIA-ME.md`
novo, com o diagnóstico e o aviso de não consertar. As decisões estão em
[`MATERIAL-PRESERVADO.md`](MATERIAL-PRESERVADO.md).
| `projeto_analise_algoritmos` | 🔴 **Não compilava** — duas vírgulas faltando em `Main.java` | ✅ corrigido; compila e roda. Recebeu o README da entrega e o `ENUNCIADO.md` |
| `projeto_analise_algoritmos_corrigido` | Sem `src/`; 20 MB de JDK versionado | ✅ **unido ao irmão** — era a outra metade da mesma entrega |

## Isolamento

`tests/isolamento.test.js`, na raiz, é o teste que protege a regra central: cada
projeto abre sozinho e nenhum usa arquivo de outro.

```bash
node --test tests/*.test.js
```

Estado atual: **17 verificações, todas passando** — reconferidas depois de cada ciclo.

Somando as baterias de cada projeto, o repositório tem **81 verificações**:

| Onde | Verificações |
| --- | --- |
| raiz (`tests/isolamento.test.js`) | 17 |
| `cloneYou/tests/` | 16 |
| `wiki-modern-warfare/tests/` | 16 |
| `portfolio-talles/tests/` | 14 |
| `estacao-pc/tests/` | 18 |

**Um defeito de menu apareceu em três dos quatro projetos.** O `wiki`, o
`portfolio` e o `estacao-pc` nasceram da mesma estrutura de cabeçalho e herdaram
a mesma falha: o menu do celular não fechava ao escolher uma seção. Cada um foi
corrigido no seu próprio ciclo, sem misturar projetos — mas a origem comum vale
ficar registrada, porque é o tipo de coisa que volta junto se alguém copiar o
cabeçalho para um projeto novo. Os quatro projetos ativos e os
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

### portfolio-talles — finalizado

- Auditoria: [`portfolio-talles/docs/auditoria.md`](../portfolio-talles/docs/auditoria.md)
- **D1 corrigido** — mesmo defeito de menu que o `wiki-modern-warfare` tinha:
  no celular, ele ficava aberto por cima da seção escolhida. Os dois projetos
  nasceram da mesma estrutura de menu, então herdaram a mesma falha; cada um foi
  corrigido no seu próprio ciclo.
- **D2 corrigido** — os dois botões dos cartões não tinham nome acessível. O
  conteúdo deles era só a seta `↗`, que um leitor de tela anuncia como símbolo.
- **D4 corrigido** — o painel decorativo do topo tinha `aria-label` num `<div>`
  sem `role`, o que a maioria dos leitores ignora. Virou `aria-hidden="true"`,
  que é o correto para conteúdo puramente decorativo.
- **`assets/portfolio-reference.png` removido.** Não era usado e, ao abrir a
  imagem, **não era material do projeto**: é peça de divulgação de um template
  comercial de terceiros, com foto de pessoa real, sem licença nem crédito em
  lugar nenhum do repositório. Guardar referência de design é legítimo pelo
  link; copiar o arquivo para dentro do repositório, não. A pasta `assets/`
  deixou de existir — toda a arte da página é feita em CSS.
- Testes: 7 estruturais + 7 de interface. Três são regressão.

### estacao-pc — finalizado

- Auditoria: [`estacao-pc/docs/auditoria.md`](../estacao-pc/docs/auditoria.md)
- **D1 corrigido** — o terceiro projeto com o mesmo defeito de menu.
- **D2 corrigido** — as abas declaravam `role="tab"` dentro de `role="tablist"`
  sem cumprir nada do que isso promete: a seta do teclado não fazia nada, não
  havia `aria-controls` nem `role="tabpanel"`, e as três estavam na ordem de
  tabulação. Quem usa leitor de tela ouvia "aba, 1 de 3", tentava as setas e não
  acontecia nada. Passaram a se declarar pelo que são — botões com
  `aria-pressed` — em vez de prometer o que não entregam.
- **D3 corrigido** — a mesma fonte do Google era pedida duas vezes: `@import` na
  primeira linha do CSS **e** `<link>` no HTML, com a URL idêntica. Medido no
  navegador: duas requisições iguais. Ficou o `<link>`, que sai antes e já vem
  com `preconnect`.
- **D4 corrigido** — a numeração das peças concatenava um zero e sairia "010" no
  décimo item. Com quatro peças ninguém via; acrescentar peças é exercício
  sugerido no README.
- Testes: 9 estruturais + 9 de interface. Cinco são regressão.

## Problemas encontrados em um projeto que pertencem a outro

Nada registrado até aqui. Conforme a regra 19, um problema descoberto durante o
ciclo de um projeto mas pertencente a outro é anotado aqui e corrigido no ciclo
do dono, nunca no ciclo em andamento.

| Descoberto em | Pertence a | Problema | Situação |
| --- | --- | --- | --- |
| `cloneYou` | os 3 outros ativos | `cloneYou/docs/validacao-novos-projetos.md` documenta a validação de `wiki-modern-warfare`, `portfolio-talles` e `estacao-pc` — documentação de três projetos dentro de um quarto | ✅ resolvido — os três absorveram a sua parte e o arquivo compartilhado saiu no fim do ciclo do `estacao-pc`; o arquivo sai quando o último absorver a sua parte |

## Duas correções do próprio inventário

Vale registrar, porque as duas tiveram a mesma causa — **julgar sem rodar**:

| O que o inventário dizia | O que a medição mostrou |
| --- | --- |
| `projeto_analise_algoritmos` é "compilável" (porque tem o `src/` completo) | O `javac` falha com sete erros: faltavam duas vírgulas em `Main.java` |
| `site_ajuda_pensamento_01` é "funcional" (porque o CSS carrega) | `SyntaxError: Unexpected token 'var'` — o `script.js` inteiro está desligado |

Nos dois casos a aparência era boa e o arquivo estava quebrado. É exatamente o
tipo de coisa que os testes agora pegam sozinhos.

## O repositório antes e depois

| | Antes | Depois |
| --- | --- | --- |
| Tamanho da árvore de trabalho | 23 MB | **1 MB** |
| Maior pasta | `oracleJdk-26/` (20 MB, JDK do Windows) | `wiki-modern-warfare` (296 KB) |
| Projetos que não compilavam / não rodavam | 2 (o Java, e o `_corrigido` sem `src/`) | **0** |
| Testes automatizados | 1 arquivo, em um módulo opcional | **81 verificações**, em 9 arquivos |
| Projetos sem `docs/auditoria.md` | 4 | **0** |
| Documentação de um projeto dentro de outro | sim | não |
| `.gitignore` | não existia | existe |

> O clone do repositório **não** encolheu: o histórico do Git continua com tudo,
> inclusive os 20 MB do JDK. Encolher o histórico exigiria reescrevê-lo e
> quebraria todos os clones existentes. O que mudou é o que se encontra ao abrir
> a pasta hoje.
