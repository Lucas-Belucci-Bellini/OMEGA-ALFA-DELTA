# site_ajuda_pensamento_01 — material original preservado

> **Está quebrado de propósito. Não conserte.**

Projeto educacional original preservado no repositório. Não tem uma versão
organizada correspondente — ele existe por si só.

## O defeito mais instrutivo do repositório

A página abre com o visual completo: o HTML e o CSS estão certos (o arquivo se
chama `sytle.css`, com o typo, mas o `<link>` procura por esse mesmo nome, então
funciona). **O JavaScript inteiro está desligado.**

Console:

```
SyntaxError: Unexpected token 'var'
```

Linha 69 do `script.js`:

```js
cadastroResult.style.color = var(--secondary);
```

`var(--secondary)` é sintaxe de **CSS** escrita dentro do **JavaScript**. E um
erro de sintaxe não estraga só aquela linha: o navegador não consegue interpretar
o arquivo, então **nenhuma das 114 linhas roda**. Botões, menu, formulário —
nada responde.

O que torna esse erro tão bom para estudar é que a página *parece* certa. Só
abrindo o console é que se descobre que metade do projeto nunca chegou a existir.

> Em JavaScript, para ler uma variável de CSS, o caminho é outro:
> `getComputedStyle(document.documentElement).getPropertyValue("--secondary")`.
> Mas **não corrija o arquivo** — o valor dele aqui é justamente estar errado.

## Por que fica assim

A decisão completa está em [`../docs/MATERIAL-PRESERVADO.md`](../docs/MATERIAL-PRESERVADO.md).
