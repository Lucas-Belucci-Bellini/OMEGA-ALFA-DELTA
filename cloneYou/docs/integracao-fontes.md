# Integração das fontes

Esta página registra a auditoria dos três repositórios usados como referência para o projeto `cloneYou`.

| Repositório | Elementos encontrados | Onde foram consolidados |
| --- | --- | --- |
| [YoYoDolls](https://github.com/DuDuzinVideoJogus/YoYoDolls) | Estrutura de cabeçalho, marca CloneTube, campo de pesquisa, microfone e menu lateral. Também foi preservado o efeito de crescimento da logo. | `index.html`, `css/style.css` e `js/script.js` |
| [yotobe](https://github.com/Lipegc7/yotobe) | Organização alternativa do cabeçalho, logo `YoTobe`, busca e botão de pesquisa por voz. | Cabeçalho e controles de pesquisa em `index.html`; comportamento em `js/script.js` |
| [YouTube](https://github.com/Matheus-PFC/YouTube) | Estrutura mínima de header com menu, logo, busca e microfone. | Base semântica do cabeçalho em `index.html` |

## Resultado da verificação

Os três projetos foram clonados e inspecionados antes da consolidação. As duas últimas bases eram protótipos de cabeçalho, e a base `YoYoDolls` era a mais completa entre elas, embora ainda não tivesse grade de vídeos ou interações implementadas.

A branch `main` do repositório `OMEGA-ALFA-DELTA` contém a versão consolidada dentro de `cloneYou/`. Os arquivos de origem não foram copiados como três projetos separados; suas partes de interface foram reorganizadas em uma única implementação didática para evitar duplicação e facilitar a manutenção pelos alunos.

A integração final inclui, além das referências originais, uma grade de vídeos, filtros, busca, modal de prévia, sidebar expansível no desktop, drawer de navegação no mobile e modo escuro com preferência salva no navegador.
