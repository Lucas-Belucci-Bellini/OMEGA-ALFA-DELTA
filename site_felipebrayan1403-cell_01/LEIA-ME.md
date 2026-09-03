# site_felipebrayan1403-cell_01 — material original preservado

> **Está quebrado de propósito. Não conserte.**

Scaffold inicial do Felipe, que virou a [`estacao-pc`](../estacao-pc).

## O que acontece ao abrir `index.html`

A página abre **sem estilo**: o `<link>` pede `cdd/style.css`, e a pasta `cdd/`
não existe — provavelmente `css/` digitado errado, em uma pasta que também nunca
foi criada.

As imagens vêm todas de sites externos (Kabum, TechTudo, Google). Sem internet,
nenhuma aparece. Com internet, elas continuam dependendo de sites que podem
mudar ou remover o arquivo a qualquer momento — que é exatamente o motivo de a
`estacao-pc` guardar as próprias imagens em `assets/`.

## Por que fica assim

É o começo da `estacao-pc`. Ver as duas lado a lado mostra o que "organizar um
projeto" significa na prática.

A decisão completa está em [`../docs/MATERIAL-PRESERVADO.md`](../docs/MATERIAL-PRESERVADO.md).
