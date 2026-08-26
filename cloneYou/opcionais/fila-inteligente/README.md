# Fila inteligente — módulo opcional

Esta pasta contém uma funcionalidade avançada separada do CloneYou principal. Ela serve como laboratório para os alunos que quiserem estudar uma fila de reprodução antes de integrá-la ao projeto principal.

## O que o módulo faz

A biblioteca permite filtrar vídeos por título, canal ou categoria. Cada vídeo pode ser reproduzido no player demonstrativo ou adicionado à fila. O painel lateral mostra a ordem, o tempo total, permite remover itens e também embaralhar a sessão. O botão de conclusão marca o vídeo atual como assistido.

Os dados da fila e dos vídeos assistidos são salvos no `localStorage`, portanto continuam disponíveis quando a página é aberta novamente no mesmo navegador.

## Estrutura

```text
fila-inteligente/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Como executar

Abra `index.html` no navegador. Para testar, pesquise um termo, clique em `+ Adicionar`, use `▶ Reproduzir`, marque o vídeo como assistido e depois experimente `Embaralhar` e `Limpar`.

## Como integrar ao CloneYou

O módulo foi separado para não alterar a página principal. Para integrá-lo, copie a seção `player`, a seção `queue` e os estilos correspondentes para o clone principal. Depois, reúna as funções de `js/script.js` em um único arquivo, mantendo os identificadores usados no HTML. Como desafio, o aluno pode substituir o player demonstrativo por um elemento `<video>` real ou carregar os vídeos de uma API.

> Este é um recurso educacional de front-end. A fila é local e não possui login, servidor ou banco de dados.
