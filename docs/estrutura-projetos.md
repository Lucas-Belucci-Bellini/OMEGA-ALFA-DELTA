# Estrutura dos projetos do Ômega

O repositório guarda quatro naturezas diferentes de material em pastas de
primeiro nível. Confundir uma com a outra é o que fazia o repositório parecer
bagunçado: um trabalho de Java invisível na documentação, uma pasta de entrega
sem o código que ela dizia conter, e originais quebrados que pareciam projetos
abandonados.

## 1. Projetos ativos

São os quatro que evoluem. Cada um abre sozinho e tem o mesmo esqueleto.

| Pasta | Responsável ou origem | Situação |
| --- | --- | --- |
| [`cloneYou`](../cloneYou) | Consolidação de três projetos de clone do YouTube | Versão principal, com dois módulos opcionais. |
| [`wiki-modern-warfare`](../wiki-modern-warfare) | Pedro | Wiki com a história do MW1 ao MW4. |
| [`portfolio-talles`](../portfolio-talles) | Talles | Portfólio com identidade visual própria. |
| [`estacao-pc`](../estacao-pc) | Felipe | Site de montagem de computadores. |

```text
projeto/
├── index.html
├── css/style.css
├── js/script.js
├── assets/           # só quando o projeto usa imagem própria
├── docs/auditoria.md
├── tests/
└── README.md
```

**Pasta vazia não entra.** O `portfolio-talles` não tem `assets/` porque toda a
arte dele é CSS. Criar a pasta só para "seguir o padrão" seria mentir sobre o
que o projeto é.

## 2. Material original preservado

| Pasta original | Virou | Estado |
| --- | --- | --- |
| `site_DuDuzinVideoJogus_01` | uma das três fontes do `cloneYou` | script ausente |
| `site_pedrocamposcoimbra8-afk_01` | `wiki-modern-warfare` | HTML sem tag `<link>` |
| `site_felipebrayan1403-cell_01` | `estacao-pc` | CSS aponta para pasta inexistente |
| `site_ajuda_pensamento_01` | — | JavaScript inteiro morto por erro de sintaxe |
| `ALFA` | — | CSS com nome trocado, 9 imagens ausentes |

> **Não conserte.** Estes diretórios existem para que dê para comparar o começo
> com o fim. Um defeito preservado ensina; um defeito corrigido some da história.
> Cada pasta tem um `LEIA-ME.md` com o diagnóstico, e nenhum arquivo original
> foi editado. A decisão completa está em [`MATERIAL-PRESERVADO.md`](MATERIAL-PRESERVADO.md).

## 3. Trabalho acadêmico em Java

[`projeto_analise_algoritmos`](../projeto_analise_algoritmos) — locadora de
veículos em Java/Maven, com 11 classes, correção de bugs e Javadoc.

Ele não aparecia em nenhuma documentação do repositório, e estava **partido em
duas pastas** que não funcionavam separadas: uma tinha o código, a outra tinha o
README da entrega e um JDK do Windows de 20 MB. Foram unidas.

## 4. Documentação central

`docs/` guarda o que vale para o repositório inteiro — inventário, status,
decisões — enquanto cada projeto guarda a própria auditoria dentro de si.

## Como isso é mantido

`tests/isolamento.test.js`, na raiz, verifica automaticamente as duas regras que
seguram esta organização:

1. Nenhum projeto — ativo ou preservado — referencia arquivo de outro.
2. Nenhum projeto ativo tem referência local quebrada, e todos têm `README.md`.

```bash
npm test
```
