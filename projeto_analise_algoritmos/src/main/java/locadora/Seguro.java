package locadora;

/**
 * Representa uma modalidade de seguro oferecida pela locadora.
 */
public class Seguro {

    private String tipo;
    private double valorDiario;

    /**
     * Cria uma modalidade de seguro.
     *
     * @param tipo nome ou descrição do seguro
     * @param valorDiario valor cobrado diariamente pelo seguro
     */
    public Seguro(String tipo, double valorDiario) {
        this.tipo = tipo;
        this.valorDiario = valorDiario;
    }

    /**
     * Retorna o tipo do seguro.
     *
     * @return tipo cadastrado
     */
    public String getTipo() {
        return tipo;
    }

    /**
     * Retorna o valor diário do seguro.
     *
     * @return valor cobrado por dia
     */
    public double getValorDiario() {
        return valorDiario;
    }
}
