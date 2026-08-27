# Justificativas das correções

## 1. `contarCarrosDisponiveis`

**Tinha bug?** Não havia bug lógico para uma entrada normal.

**Explicação:** O método já percorria toda a frota e contava os carros cujo estado era disponível. A correção acrescentou tratamento seguro para frota nula, posições nulas e documentação Javadoc, sem alterar o resultado esperado para entradas válidas.

## 2. `calcularReceitaTotalFrota`

**Tinha bug?** Sim.

**Explicação:** O laço começava em `i = 1`, portanto o primeiro carro da frota nunca era incluído na soma. A correção percorre todos os elementos, começando pelo índice zero, e ignora apenas posições nulas. Assim, a receita representa a soma das diárias de toda a frota.

## 3. `calcularMediaIdadeClientes`

**Tinha bug?** Sim.

**Explicação:** Quando o array estava vazio, a divisão por `clientes.length` provocava `ArithmeticException`. A correção retorna zero quando não há clientes válidos e calcula a média considerando somente os clientes presentes. Para manter a assinatura original, o resultado continua sendo uma média inteira com truncamento.

## 4. `buscarClienteMaisVelho`

**Tinha bug?** Não havia bug lógico para um array com clientes.

**Explicação:** O método inicializava o maior cliente com `null` e substituía esse valor quando encontrava o primeiro cliente ou alguém mais velho. Essa estratégia está correta e foi preservada. A implementação também passou a lidar com array nulo e posições nulas, retornando `null` quando não existe cliente válido.

## 5. `buscarCarroPorPlaca`

**Tinha bug?** Sim.

**Explicação:** Quando a placa não existia, o método tentava acessar os atributos de `encontrado`, que continuava `null`, causando `NullPointerException`. A correção retorna uma mensagem explícita quando não há correspondência e usa a comparação `placa.equals(...)` somente depois de validar que a placa procurada não é nula.

## 6. `calcularMultaAtraso`

**Tinha bug?** Sim.

**Explicação:** O laço usava `i <= diasAtraso`, cobrando uma diária a mais. Para três dias, por exemplo, o resultado era R$ 160,00 em vez de R$ 120,00. A correção calcula diretamente `diasAtraso * 40`, trata atrasos negativos como zero e deixa clara a regra por meio de uma constante.

## 7. `processarLocacaoCompleta`

**Tinha bug?** Sim.

**Explicação:** A condição original usava `cliente.isApto() || dias >= 7`, aplicando o desconto quando apenas uma das condições era verdadeira. O requisito exige que o cliente esteja apto **e** que a locação tenha pelo menos sete dias, portanto a correção usa `&&`. Também foram adicionadas validações para argumentos nulos, quantidade de dias inválida e seguro inexistente.

## 8. `calcularDiariaComCategoria`

**Tinha bug?** Não havia bug para categorias de zero a dois e quantidades de dias válidas.

**Explicação:** O método já consultava a tabela correta e multiplicava o valor da categoria pelos dias. A correção acrescentou validação explícita de categoria e de quantidade de dias, evitando erros de índice pouco informativos e documentando o contrato do método.

## 9. `gerarResumoFrota`

**Tinha bug?** Não havia bug lógico para uma frota válida.

**Explicação:** O método contava os carros disponíveis, somava apenas suas diárias e evitava divisão por zero quando não havia nenhum disponível. A correção preservou essa lógica, adicionou tratamento para frota nula e posições nulas e documentou o comportamento.

## 10. `calcularDescontoEscalonado`

**Tinha bug?** Sim.

**Explicação:** O laço usava `i <= LIMIARES_DIAS.length`. Como o último índice válido é `length - 1`, isso causava `ArrayIndexOutOfBoundsException`. A correção usa `i < LIMIARES_DIAS.length`; desse modo, o maior limiar atingido continua substituindo o desconto anterior, produzindo 5%, 10% ou 20% conforme a quantidade de dias.

## 11. `clienteElegivelDescontoFidelidade`

**Tinha bug?** Sim.

**Explicação:** O requisito diz “pelo menos 25 anos”, mas o código usava `idade > 25`, excluindo incorretamente clientes com exatamente 25 anos. A correção usa `idade >= 25`, mantém a exigência de pelo menos três locações anteriores e trata cliente nulo como não elegível.

# Extensão — Parte 2

## Abstração `Alugavel`

Foi escolhida uma **interface**, pois carro, moto e van são tipos diferentes de veículos, mas compartilham um pequeno contrato de locação. A interface declara `calcularValorDiaria()`, `isDisponivel()` e `getDescricao()`. Essa escolha favorece composição e polimorfismo sem forçar uma relação de herança entre classes com dados específicos diferentes.

## Classes que implementam a abstração

`Carro`, `Moto` e `Van` implementam `Alugavel`. Na `Moto`, a cilindrada acrescenta R$ 0,05 por centímetro cúbico à diária base. Na `Van`, a capacidade de carga acrescenta R$ 30,00 por tonelada à diária base. Assim, cada classe calcula sua diária de acordo com uma característica própria.

## Método agregador

O método `Locadora.calcularValorTotalDiarias(Alugavel[] alugaveis)` percorre exclusivamente o contrato `Alugavel` e soma o resultado de `calcularValorDiaria()`. Ele não precisa verificar se cada item é carro, moto ou van, demonstrando o uso de polimorfismo com tipos variados.

## Classes adicionais

Foram criadas as classes `Reserva`, `Pagamento` e `Manutencao`, todas relacionadas ao contexto da locadora. `Reserva` associa cliente, item alugável e período; `Pagamento` registra valor, forma e aprovação; e `Manutencao` registra serviço, custo e conclusão para um item da frota. Todas foram documentadas integralmente com Javadoc.
