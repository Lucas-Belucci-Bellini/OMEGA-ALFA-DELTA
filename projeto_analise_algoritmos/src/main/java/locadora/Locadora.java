package locadora;

/**
 * Coordena as operações principais do sistema da locadora.
 *
 * <p>A classe concentra consultas sobre a frota e os clientes, cálculos de
 * locação e o cálculo agregado introduzido na extensão do trabalho.</p>
 */
public class Locadora {

    /**
     * Cria uma instância da coordenadora da locadora.
     */
    public Locadora() {
        // A classe não mantém estado entre as operações.
    }

    private static final double[] TABELA_PRECOS = {90.0, 130.0, 180.0};
    private static final int[] LIMIARES_DIAS = {3, 7, 15};
    private static final double[] DESCONTOS = {0.05, 0.10, 0.20};
    private static final double MULTA_POR_DIA = 40.0;
    private static final double DESCONTO_LOCACAO_APTA = 0.15;

    /**
     * Conta os carros disponíveis em uma frota.
     *
     * @param carros frota a ser consultada; valores nulos são ignorados
     * @return quantidade de carros disponíveis, ou zero se a frota for nula
     */
    public int contarCarrosDisponiveis(Carro[] carros) {
        int total = 0;
        if (carros == null) {
            return total;
        }

        for (Carro carro : carros) {
            if (carro != null && carro.isDisponivel()) {
                total++;
            }
        }
        return total;
    }

    /**
     * Soma o valor da diária de todos os carros da frota.
     *
     * @param carros frota cujas diárias serão somadas; valores nulos são ignorados
     * @return soma dos valores das diárias, ou zero se a frota for nula ou vazia
     */
    public double calcularReceitaTotalFrota(Carro[] carros) {
        double total = 0.0;
        if (carros == null) {
            return total;
        }

        for (Carro carro : carros) {
            if (carro != null) {
                total += carro.getValorDiaria();
            }
        }
        return total;
    }

    /**
     * Calcula a média inteira das idades dos clientes informados.
     *
     * <p>Como o retorno é inteiro, a divisão utiliza truncamento. Para uma
     * lista nula, vazia ou composta somente por valores nulos, o método retorna
     * zero.</p>
     *
     * @param clientes clientes considerados no cálculo
     * @return média inteira das idades, ou zero quando não há clientes válidos
     */
    public int calcularMediaIdadeClientes(Cliente[] clientes) {
        if (clientes == null || clientes.length == 0) {
            return 0;
        }

        int soma = 0;
        int quantidade = 0;
        for (Cliente cliente : clientes) {
            if (cliente != null) {
                soma += cliente.getIdade();
                quantidade++;
            }
        }
        return quantidade == 0 ? 0 : soma / quantidade;
    }

    /**
     * Busca, entre os clientes informados, o cliente de maior idade.
     *
     * @param clientes clientes que serão percorridos
     * @return cliente mais velho, ou {@code null} se não houver cliente válido
     */
    public Cliente buscarClienteMaisVelho(Cliente[] clientes) {
        Cliente maisVelho = null;
        if (clientes == null) {
            return null;
        }

        for (Cliente cliente : clientes) {
            if (cliente != null
                    && (maisVelho == null || cliente.getIdade() > maisVelho.getIdade())) {
                maisVelho = cliente;
            }
        }
        return maisVelho;
    }

    /**
     * Busca um carro pela placa e devolve uma descrição com modelo e valor da diária.
     *
     * @param carros frota pesquisada
     * @param placa placa procurada
     * @return descrição do carro encontrado ou uma mensagem informando que ele não foi encontrado
     */
    public String buscarCarroPorPlaca(Carro[] carros, String placa) {
        if (carros != null && placa != null) {
            for (Carro carro : carros) {
                if (carro != null && placa.equals(carro.getPlaca())) {
                    return carro.getModelo() + " - R$" + carro.getValorDiaria() + "/dia";
                }
            }
        }
        return "Carro não encontrado.";
    }

    /**
     * Calcula a multa por atraso, cobrando R$ 40,00 por dia de atraso.
     *
     * @param diasAtraso quantidade de dias de atraso; valores negativos são tratados como zero
     * @return valor total da multa
     */
    public double calcularMultaAtraso(int diasAtraso) {
        if (diasAtraso <= 0) {
            return 0.0;
        }
        return diasAtraso * MULTA_POR_DIA;
    }

    /**
     * Processa uma locação completa.
     *
     * <p>O valor bruto é calculado pela soma da diária do carro com a diária do
     * seguro, multiplicada pela quantidade de dias. Em seguida, é aplicado um
     * desconto de 15% somente quando o cliente está apto <em>e</em> a locação
     * possui pelo menos sete dias.</p>
     *
     * @param carro carro que será alugado
     * @param cliente cliente responsável pela locação
     * @param seguro seguro contratado
     * @param dias quantidade de dias da locação
     * @return valor final da locação
     * @throws IllegalArgumentException se algum argumento obrigatório for nulo ou se a quantidade de dias não for positiva
     * @throws IllegalStateException se o carro estiver indisponível
     */
    public double processarLocacaoCompleta(Carro carro, Cliente cliente, Seguro seguro, int dias) {
        if (carro == null || cliente == null || seguro == null) {
            throw new IllegalArgumentException("Carro, cliente e seguro são obrigatórios");
        }
        if (dias <= 0) {
            throw new IllegalArgumentException("A quantidade de dias deve ser positiva");
        }

        validarLocacao(carro);
        double valorBruto = calcularValorBruto(carro, seguro, dias);
        return aplicarDescontosEEncargos(valorBruto, cliente, dias);
    }

    /**
     * Verifica se o carro está disponível para locação.
     *
     * @param carro carro a ser validado
     * @throws IllegalStateException se o carro estiver indisponível
     */
    private void validarLocacao(Carro carro) {
        if (!carro.isDisponivel()) {
            throw new IllegalStateException("Carro indisponível");
        }
    }

    /**
     * Calcula o valor bruto de uma locação.
     *
     * @param carro carro alugado
     * @param seguro seguro contratado
     * @param dias quantidade de dias
     * @return valor bruto da locação
     */
    private double calcularValorBruto(Carro carro, Seguro seguro, int dias) {
        return (carro.getValorDiaria() + seguro.getValorDiario()) * dias;
    }

    /**
     * Aplica o desconto condicional da locação.
     *
     * @param valorBruto valor antes do desconto
     * @param cliente cliente da locação
     * @param dias quantidade de dias contratados
     * @return valor com desconto, quando as duas condições forem atendidas
     */
    private double aplicarDescontosEEncargos(double valorBruto, Cliente cliente, int dias) {
        if (cliente.isApto() && dias >= 7) {
            return valorBruto * (1.0 - DESCONTO_LOCACAO_APTA);
        }
        return valorBruto;
    }

    /**
     * Calcula o valor de um aluguel a partir da categoria do veículo.
     *
     * @param categoria categoria do veículo, entre zero e dois
     * @param dias quantidade de dias do aluguel
     * @return valor da diária da categoria multiplicado pela quantidade de dias
     * @throws IllegalArgumentException se a categoria ou a quantidade de dias for inválida
     */
    public double calcularDiariaComCategoria(int categoria, int dias) {
        if (categoria < 0 || categoria >= TABELA_PRECOS.length) {
            throw new IllegalArgumentException("Categoria deve estar entre 0 e 2");
        }
        if (dias < 0) {
            throw new IllegalArgumentException("A quantidade de dias não pode ser negativa");
        }
        return TABELA_PRECOS[categoria] * dias;
    }

    /**
     * Gera um resumo com a quantidade de carros disponíveis e o valor médio da
     * diária somente entre os carros disponíveis.
     *
     * @param carros frota que será resumida
     * @return texto com a quantidade de disponíveis e a média das diárias
     */
    public String gerarResumoFrota(Carro[] carros) {
        int disponiveis = 0;
        double somaValores = 0.0;
        if (carros != null) {
            for (Carro carro : carros) {
                if (carro != null && carro.isDisponivel()) {
                    disponiveis++;
                    somaValores += carro.getValorDiaria();
                }
            }
        }

        double media = disponiveis == 0 ? 0.0 : somaValores / disponiveis;
        return disponiveis + " carro(s) disponivel(is), media de R$" + media + "/dia";
    }

    /**
     * Aplica um desconto escalonado ao valor base conforme a quantidade de dias.
     *
     * <p>São aplicados 5% para três ou mais dias, 10% para sete ou mais dias e
     * 20% para quinze ou mais dias. O maior limiar atingido prevalece.</p>
     *
     * @param valorBase valor antes do desconto
     * @param dias quantidade de dias do aluguel
     * @return valor após a aplicação do desconto correspondente
     * @throws IllegalArgumentException se a quantidade de dias for negativa
     */
    public double calcularDescontoEscalonado(double valorBase, int dias) {
        if (dias < 0) {
            throw new IllegalArgumentException("A quantidade de dias não pode ser negativa");
        }

        double desconto = 0.0;
        for (int i = 0; i < LIMIARES_DIAS.length; i++) {
            if (dias >= LIMIARES_DIAS[i]) {
                desconto = DESCONTOS[i];
            }
        }
        return valorBase * (1.0 - desconto);
    }

    /**
     * Verifica se o cliente tem direito ao desconto de fidelidade.
     *
     * <p>O cliente precisa ter pelo menos 25 anos e pelo menos três locações
     * anteriores.</p>
     *
     * @param cliente cliente avaliado
     * @param totalLocacoesAnteriores quantidade de locações anteriores
     * @return {@code true} quando as duas condições de fidelidade são atendidas
     */
    public boolean clienteElegivelDescontoFidelidade(Cliente cliente, int totalLocacoesAnteriores) {
        return cliente != null
                && cliente.getIdade() >= 25
                && totalLocacoesAnteriores >= 3;
    }

    /**
     * Soma o valor das diárias de itens de tipos diferentes por meio da abstração
     * {@link Alugavel}.
     *
     * @param alugaveis itens alugáveis que serão percorridos
     * @return soma das diárias, ou zero quando o conjunto for nulo ou vazio
     */
    public double calcularValorTotalDiarias(Alugavel[] alugaveis) {
        double total = 0.0;
        if (alugaveis == null) {
            return total;
        }

        for (Alugavel alugavel : alugaveis) {
            if (alugavel != null) {
                total += alugavel.calcularValorDiaria();
            }
        }
        return total;
    }
}
