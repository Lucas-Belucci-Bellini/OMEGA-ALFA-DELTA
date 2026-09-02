# Portfólio do Talles

Projeto didático baseado no portfólio original do Talles. A página reúne apresentação pessoal, referências de animes e jogos, fatos rápidos, uma citação e a recomendação do projeto original.

## Estrutura

```text
portfolio-talles/
├── index.html
├── css/style.css
├── js/script.js
├── docs/
│   └── auditoria.md
├── tests/
│   ├── estrutura.test.js
│   └── interface.test.js
└── README.md
```

Não há pasta `assets/`: toda a arte da página — os círculos, as notas, o retrato
com as iniciais e a estrela — é feita com CSS, sem nenhuma imagem.

## Objetivo

Mostrar como uma página pessoal se organiza em seções com identidade visual
própria, usando CSS para criar arte em vez de depender de imagens.

## Tecnologias

HTML, CSS e JavaScript puro. Sem framework, sem build, sem dependência instalada.
A única coisa que vem de fora são as fontes do Google Fonts.

## Como executar

Abra `index.html` no navegador. Não é preciso servidor nem instalação.

## Como estudar

O `index.html` organiza a página em seções. O `css/style.css` demonstra como criar uma identidade visual com variáveis, tipografia, Grid, Flexbox e breakpoints. O `js/script.js` controla o menu mobile e as mensagens de confirmação dos cartões.

Para praticar, substitua as iniciais `TG`, adicione uma nova lista de favoritos, transforme os fatos pessoais em uma seção de habilidades e crie um formulário de contato com validação.

## Funcionalidades

- Apresentação pessoal com arte feita inteiramente em CSS.
- Fatos rápidos (cor, Pokémon e banda favoritos).
- Duas listas de referências — animes e jogos — cada uma com um botão que
  confirma a ação com um aviso.
- Menu que vira botão ☰ no celular e **fecha ao escolher uma seção**.
- Citação e a recomendação misteriosa do projeto original.

## Testes

```bash
# dentro da pasta portfolio-talles
node --test tests/*.test.js
```

> Use `tests/*.test.js` mesmo, e não `tests/`: nesta versão do Node, passar a
> pasta faz o runner tentar carregá-la como se fosse um arquivo.

| Bateria | O que cobre | Precisa de quê |
| --- | --- | --- |
| `estrutura.test.js` | Caminhos locais resolvem e não saem da pasta; toda âncora tem destino; link em nova aba tem `rel="noopener"`; **todo botão tem nome acessível de verdade** — um botão cujo conteúdo é só um símbolo (`☰`, `↗`) precisa de `aria-label`. | Só o Node. |
| `interface.test.js` | Chromium **sem internet**: as duas listas, o aviso de cada botão, o nome acessível dos botões, o menu do celular fechando ao escolher uma seção, ausência de rolagem horizontal em 390/820/1440 px e zero erro de JavaScript. | Playwright. Sem ele, os testes são **pulados**, não falham. |

Três testes são **de regressão**: verificados falhando no código anterior às
correções e passando depois delas.

> Os arquivos de teste se parecem com os dos outros projetos de propósito. Um
> helper compartilhado criaria justamente a amarra entre projetos que esta
> reorganização desfez — cada pasta precisa rodar sozinha.

## Limitações

- **As fontes vêm do Google Fonts.** Offline a página abre e funciona por
  inteiro; só troca a tipografia pela do sistema.
- **Não há formulário de contato nem back-end.** Os botões dos cartões mostram
  um aviso, não salvam nada — criar essa parte é um dos exercícios propostos.
- **O conteúdo é fixo no HTML.** Adicionar uma lista nova significa escrever a
  seção, que é justamente o que se quer praticar.

## Histórico

| Quando | O que mudou |
| --- | --- |
| Origem | Portfólio original do Talles, recriado com identidade visual própria. Diferente dos outros projetos ativos, a pasta original dele não está no repositório. |
| Ciclo de organização | Auditoria em [`docs/auditoria.md`](docs/auditoria.md). Corrigido o menu do celular, que ficava aberto por cima da seção escolhida. Os dois botões dos cartões ganharam nome acessível — antes um leitor de tela anunciava só a seta `↗`. O painel decorativo do topo trocou um `aria-label` inócuo por `aria-hidden`. Removido `assets/portfolio-reference.png`: não era usado e não era material do projeto — era peça de divulgação de um template comercial de terceiros, sem licença nem crédito. A decisão e o comando para recuperá-lo estão na auditoria. |

### Validação visual registrada antes deste ciclo

A página foi aberta localmente no navegador e carregou o hero, a navegação, os
fatos pessoais, as listas de animes e jogos e a recomendação. Os caminhos
relativos funcionaram sem servidor e sem back-end.
