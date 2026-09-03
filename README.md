# OMEGA-ALFA-DELTA

Repositório de projetos educacionais de **HTML, CSS e JavaScript puro**. Cada
pasta é um projeto independente: dá para abrir só ela, no navegador, sem
servidor, sem instalação e sem depender de nenhuma outra pasta.

## Projetos ativos

| Pasta | Tema | O que estudar |
| --- | --- | --- |
| [`cloneYou`](./cloneYou) | Clone educacional do YouTube | Grade de vídeos, busca, filtros, sidebar recolhível, modo escuro e modal. |
| [`wiki-modern-warfare`](./wiki-modern-warfare) | Wiki Modern Warfare | Linha do tempo do MW1 ao MW4, filtros de capítulos e layout em Grid. |
| [`portfolio-talles`](./portfolio-talles) | Portfólio do Talles | Apresentação pessoal, arte feita em CSS, cards de favoritos e menu mobile. |
| [`estacao-pc`](./estacao-pc) | Estação PC | Componentes de computador, perfis de montagem que trocam o painel e dicas. |

Cada um tem o seu próprio `README.md`, com objetivo, funcionalidades, como
executar, como estudar, **limitações conhecidas** e histórico.

## Outros diretórios

| Pasta | O que é |
| --- | --- |
| [`projeto_analise_algoritmos`](./projeto_analise_algoritmos) | Trabalho acadêmico em **Java/Maven** (locadora de veículos). Compila com Maven ou direto com `javac`. |
| `ALFA`, `site_DuDuzinVideoJogus_01`, `site_pedrocamposcoimbra8-afk_01`, `site_felipebrayan1403-cell_01`, `site_ajuda_pensamento_01` | **Material original preservado.** Vários estão quebrados — e é para continuarem assim. Cada um tem um `LEIA-ME.md` explicando o defeito e por que ele fica. |

## Como executar

Abra a pasta escolhida e depois o `index.html` no navegador. São páginas
estáticas: não precisam de banco de dados, servidor nem instalação de
dependências.

As páginas buscam fontes e ícones na internet. **Offline elas continuam
abrindo e funcionando** — o que muda é a tipografia e, no `cloneYou`, os ícones
e as miniaturas. Cada README detalha o que muda no seu projeto.

## Testes

```bash
npm test
```

Roda as cinco baterias em sequência: o teste de isolamento da raiz e os testes
de cada projeto. **Não há nenhuma dependência para instalar** — o `package.json`
só tem scripts.

| Bateria | Verificações | O que garante |
| --- | --- | --- |
| [`tests/isolamento.test.js`](./tests/isolamento.test.js) | 17 | Nenhum projeto usa arquivo de outro; nenhum projeto ativo tem referência quebrada. |
| `cloneYou/tests/` | 16 | |
| `wiki-modern-warfare/tests/` | 16 | |
| `portfolio-talles/tests/` | 14 | |
| `estacao-pc/tests/` | 18 | |
| **total** | **81** | |

Cada projeto tem duas baterias: uma **estrutural**, que roda só com o Node, e uma
de **interface**, que abre a página no Chromium com a rede bloqueada — o que
também comprova que ela funciona sem internet.

A de interface precisa do [Playwright](https://playwright.dev). **Sem ele, esses
testes são pulados, não falham**: sem Playwright são 50 verificações passando e
31 puladas. Para rodar todas:

```bash
npm install -g playwright && npx playwright install chromium
```

Para rodar só um projeto, entre na pasta dele:

```bash
cd cloneYou && node --test tests/*.test.js
```

> Use `tests/*.test.js`, e não `tests/`: nesta versão do Node, passar a pasta faz
> o runner tentar carregá-la como se fosse um arquivo.

## Documentação

| Documento | Para quê |
| --- | --- |
| [`docs/estrutura-projetos.md`](docs/estrutura-projetos.md) | O mapa: o que é projeto ativo, o que é material preservado, e a estrutura padrão. |
| [`docs/INVENTARIO-PROJETOS.md`](docs/INVENTARIO-PROJETOS.md) | O retrato do repositório **antes** da reorganização, com todos os problemas encontrados. |
| [`docs/STATUS-PROJETOS.md`](docs/STATUS-PROJETOS.md) | O andamento: o que foi feito em cada projeto e o que ficou registrado. |
| [`docs/MATERIAL-PRESERVADO.md`](docs/MATERIAL-PRESERVADO.md) | O que fica, o que saiu, por quê — e como recuperar qualquer coisa. |
| `<projeto>/docs/auditoria.md` | A auditoria de cada projeto: o que foi medido, o que era defeito e o que **não** era. |

## Estrutura de um projeto

```text
projeto/
├── index.html          # estrutura e conteúdo
├── css/style.css       # aparência, layout e responsividade
├── js/script.js        # eventos e comportamento
├── assets/             # imagens — só se o projeto usar alguma
├── docs/auditoria.md   # o que foi conferido e o que foi corrigido
├── tests/              # testes do projeto
└── README.md           # guia de estudo
```

Pasta vazia não entra. O `portfolio-talles`, por exemplo, **não tem `assets/`**:
toda a arte dele é feita em CSS.

## Regras deste repositório

1. **Cada projeto abre sozinho.** Nada de carregar CSS, JS ou imagem de outra
   pasta. O teste de isolamento existe para não deixar isso voltar.
2. **Material preservado não se conserta.** Os originais quebrados ensinam
   justamente por estarem quebrados. Ver [`docs/MATERIAL-PRESERVADO.md`](docs/MATERIAL-PRESERVADO.md).
3. **Melhorar, não refazer.** Redesign sem motivo destrói o trabalho de quem
   escreveu antes.
4. **Nada entra só para encher.** Antes de acrescentar algo, vale perguntar se
   melhora o projeto, combina com a proposta e mantém o código compreensível.
5. **Limitação se escreve, não se esconde.** Todo README tem uma seção dizendo o
   que o projeto deliberadamente não faz.
