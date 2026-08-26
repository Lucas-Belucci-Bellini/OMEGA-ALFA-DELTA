# CloneTube — Projeto de apoio ao aluno do Ômega

Este projeto é um clone visual de uma plataforma de vídeos, criado com **HTML, CSS e JavaScript puro**. Ele foi organizado para servir como material de estudo e ponto de partida para atividades de desenvolvimento web.

## Como abrir

1. Baixe ou extraia a pasta `cloneYou`.
2. Abra o arquivo `index.html` em um navegador.
3. Para uma experiência melhor durante os estudos, abra a pasta em um editor como o Visual Studio Code.
4. Sempre que alterar um arquivo, salve-o e atualize a página no navegador.

Não é necessário instalar bibliotecas ou executar um servidor para visualizar a versão básica. O projeto utiliza alguns recursos externos, como fonte, ícones e imagens dos cards; por isso, a conexão com a internet ajuda a carregar todos os elementos visuais.

## Roteiro para iniciantes

A forma mais simples de estudar é seguir o caminho do navegador. Primeiro, abra `index.html` e identifique os elementos que aparecem na tela. Depois, localize no HTML o mesmo nome de classe usado no `css/style.css`. Por fim, abra `js/script.js` e procure o evento que muda aquele elemento quando o aluno clica, pesquisa ou escolhe um filtro.

| Conceito | Onde aparece | O que significa |
| --- | --- | --- |
| `class` | HTML e CSS | Nome usado para conectar um elemento às regras visuais. |
| `data-*` | HTML e JavaScript | Pequena informação guardada no elemento, como o filtro de uma categoria. |
| `querySelector` | JavaScript | Encontra um elemento da página para que o código possa usá-lo. |
| `addEventListener` | JavaScript | Espera uma ação, como clique, envio de formulário ou tecla. |
| `classList.toggle` | JavaScript | Liga ou desliga uma classe, útil para menu, tema e estados ativos. |

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

Os comentários dentro dos arquivos explicam a ideia antes do código. Leia primeiro o comentário e só depois as linhas seguintes. Se algum termo ainda parecer novo, use a tabela do roteiro acima e teste uma mudança pequena de cada vez.

### Exercício prático: comentários com localStorage

1. Abra `opcionais/interacoes-video/index.html` e escreva dois comentários.
2. Atualize a página com `Ctrl+R` e confira se os comentários continuam aparecendo.
3. Abra as ferramentas do navegador, entre em **Application / Armazenamento local** e encontre a chave `clonetube-interactions`.
4. Apague essa chave, atualize a página e confirme que a lista voltou a ficar vazia.
5. Edite `js/script.js` para adicionar um botão `Limpar comentários` e faça essa ação remover apenas os comentários, sem apagar a curtida.

O exercício mostra a diferença entre alterar a tela e salvar dados. A função `renderComments()` atualiza o HTML; `saveState()` transforma o objeto em texto com `JSON.stringify()` e grava no navegador; `loadState()` recupera o texto com `JSON.parse()` quando a página abre novamente. Para conferir automaticamente se o formulário continua conectado ao código, execute o teste descrito no README do módulo.

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
│   ├── validacao.md
│   ├── validacao-novos-projetos.md
│   └── validacao-opcional.md
├── opcionais/
│   ├── fila-inteligente/
│   └── interacoes-video/
└── README.md
```

## Módulo opcional: fila inteligente

A pasta [`opcionais/fila-inteligente`](./opcionais/fila-inteligente) contém uma funcionalidade avançada independente. Ela permite filtrar uma biblioteca de vídeos, adicionar itens a uma fila, remover, reproduzir uma prévia, embaralhar a ordem, marcar vídeos como assistidos e salvar os dados no `localStorage`.

Para usar, abra `opcionais/fila-inteligente/index.html`. Para integrar ao clone principal, copie a estrutura do painel, os estilos necessários e as funções de `opcionais/fila-inteligente/js/script.js`. A pasta foi separada para que o aluno possa experimentar sem modificar a versão principal. O guia completo de integração está em [`opcionais/fila-inteligente/README.md`](./opcionais/fila-inteligente/README.md), e o teste realizado está em [`docs/validacao-opcional.md`](./docs/validacao-opcional.md).

## Segundo módulo opcional: interações de vídeo

A pasta [`opcionais/interacoes-video`](./opcionais/interacoes-video) é um exercício menor para iniciantes. Ela mostra curtida, não gostei, salvar, formulário de comentários, remoção de comentários e persistência no `localStorage`. O guia em [`opcionais/interacoes-video/README.md`](./opcionais/interacoes-video/README.md) explica cada etapa com linguagem simples. Recomenda-se estudar este módulo antes da fila inteligente.

> Este projeto é um protótipo educacional de front-end. Ele não possui login, banco de dados, upload real de vídeos ou integração oficial com a plataforma YouTube.
