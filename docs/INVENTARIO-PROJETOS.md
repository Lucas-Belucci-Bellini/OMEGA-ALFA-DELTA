# Inventário de projetos — OMEGA-ALFA-DELTA

> Auditoria de leitura, feita **antes de qualquer alteração de código**.
> Data: 2026-09-02 · Base: commit `23d9d60` (`main`).
>
> Este documento é o retrato do repositório **como ele estava encontrado**. Ele não
> descreve o estado desejado — para isso veja [`estrutura-projetos.md`](estrutura-projetos.md)
> — nem o andamento das correções, que fica em [`STATUS-PROJETOS.md`](STATUS-PROJETOS.md).

## 1. Visão geral

O repositório contém **12 diretórios de primeiro nível** que se dividem em quatro
naturezas diferentes, e não em uma só como o README sugeria:

| Natureza | Quantidade | Diretórios |
| --- | --- | --- |
| Projeto web ativo | 4 | `cloneYou`, `wiki-modern-warfare`, `portfolio-talles`, `estacao-pc` |
| Material original preservado (web) | 5 | `ALFA`, `site_DuDuzinVideoJogus_01`, `site_pedrocamposcoimbra8-afk_01`, `site_felipebrayan1403-cell_01`, `site_ajuda_pensamento_01` |
| Projeto Java (não documentado no README) | 2 | `projeto_analise_algoritmos`, `projeto_analise_algoritmos_corrigido` |
| Documentação central | 1 | `docs` |

Tamanho em disco: **23 MB**, dos quais **20 MB (87%)** são um único diretório —
o JDK do Windows versionado dentro de `projeto_analise_algoritmos_corrigido`.

## 2. Tabela de inventário

| Projeto | Local atual | Tipo | Estado | Independente? | Problemas |
| --- | --- | --- | --- | --- | --- |
| **cloneYou** | `cloneYou/` | Web estático (HTML/CSS/JS) + 2 módulos opcionais | Ativo, o mais completo (1199 linhas de CSS, 490 de JS) | ✅ Sim — só caminhos próprios (`./css`, `./js`) | Guarda em `docs/` a validação **de outros três projetos**; testes do módulo opcional não têm runner declarado |
| **wiki-modern-warfare** | `wiki-modern-warfare/` | Web estático | Ativo, funcional | ✅ Sim | `assets/ghost-price-team.png` (2,2 MB) **não é referenciado por ninguém**; `ghost-price.jpg` tem 238 KB sem redimensionamento |
| **portfolio-talles** | `portfolio-talles/` | Web estático | Ativo, funcional | ✅ Sim | `assets/portfolio-reference.png` (263 KB) **não é referenciado**; JS com apenas 24 linhas para um menu mobile |
| **estacao-pc** | `estacao-pc/` | Web estático | Ativo, funcional | ✅ Sim | Fontes do Google carregadas **duas vezes** (`<link>` no HTML **e** `url()` dentro do CSS) |
| **ALFA** | `ALFA/` | Original preservado | 🔴 **Quebrado** | ✅ Sim (isolado), mas não funciona | `<link href="style.css">` aponta para arquivo inexistente — o arquivo real chama-se `stlye.css` (typo). As **9 imagens** (`.jfif`/`.jpg`) referenciadas **não existem no repositório** |
| **site_DuDuzinVideoJogus_01** | `site_DuDuzinVideoJogus_01/` | Original preservado | 🟡 Parcial | ✅ Sim | `<script src="./script.js">` aponta para arquivo que **não existe** → erro 404 no console. CSS carrega normalmente |
| **site_pedrocamposcoimbra8-afk_01** | `site_pedrocamposcoimbra8-afk_01/` | Original preservado | 🔴 **Sem estilo** | ✅ Sim | O HTML **não tem nenhuma tag `<link>`**; o arquivo `stlye.css` (16 linhas) existe mas está órfão. A página abre sem CSS |
| **site_felipebrayan1403-cell_01** | `site_felipebrayan1403-cell_01/` | Original preservado | 🔴 **Sem estilo** | ✅ Sim | `<link href="cdd/style.css">` — o diretório `cdd/` **não existe**. Todas as imagens são hotlink de sites externos (kabum, globo, gstatic) |
| **site_ajuda_pensamento_01** | `site_ajuda_pensamento_01/` | Original preservado | 🟢 Funcional | ✅ Sim | Nome de arquivo com typo (`sytle.css`), mas o `<link>` aponta para o nome certo — funciona. É o maior dos originais (559 linhas de HTML) |
| **projeto_analise_algoritmos** | `projeto_analise_algoritmos/` | Java/Maven (trabalho acadêmico) | 🔴 **Não compilava** — corrigido depois. Tem `src/` completo (11 classes, 1120 linhas) | ✅ Sim | Duas vírgulas faltando no array de clientes de `Main.java` derrubavam a compilação inteira. Não é mencionado no README nem em `estrutura-projetos.md`. Sem `.gitignore` para `target/` |
| **projeto_analise_algoritmos_corrigido** | `projeto_analise_algoritmos_corrigido/` | Java/Maven | 🔴 **Não compila — `src/` ausente** | ❌ Não — depende do `src/` do diretório irmão | **Duplicata incompleta.** Tem `README`/`EXTENSAO`/`JUSTIFICATIVAS`/`pom.xml` idênticos ao irmão, javadoc **gerado** (`docs/apidocs/`) e um **JDK 26 do Windows inteiro versionado** (`oracleJdk-26/`, 20 MB, `.exe`/`.dll` sob licença proprietária Oracle) |

## 3. Dependências entre projetos

**Boa notícia:** nenhum projeto web carrega CSS, JS ou imagem de outro projeto.
A varredura de todos os `href=`/`src=`/`url()` do repositório não encontrou
nenhuma referência do tipo `../outro-projeto/`. Os únicos caminhos que sobem de
diretório são internos ao `cloneYou` (os módulos opcionais voltando para a
página principal com `../../index.html`), o que é legítimo.

Existem, porém, **duas dependências que não são de código**:

1. **Documentação fora de lugar.** `cloneYou/docs/validacao-novos-projetos.md`
   documenta a validação de `wiki-modern-warfare`, `portfolio-talles` e
   `estacao-pc`. É documentação de três projetos morando dentro de um quarto.
   *(Desfeito: cada projeto absorveu a sua parte e o arquivo saiu.)*
2. **`projeto_analise_algoritmos_corrigido` → `projeto_analise_algoritmos`.**
   O primeiro só tem sentido lido junto com o segundo, porque o código-fonte que
   ele documenta está no outro diretório.

## 4. Origem e parentesco dos diretórios preservados

| Pasta original | Relação com os projetos ativos | Decisão proposta |
| --- | --- | --- |
| `site_DuDuzinVideoJogus_01` | Uma das três fontes do `cloneYou` (registrado em `cloneYou/docs/integracao-fontes.md`) | **Preservar** como referência de aprendizagem |
| `site_pedrocamposcoimbra8-afk_01` | Base original do `wiki-modern-warfare` (Pedro) | **Preservar** |
| `site_felipebrayan1403-cell_01` | Scaffold original do `estacao-pc` (Felipe) | **Preservar** |
| `site_ajuda_pensamento_01` | Projeto independente, sem sucessor ativo | **Preservar** |
| `ALFA` | Pasta original adicional, sem sucessor ativo | **Preservar** |

Nenhum deles é duplicata descartável: cada um é a **versão de partida** de algo,
ou um projeto sem sucessor. Nada aqui deve ser apagado. O que falta é dizer, em
cada um, que ele **está quebrado de propósito** — porque é assim que ele foi
entregue — para que ninguém tente "consertar" o histórico.

> O `portfolio-talles` é o único projeto ativo cuja pasta original não está no
> repositório; a referência dele é a imagem `assets/portfolio-reference.png`.

## 5. Achados que atravessam o repositório

| # | Achado | Gravidade | Onde |
| --- | --- | --- | --- |
| 1 | JDK proprietário do Windows versionado (20 MB, 87% do repo) | 🔴 Alta | `projeto_analise_algoritmos_corrigido/oracleJdk-26/` |
| 2 | Projeto Java duplicado sem `src/` — não compila | 🔴 Alta | `projeto_analise_algoritmos_corrigido/` |
| 3 | Três originais com CSS/JS quebrado por typo ou caminho errado | 🟡 Média | `ALFA`, `site_felipebrayan1403-cell_01`, `site_DuDuzinVideoJogus_01` |
| 4 | 2,5 MB de imagens não referenciadas | 🟡 Média | `wiki-modern-warfare`, `portfolio-talles` |
| 5 | Sem `.gitignore` (nem `target/` do Maven, nem `.DS_Store`) | 🟡 Média | raiz |
| 6 | Documentação de 3 projetos dentro de um 4º | 🟡 Média | `cloneYou/docs/` |
| 7 | Dois projetos Java invisíveis na documentação central | 🟡 Média | `README.md`, `docs/estrutura-projetos.md` |
| 8 | Nenhum projeto tem `tests/`, exceto um módulo opcional do cloneYou | 🟢 Baixa | todos |
| 9 | **Projeto Java não compila** — duas vírgulas faltando em `Main.java` | 🔴 Alta | `projeto_analise_algoritmos/` |

> **Correção do próprio inventário.** A primeira versão desta tabela dizia que
> `projeto_analise_algoritmos` era "compilável", porque ele tem o `src/` completo.
> Isso era suposição, não medição: ao rodar o `javac`, ele falhou com sete erros
> em cascata. A linha foi corrigida e o achado nº 9 acrescentado. Vale como
> lembrete de que "parece completo" não é o mesmo que "funciona".

## 6. O que esta auditoria **não** fez

- Não alterou nenhum arquivo de código.
- Não abriu as páginas em navegador com interação real — os problemas de
  carregamento acima vêm da conferência de caminhos no sistema de arquivos, que
  é verificável e reproduzível (`docs/auditoria.md` de cada projeto detalha).
- Não julgou o mérito didático dos projetos, só a saúde técnica deles.
