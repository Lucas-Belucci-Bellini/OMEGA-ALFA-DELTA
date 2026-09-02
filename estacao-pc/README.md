# Estação PC

Projeto didático baseado no scaffold sem conteúdo do Felipe. A ideia foi recriada como uma página moderna sobre montagem de computadores, com perfis para estudo, criação e jogos.

## Estrutura

```text
estacao-pc/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── pc-build.jpg
│   └── pc-setup.jpg
├── docs/
│   └── auditoria.md
├── tests/
│   ├── estrutura.test.js
│   └── interface.test.js
└── README.md
```

## Objetivo

Mostrar como um painel de conteúdo troca de dados a partir de um objeto em
JavaScript, sem recarregar a página — e como organizar cartões de componentes
em um layout que se adapta à largura da tela.

## Tecnologias

HTML, CSS e JavaScript puro. Sem framework, sem build, sem dependência instalada.
A única coisa que vem de fora são as fontes do Google Fonts.

## Como executar

Abra `index.html` no navegador. Não é preciso servidor nem instalação.

## Como estudar

Abra `index.html` e explore os cartões de componentes e as abas de perfil. O `index.html` contém a estrutura da página. O `css/style.css` demonstra um layout responsivo com Grid, Flexbox e variáveis de design. O `js/script.js` mostra como trocar o conteúdo de um painel a partir de um objeto de dados.

Para praticar, adicione uma aba para streaming, crie um cálculo de orçamento, inclua mais componentes e troque as imagens dentro de `assets`.

## Funcionalidades

- Seis cartões de componentes de computador.
- Três perfis de montagem — Essencial, Criador e Jogador — que trocam código,
  título, descrição e as quatro peças do painel.
- Aviso de confirmação ao salvar um perfil.
- Seção de dicas e um link para conteúdo em vídeo.
- Menu que vira botão ☰ no celular e **fecha ao escolher uma seção**.

## Testes

```bash
# dentro da pasta estacao-pc
node --test tests/*.test.js
```

> Use `tests/*.test.js` mesmo, e não `tests/`: nesta versão do Node, passar a
> pasta faz o runner tentar carregá-la como se fosse um arquivo.

| Bateria | O que cobre | Precisa de quê |
| --- | --- | --- |
| `estrutura.test.js` | Caminhos locais; âncoras com destino; `alt` em toda imagem; nenhuma imagem sem uso em `assets/`; a fonte pedida em um lugar só; `aria-pressed` nos três perfis; e uma trava: **se alguém devolver `role="tab"` ao HTML, o teste passa a cobrar `aria-controls`, `role="tabpanel"` e navegação pelas setas junto**. | Só o Node. |
| `interface.test.js` | Chromium **sem internet**: o perfil padrão, a troca de perfil, a numeração das peças, o estado anunciado a leitores de tela, o menu do celular, **um único pedido de fonte**, o aviso do botão, ausência de rolagem horizontal em 390/820/1440 px e zero erro de JavaScript. | Playwright. Sem ele, os testes são **pulados**, não falham. |

Cinco testes são **de regressão**: verificados falhando no código anterior às
correções e passando depois delas.

## Limitações

- **As fontes vêm do Google Fonts.** Offline a página abre e funciona por
  inteiro; só troca a tipografia pela do sistema.
- **Os perfis são sugestões didáticas, não recomendação de compra.** Os
  componentes estão escritos por categoria ("Ryzen 5 / Core i5"), sem preço,
  modelo exato ou compatibilidade verificada.
- **"Salvar perfil" não salva nada.** Mostra um aviso; não há back-end nem
  armazenamento local. Implementar isso é um dos exercícios sugeridos.
- **Os três perfis não têm navegação por setas do teclado.** Eles são botões, e
  funcionam com Tab e Enter. A marcação diz exatamente isso desde este ciclo —
  antes ela prometia um comportamento de abas que não existia.

## Histórico

| Quando | O que mudou |
| --- | --- |
| Origem | Scaffold sem conteúdo do Felipe (`site_felipebrayan1403-cell_01`, preservado na raiz do repositório), recriado como página sobre montagem de computadores. |
| Ciclo de organização | Auditoria em [`docs/auditoria.md`](docs/auditoria.md). Corrigido o menu do celular. As abas deixaram de prometer um contrato de teclado que não cumpriam e passaram a se declarar como o que são: botões com `aria-pressed`. Removido o `@import` duplicado do CSS — a mesma fonte era pedida duas vezes. A numeração das peças passou a usar `padStart`, que não quebra no décimo item. Criada a pasta `tests/`. |

### Validação visual registrada antes deste ciclo

A página foi aberta localmente no navegador e carregou o hero, os seis
componentes, as abas de perfil, as dicas e as imagens da montagem. A aba
`Criador` foi acionada e confirmou a troca do painel para `PROFILE / CRIADOR`,
com as peças atualizadas para Ryzen 7/Core i7, 32 GB DDR5, SSD NVMe de 1 TB e
fonte de 650 W. O console não apresentou erros.
