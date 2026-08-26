# Interações de vídeo — módulo opcional

Este exemplo mostra como uma tela de vídeo pode responder aos cliques e ao envio de um formulário. Ele foi separado do CloneYou principal para que o aluno possa experimentar com segurança.

## O que estudar

O botão `Curtir` altera uma contagem e muda seu estado visual. O botão `Não gostei` usa o mesmo padrão para registrar um feedback. O botão `Salvar` troca o texto entre `Salvar` e `Salvo`. O formulário de comentários cria novos elementos na tela e também permite removê-los.

O arquivo `js/script.js` usa `querySelector` para encontrar elementos, `addEventListener` para ouvir eventos e `localStorage` para guardar a preferência do visitante. A função `renderActions` atualiza os botões, enquanto `renderComments` redesenha a lista de comentários.

## Estrutura

```text
interacoes-video/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Como executar

Abra `index.html` no navegador. Clique em `Curtir`, `Não gostei` e `Salvar`, escreva um comentário e recarregue a página para perceber que os dados continuam salvos neste navegador.

## Exercícios sugeridos

Altere o nome do usuário, adicione um contador de compartilhamentos, crie uma segunda área de comentários e inclua um botão para limpar todas as interações. Depois, compare este módulo com `fila-inteligente` para identificar duas formas diferentes de guardar estado no `localStorage`.

> Os dados são locais e servem apenas para estudo. Não existe login ou banco de dados neste componente.
