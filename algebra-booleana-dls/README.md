# Atividade de Álgebra Booleana — Digital Logic Sim (Unifil)

Projeto completo do **Digital Logic Sim — Unifil Edition** com todos os
circuitos da atividade de Álgebra Booleana, construídos **do zero a partir da
porta NAND**.

Compatível com [Digital-Logic-Sim-Unifil](https://github.com/Eronponce/Digital-Logic-Sim-Unifil)
v2.3.0 (formato de save `ChipDescription` v2.3.0).

---

## O que tem aqui

| Arquivo | Conteúdo |
|---|---|
| `Projects/ALGEBRA-BOOLEANA/` | O projeto pronto para abrir no simulador (35 chips) |
| `SOLUCOES.md` | Resposta escrita das 5 questões, passo a passo |
| `gerar_circuitos.py` | Gera todos os chips do zero |
| `verificar_circuitos.py` | Simula os JSON até a NAND e confere as tabelas-verdade |
| `circuito-questao-5.png` | Circuito do enunciado da questão 5 |

---

## Como instalar

Copie a pasta `Projects/ALGEBRA-BOOLEANA` para dentro da pasta `Projects` do
simulador e abra o projeto pelo menu principal.

**Windows**

```
%USERPROFILE%\AppData\LocalLow\SebastianLague\Digital-Logic-Sim\Projects\
```

**Linux**

```
~/.config/unity3d/SebastianLague/Digital-Logic-Sim/Projects/
```

**Rodando pelo Unity (editor)** — a pasta é `TestData/Projects/` na raiz do
repositório do simulador.

Depois de copiar, o projeto **ALGEBRA-BOOLEANA** aparece na lista de projetos.

---

## Os circuitos

### Básicos de 1 bit — tudo a partir da NAND

Só a NAND é embutida. Todo o resto é construído em cima dela:

| Chip | Construção | Portas NAND no total |
|---|---|---|
| `NOT` | `NAND(A, A)` | 1 |
| `AND` | `NOT(NAND(A, B))` | 2 |
| `OR` | `NAND(~A, ~B)` — De Morgan | 3 |
| `NOR` | `NOT(OR(A, B))` | 4 |
| `XOR` | `(A + B) · ~(A · B)` | 6 |
| `XNOR` | `NOT(XOR(A, B))` | 7 |

### Básicos de 4 e 8 bits

Mesmas sete famílias, agora operando em barramento inteiro:

```
NOT-4  AND-4  NAND-4  OR-4  NOR-4  XOR-4  XNOR-4
NOT-8  AND-8  NAND-8  OR-8  NOR-8  XOR-8  XNOR-8
```

Estrutura de cada banco:

```
IN-N ──▶ [SPLIT N→1] ──▶ N cópias da porta de 1 bit ──▶ [MERGE 1→N] ──▶ OUT-N
```

O split entrega o bit `i` na saída de ID `1+i` e o merge recebe o bit `i` na
entrada de ID `i` — a ligação é direta, bit a bit, mantendo a ordem.

### Circuitos da atividade

| Chip | Questão | O que mostra |
|---|---|---|
| `Q1-IDENTIDADES` | 1 | As 6 identidades, cada uma numa saída |
| `Q2-ASSOCIATIVA-OU` | 2a | `A+(B+C)` e `(A+B)+C` lado a lado |
| `Q2-ASSOCIATIVA-E` | 2b | `(A·B)·C` e `A·(B·C)` lado a lado |
| `Q3-DISTRIBUTIVA` | 3a/3b | `A·(B+C)` e `A·B+A·C` lado a lado |
| `Q3-FATORACAO` | 3d | `MN + ~MN` e `N` lado a lado |
| `Q4-1` … `Q4-5` | 4 | Cada expressão: original **e** simplificada |
| `Q5-ORIGINAL` | 5 | O circuito do enunciado (3 portas) |
| `Q5-SIMPLIFICADO` | 5 | O resultado da simplificação (1 porta) |
| `Q5-COMPARACAO` | 5 | Os dois juntos, mesmas entradas |

Os chips de comparação têm **duas saídas** alimentadas pelas **mesmas
entradas**. Ao clicar nos pinos de entrada, as duas saídas acendem sempre
juntas — é a prova visual de que a simplificação está certa.

Auxiliares: `CONST-0` e `CONST-1` geram os níveis fixos 0 e 1 (necessários
para `A+0`, `B+1`, `D·1`, `E·0` e `ABC+1`). `CONST-1` é uma NAND com as duas
entradas soltas — entrada solta vale 0, então `NAND(0,0) = 1`.

---

## Regenerar e verificar

```bash
python3 gerar_circuitos.py      # recria os 35 chips
python3 verificar_circuitos.py  # confere tudo
```

O verificador **não confia no gerador**: ele lê os arquivos JSON do disco do
mesmo jeito que o simulador leria, resolve cada chip customizado
recursivamente até chegar na NAND e compara com a tabela-verdade esperada.

Resultado atual:

```
TODOS OS CIRCUITOS CORRETOS - 2751 casos de teste, 35 chips, tudo reduzido a NAND.
```

Cobertura: exaustiva para 1 bit e 4 bits (todas as combinações de entrada),
amostragem ampla para 8 bits, exaustiva para os circuitos da atividade.

---

## Formato dos arquivos

Segue `Assets/Scripts/Description/Types/ChipDescription.cs` do simulador. Dois
detalhes que costumam quebrar arquivos escritos à mão:

**IDs de pino dependem do tipo do chip.** Chip embutido usa índices
sequenciais — a NAND tem entradas `0` e `1` e saída `2`. Chip customizado usa
os IDs declarados no próprio arquivo dele, então o chip pai precisa referenciar
exatamente aqueles números.

**Pino do próprio chip usa `PinID: 0`.** Numa ligação que sai de uma entrada do
chip (ou chega numa saída), o `PinID` é sempre `0` e o `PinOwnerID` é o ID do
pino.

```json
{
  "SourcePinAddress": { "PinID": 0, "PinOwnerID": 464622 },
  "TargetPinAddress": { "PinID": 1, "PinOwnerID": 464650 }
}
```
