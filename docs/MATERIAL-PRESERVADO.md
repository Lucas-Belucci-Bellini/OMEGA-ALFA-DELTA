# Material preservado — o que fica, o que sai, e por quê

Este documento fecha a última etapa da reorganização: decidir o que fazer com os
**cinco diretórios originais** e com os **dois diretórios do projeto Java**.

A regra que guiou tudo: *nunca apagar material original sem documentar a decisão*.
Onde algo saiu, está escrito o quê, por quê, e o comando para trazer de volta.

## 1. Os cinco diretórios originais — **todos ficam, todos intocados**

Eles são o começo da história: a versão que cada aluno escreveu antes da versão
organizada. É o que permite abrir as duas lado a lado e ver o que mudou.

**Nenhum arquivo original foi editado.** Cada pasta ganhou apenas um
`LEIA-ME.md` novo, que explica o que é aquilo e avisa que os defeitos são para
ficar. Nenhum arquivo `.html`, `.css` ou `.js` foi tocado.

### Estado real de cada um (medido no navegador, não suposto)

| Pasta | O que acontece ao abrir | Origem de |
| --- | --- | --- |
| `ALFA` | 🔴 **Sem estilo e sem imagens.** O `<link>` pede `style.css`, mas o arquivo se chama `stlye.css`. As 9 imagens `.jfif`/`.jpg` referenciadas nunca foram para o repositório. | — (sem sucessor ativo) |
| `site_DuDuzinVideoJogus_01` | 🟡 **Estilo carrega, script não existe.** O `<script src="./script.js">` aponta para um arquivo que não está lá. | uma das três fontes do `cloneYou` |
| `site_pedrocamposcoimbra8-afk_01` | 🔴 **Sem estilo nenhum.** O HTML não tem tag `<link>`; o `stlye.css` existe, mas ninguém o chama. | `wiki-modern-warfare` |
| `site_felipebrayan1403-cell_01` | 🔴 **Sem estilo.** O `<link>` pede `cdd/style.css`, e a pasta `cdd/` não existe. | `estacao-pc` |
| `site_ajuda_pensamento_01` | 🟡 **HTML e CSS carregam; o JavaScript inteiro está morto.** | — (sem sucessor ativo) |

### O caso mais instrutivo: `site_ajuda_pensamento_01`

A auditoria inicial classificou esta pasta como "funcional", porque o CSS
carregava. Abrindo no navegador, o console mostra:

```
SyntaxError: Unexpected token 'var'
```

Linha 69 do `script.js`:

```js
cadastroResult.style.color = var(--secondary);
```

`var(--secondary)` é sintaxe de **CSS** escrita dentro do **JavaScript**. E um
erro de sintaxe não estraga só aquela linha: o navegador não consegue nem
interpretar o arquivo, então **nenhuma das 114 linhas roda**. A página abre
bonita e não responde a nada.

É por isso que estas pastas ficam. Um erro assim, preservado do jeito que
aconteceu, ensina mais do que qualquer explicação: *a página parecia certa, e o
arquivo inteiro estava desligado.*

> **Não conserte.** Se alguém corrigir a linha 69, o repositório perde o exemplo
> e ganha nada — a versão que funciona já existe nos projetos ativos.

## 2. Os dois diretórios do projeto Java — **unidos em um**

Aqui a decisão foi diferente, porque a situação era diferente: não havia
"original" e "versão organizada". Havia **duas metades da mesma entrega**, e
nenhuma funcionava sozinha.

| Pasta | Tinha | Faltava |
| --- | --- | --- |
| `projeto_analise_algoritmos` | o `src/` com as 11 classes | o README da entrega — o que havia ali era o enunciado do professor |
| `projeto_analise_algoritmos_corrigido` | o README da entrega, o Javadoc gerado, um JDK do Windows | **o `src/`** — e o README afirmava que a entrega continha um `src/` que não estava lá |

Ficou uma pasta só, `projeto_analise_algoritmos`, que agora compila e roda.

### O que saiu, e por quê

| O que | Tamanho | Por quê |
| --- | --- | --- |
| `oracleJdk-26/` | **20 MB — 87% do repositório** | Um JDK é ferramenta que cada pessoa instala. Eram binários `.exe`/`.dll` de Windows sob licença proprietária da Oracle, redistribuídos sem licença dentro de um trabalho escolar. |
| `docs/apidocs/` | ~600 KB | Saída gerada por `mvn javadoc:javadoc`. Pior: documentava um código que não estava na mesma pasta. |
| `EXTENSAO.md`, `JUSTIFICATIVAS.md`, `pom.xml` da pasta duplicada | — | Cópias byte a byte das que ficaram, conferido por `md5sum`. |

### Um defeito real, corrigido

`Main.java` tinha **duas vírgulas faltando** no array de clientes. O `javac`
parava com sete erros em cascata, e o projeto inteiro não compilava. Depois da
correção, as 11 classes compilam e o menu do programa responde.

Este não é material preservado para estudo — é um trabalho que deveria funcionar
e não funcionava. Por isso foi corrigido, e não documentado como curiosidade.

## 3. Como recuperar qualquer coisa que saiu

Nada foi perdido: tudo continua no histórico do Git.

```bash
# a pasta Java duplicada, como ela era
git show a999bcb:projeto_analise_algoritmos_corrigido/README.md

# a imagem sem uso do wiki
git show c162ffd:wiki-modern-warfare/assets/ghost-price-team.png > recuperado.png

# a imagem de template de terceiros do portfólio
git show 7425544:portfolio-talles/assets/portfolio-reference.png > recuperado.png
```

> **Uma ressalva honesta:** apagar arquivos do diretório de trabalho **não deixa
> o clone do repositório menor**. Os 20 MB do JDK continuam no histórico. Encolher
> o histórico exigiria reescrevê-lo, o que quebraria todos os clones existentes —
> preço alto demais para um repositório de estudo. O que se ganhou foi clareza:
> quem clona hoje encontra 1 MB de projeto em vez de 23 MB, dos quais 20 MB não
> tinham nada a ver com o trabalho.
