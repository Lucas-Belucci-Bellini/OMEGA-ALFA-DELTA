# CloneTube — Projeto de apoio ao aluno do Ômega

Este projeto é um clone visual de uma plataforma de vídeos, criado com **HTML, CSS e JavaScript puro**. Ele foi organizado para servir como material de estudo e ponto de partida para atividades de desenvolvimento web.

## Como abrir

1. Baixe ou extraia a pasta `cloneYou`.
2. Abra o arquivo `index.html` em um navegador.
3. Para uma experiência melhor durante os estudos, abra a pasta em um editor como o Visual Studio Code.
4. Sempre que alterar um arquivo, salve-o e atualize a página no navegador.

Não é necessário instalar bibliotecas ou executar um servidor para visualizar a versão básica. O projeto utiliza alguns recursos externos, como fonte, ícones e imagens dos cards; por isso, a conexão com a internet ajuda a carregar todos os elementos visuais.

## Consolidação

A pasta `cloneYou` foi consolidada a partir das ideias de cabeçalho, logo, pesquisa e menu encontradas nos repositórios [YoYoDolls](https://github.com/DuDuzinVideoJogus/YoYoDolls), [yotobe](https://github.com/Lipegc7/yotobe) e [YouTube](https://github.com/Matheus-PFC/YouTube). A estrutura final foi reorganizada para continuar o clone com uma interface completa e responsiva.

O efeito solicitado de aumentar a logo foi preservado: ao passar o mouse pelo nome ou pelo símbolo da marca, a logo cresce suavemente usando `transform: scale()`.

## O que existe em cada arquivo

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura da página, cabeçalho, menu lateral, categorias, cards, navegação mobile e modal. |
| `css/style.css` | Aparência visual, layout responsivo, cores, espaçamentos, estados de hover e componentes. |
| `js/script.js` | Dados dos vídeos, busca, filtros, modal, toasts, menu, tema e pesquisa por voz. |

## O que o aluno pode estudar

O HTML apresenta uma organização semântica com `header`, `aside`, `main`, `section`, `article` e `footer`. O CSS demonstra variáveis de cor, Flexbox, CSS Grid, media queries, `clamp()`, estados de foco e adaptações para telas menores. O JavaScript mostra como armazenar dados em objetos, renderizar cards com template strings, filtrar resultados, alternar temas e ouvir eventos do usuário. A pasta `docs` registra a integração das fontes e os testes realizados.

## Atividades sugeridas

O aluno pode começar alterando o nome `CloneTube`, as cores em `:root` e os títulos dos vídeos no início do `js/script.js`. Depois, pode criar uma nova categoria, adicionar cards ao catálogo, implementar um contador de curtidas, melhorar o menu mobile ou substituir o modal por um player real. O botão de menu recolhe e expande a sidebar no desktop e abre um drawer no celular. O botão `Tema` alterna entre os modos claro e escuro e salva a preferência do visitante.

Também é possível praticar a conversão de unidades: as medidas de layout do arquivo CSS estão em `rem`, mantendo uma base relativa e mais fácil de adaptar. Para testar a responsividade, redimensione a janela do navegador e observe a transformação do menu lateral em navegação inferior no celular.

## Estrutura da pasta

```text
cloneYou/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── docs/
│   ├── integracao-fontes.md
│   └── validacao.md
└── README.md
```

> Este projeto é um protótipo educacional de front-end. Ele não possui login, banco de dados, upload real de vídeos ou integração oficial com a plataforma YouTube.
