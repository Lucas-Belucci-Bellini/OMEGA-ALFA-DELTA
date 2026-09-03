# Projeto de Análise de Algoritmos — Locadora

Projeto Maven em Java 8 para demonstrar operações de uma locadora de veículos, correção de bugs lógicos e de execução, documentação Javadoc e uso de polimorfismo.

## Como executar

É necessário ter Java 8 ou superior e Maven instalados. Na raiz do projeto, execute:

```bash
mvn clean package
java -cp target/classes locadora.Main
```

A aplicação apresenta um menu interativo. Para encerrá-la, escolha a opção `0`.

## Parte 1

A classe `Locadora` contém os 11 métodos solicitados:

1. Contar carros disponíveis.
2. Calcular a receita total da frota.
3. Calcular a média de idade dos clientes.
4. Buscar o cliente mais velho.
5. Buscar carro por placa.
6. Calcular multa por atraso.
7. Processar uma locação completa.
8. Calcular diária por categoria.
9. Gerar resumo da frota.
10. Calcular desconto escalonado.
11. Verificar elegibilidade para desconto de fidelidade.

As correções e suas justificativas estão descritas em [`JUSTIFICATIVAS.md`](JUSTIFICATIVAS.md).

## Parte 2 — extensão

A interface `Alugavel` define o contrato comum para itens que podem ser alugados. As classes `Carro`, `Moto` e `Van` implementam essa interface. A diária da moto depende da cilindrada e a diária da van depende da capacidade de carga.

O método `Locadora.calcularValorTotalDiarias(Alugavel[])` soma diárias de uma frota mista sem verificar a classe concreta de cada item.

Também foram incluídas as classes contextuais `Reserva`, `Pagamento` e `Manutencao`.

## Documentação Javadoc

O Javadoc **não fica versionado**: ele é gerado a partir do código-fonte, então
uma cópia guardada no repositório só serve para envelhecer e discordar do código.
Para gerar:

```bash
mvn javadoc:javadoc
```

O comando escreve em `target/site/apidocs`, que o `.gitignore` mantém fora do
controle de versão. Abra `target/site/apidocs/index.html` no navegador.

## Estrutura

```text
projeto_analise_algoritmos/
├── src/main/java/locadora/   # as 11 classes
├── pom.xml                   # configuração Maven
├── JUSTIFICATIVAS.md         # o que estava errado em cada método e por quê
├── EXTENSAO.md               # requisitos da Parte 2
├── ENUNCIADO.md              # o enunciado original do trabalho
└── README.md
```

## Compilar sem Maven

Se o Maven não estiver disponível, o `javac` dá conta — o projeto não tem
nenhuma dependência externa:

```bash
javac -d target/classes -encoding UTF-8 src/main/java/locadora/*.java
java -cp target/classes locadora.Main
```

## Histórico deste projeto no repositório

Até este ciclo de organização, o trabalho estava **partido em duas pastas**, e
nenhuma das duas funcionava sozinha:

| Pasta | O que tinha | O que faltava |
| --- | --- | --- |
| `projeto_analise_algoritmos` | o `src/` com as 11 classes | o README da entrega — o que havia era o enunciado do professor |
| `projeto_analise_algoritmos_corrigido` | este README, o Javadoc gerado e um JDK do Windows inteiro (20 MB) | **o `src/`** — ou seja, não compilava, e o README dizia que a entrega continha um `src/` que não estava lá |

As duas foram unidas aqui. O que saiu, e por quê:

- **`oracleJdk-26/` (20 MB, 87% do repositório).** Um JDK é uma ferramenta que
  cada pessoa instala na própria máquina, não um arquivo de projeto. Além disso
  eram binários `.exe`/`.dll` de Windows sob licença proprietária da Oracle,
  redistribuídos sem licença junto de um trabalho escolar.
- **`docs/apidocs/` (Javadoc gerado).** Saída de ferramenta, refeita com um
  comando — e que documentava um código que nem estava na mesma pasta.
- **`EXTENSAO.md`, `JUSTIFICATIVAS.md` e `pom.xml` da pasta duplicada.** Cópias
  byte a byte das que ficaram aqui (conferido por `md5sum`).

Nada se perdeu: tudo continua no histórico do Git. Para ver a pasta como ela era:

```bash
git show a999bcb:projeto_analise_algoritmos_corrigido/README.md
```

Também foi corrigido um defeito que impedia a compilação: faltavam duas vírgulas
no array de clientes de `Main.java`, e o `javac` parava com sete erros em cascata.
