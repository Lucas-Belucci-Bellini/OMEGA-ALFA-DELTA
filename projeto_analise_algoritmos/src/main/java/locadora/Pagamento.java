package locadora;

/**
 * Registra um pagamento associado a uma locação ou reserva.
 */
public class Pagamento {

    private double valor;
    private String forma;
    private boolean aprovado;

    /**
     * Cria um pagamento inicialmente não aprovado.
     *
     * @param valor valor do pagamento
     * @param forma forma de pagamento, como cartão, pix ou dinheiro
     * @throws IllegalArgumentException se o valor não for positivo
     */
    public Pagamento(double valor, String forma) {
        if (valor <= 0) {
            throw new IllegalArgumentException("O valor do pagamento deve ser positivo");
        }
        this.valor = valor;
        this.forma = forma;
        this.aprovado = false;
    }

    /**
     * Retorna o valor do pagamento.
     *
     * @return valor registrado
     */
    public double getValor() {
        return valor;
    }

    /**
     * Retorna a forma de pagamento.
     *
     * @return forma utilizada
     */
    public String getForma() {
        return forma;
    }

    /**
     * Verifica se o pagamento foi aprovado.
     *
     * @return {@code true} quando o pagamento está aprovado
     */
    public boolean isAprovado() {
        return aprovado;
    }

    /**
     * Marca o pagamento como aprovado.
     */
    public void aprovar() {
        aprovado = true;
    }
}
