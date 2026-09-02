# Wiki Modern Warfare

Projeto didático baseado na ideia original do Pedro: uma página de wiki sobre a saga **Modern Warfare**, agora com a linha do tempo do MW1 ao MW4, personagens, filtros e o link meme direcionado ao YouTube.

## Estrutura

```text
wiki-modern-warfare/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   └── ghost-price.jpg
├── docs/
│   └── auditoria.md
├── tests/
│   ├── estrutura.test.js
│   └── interface.test.js
└── README.md
```

## Objetivo

Mostrar como uma página de conteúdo se organiza: uma linha do tempo com dados
no próprio HTML, filtros controlados por JavaScript e um layout em Grid que se
reorganiza sozinho conforme a largura da tela.

## Tecnologias

HTML, CSS e JavaScript puro. Sem framework, sem build, sem dependência instalada.
A única coisa que vem de fora são as fontes do Google Fonts.

## Como executar

Abra `index.html` no navegador. Não é preciso servidor nem instalação.

## Como estudar

Abra `index.html` no navegador e use os botões da linha do tempo. No `index.html`, observe a marcação semântica dos capítulos. No `css/style.css`, acompanhe o sistema de cores, o layout em Grid e as media queries. No `js/script.js`, veja como `data-filter` permite mostrar e ocultar cartões sem recarregar a página.

Para praticar, adicione MW5 como um novo cartão, crie uma categoria de personagens e altere o conteúdo do link dentro da seção “Arquivo secreto”.

> O link da seção “Meme” foi mantido de propósito como parte da ideia original. Ele abre o YouTube em uma nova aba.

## Funcionalidades

- Linha do tempo com quatro capítulos (MW1, MW2, MW3 e a nova linha 2019–2023).
- Filtros que mostram e escondem cartões sem recarregar a página.
- Cartões de personagens.
- Menu que vira botão ☰ no celular — e que **fecha ao escolher uma seção**.
- Seção "Arquivo secreto" com o link meme original.

## Testes

```bash
# dentro da pasta wiki-modern-warfare
node --test tests/*.test.js
```

> Use `tests/*.test.js` mesmo, e não `tests/`: nesta versão do Node, passar a
> pasta faz o runner tentar carregá-la como se fosse um arquivo.

| Bateria | O que cobre | Precisa de quê |
| --- | --- | --- |
| `estrutura.test.js` | Caminhos locais resolvem e não saem da pasta; toda âncora `#secao` tem destino; toda imagem tem `alt`; **nenhuma imagem em `assets/` está sem uso**; link em nova aba tem `rel="noopener"`; `[hidden]` protegido no CSS; os elementos que o script procura existem. | Só o Node. |
| `interface.test.js` | Chromium **sem internet**: os 4 capítulos, cada filtro, um só filtro ativo por vez, o menu do celular fechando ao escolher uma seção, 4/2/1 colunas conforme a largura, ausência de rolagem horizontal e zero erro de JavaScript. | Playwright. Sem ele, os testes são **pulados**, não falham. |

O teste do menu é **de regressão**: verificado falhando no código anterior à
correção e passando depois dela.

## Limitações

- **As fontes vêm do Google Fonts.** Offline a página abre e funciona por
  inteiro; só troca a tipografia pela fonte padrão do sistema.
- **O conteúdo é fixo no HTML.** Não há busca, banco de dados nem API; adicionar
  um capítulo significa escrever um `<article>` novo — o que é justamente o
  exercício proposto.
- **Não há estado vazio para os filtros**, porque nenhuma combinação resulta em
  zero cartões. Se você criar uma categoria sem cartões, vai precisar dele.
- **O conteúdo é uma homenagem didática** a uma série de jogos: os textos são
  resumos escritos para o projeto, não material oficial.

## Histórico

| Quando | O que mudou |
| --- | --- |
| Origem | Ideia original do Pedro (`site_pedrocamposcoimbra8-afk_01`, preservado na raiz do repositório), recriada como wiki com linha do tempo e filtros. |
| Ciclo de organização | Auditoria em [`docs/auditoria.md`](docs/auditoria.md). Corrigido o menu do celular, que ficava aberto por cima da seção escolhida. Acrescentada a guarda `[hidden]` no CSS, para que o filtro não possa quebrar em silêncio no futuro. Removido `assets/ghost-price-team.png` (2,2 MB, sem uso) — a decisão e o comando para recuperá-lo estão na auditoria. Criada a pasta `tests/`. |

### Validação visual registrada antes deste ciclo

A página foi aberta localmente no navegador e carregou a imagem de Ghost/Price, o
hero, a linha do tempo MW1–MW4, os filtros e o link de meme para o YouTube. Os
caminhos relativos (`css/style.css`, `js/script.js`, `assets/`) funcionaram sem
servidor e sem backend.
