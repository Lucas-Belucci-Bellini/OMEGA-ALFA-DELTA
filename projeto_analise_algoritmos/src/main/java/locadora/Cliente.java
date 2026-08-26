package locadora;

/**
 * Representa um cliente cadastrado na locadora.
 */
public class Cliente {

    private String nome;
    private int idade;
    private int anosHabilitado;

    /**
     * Cria um cliente.
     *
     * @param nome nome do cliente
     * @param idade idade do cliente em anos
     * @param anosHabilitado quantidade de anos desde a obtenção da habilitação
     */
    public Cliente(String nome, int idade, int anosHabilitado) {
        this.nome = nome;
        this.idade = idade;
        this.anosHabilitado = anosHabilitado;
    }

    /**
     * Retorna o nome do cliente.
     *
     * @return nome cadastrado
     */
    public String getNome() {
        return nome;
    }

    /**
     * Retorna a idade do cliente.
     *
     * @return idade em anos
     */
    public int getIdade() {
        return idade;
    }

    /**
     * Retorna o tempo de habilitação do cliente.
     *
     * @return quantidade de anos habilitado
     */
    public int getAnosHabilitado() {
        return anosHabilitado;
    }

    /**
     * Verifica se o cliente atende aos requisitos básicos para alugar um carro.
     *
     * @return {@code true} quando tem pelo menos 21 anos e dois anos de habilitação
     */
    public boolean isApto() {
        return idade >= 21 && anosHabilitado >= 2;
    }
}
