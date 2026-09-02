# site_pedrocamposcoimbra8-afk_01 — material original preservado

> **Está quebrado de propósito. Não conserte.**

Base original do Pedro, que virou o [`wiki-modern-warfare`](../wiki-modern-warfare).

## O que acontece ao abrir `index.html`

A página abre **sem nenhum estilo**. O motivo é diferente do que parece: o
arquivo `stlye.css` existe e tem 16 linhas escritas, mas **o HTML não tem
nenhuma tag `<link>`**. O CSS nunca foi ligado à página.

Repare que aqui não há erro no console: para o navegador, nada deu errado — uma
página sem folha de estilo é uma página válida. Este é o tipo de defeito que só
se descobre olhando o HTML linha por linha.

## Por que fica assim

Comparar esta pasta com o `wiki-modern-warfare` mostra o caminho entre a ideia e
a versão terminada.

A decisão completa está em [`../docs/MATERIAL-PRESERVADO.md`](../docs/MATERIAL-PRESERVADO.md).
