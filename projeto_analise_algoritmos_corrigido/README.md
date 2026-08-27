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

A documentação HTML entregue está em [`docs/apidocs/index.html`](docs/apidocs/index.html). Para regenerá-la, use:

```bash
mvn javadoc:javadoc
```

O comando gera os arquivos em `target/site/apidocs`. Se for necessário atualizar a cópia entregue em `docs/apidocs`, copie esse diretório após a geração.

## Estrutura da entrega

A entrega contém:

- `src/main/java/locadora/` com todas as classes do projeto;
- `pom.xml` com a configuração Maven;
- `JUSTIFICATIVAS.md` preenchido;
- `EXTENSAO.md` com os requisitos da extensão;
- `docs/apidocs/` com a documentação HTML gerada;
- este `README.md`.
