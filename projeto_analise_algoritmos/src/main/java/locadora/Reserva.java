package locadora;

/**
 * Representa uma reserva de um item alugável para um cliente.
 */
public class Reserva {

    private Cliente cliente;
    private Alugavel alugavel;
    private int dias;
    private boolean confirmada;

    /**
     * Cria uma reserva ainda não confirmada.
     *
     * @param cliente cliente responsável pela reserva
     * @param alugavel item reservado
     * @param dias quantidade de dias reservados
     * @throws IllegalArgumentException se um argumento obrigatório for nulo ou se os dias não forem positivos
     */
    public Reserva(Cliente cliente, Alugavel alugavel, int dias) {
        if (cliente == null || alugavel == null) {
            throw new IllegalArgumentException("Cliente e item alugável são obrigatórios");
        }
        if (dias <= 0) {
            throw new IllegalArgumentException("A quantidade de dias deve ser positiva");
        }
        this.cliente = cliente;
        this.alugavel = alugavel;
        this.dias = dias;
        this.confirmada = false;
    }

    /**
     * Retorna o cliente da reserva.
     *
     * @return cliente responsável
     */
    public Cliente getCliente() {
        return cliente;
    }

    /**
     * Retorna o item reservado.
     *
     * @return item alugável
     */
    public Alugavel getAlugavel() {
        return alugavel;
    }

    /**
     * Retorna a duração da reserva.
     *
     * @return quantidade de dias
     */
    public int getDias() {
        return dias;
    }

    /**
     * Verifica se a reserva foi confirmada.
     *
     * @return {@code true} quando a reserva está confirmada
     */
    public boolean isConfirmada() {
        return confirmada;
    }

    /**
     * Confirma a reserva se o item ainda estiver disponível.
     *
     * @throws IllegalStateException se o item não estiver disponível
     */
    public void confirmar() {
        if (!alugavel.isDisponivel()) {
            throw new IllegalStateException("O item não está disponível");
        }
        confirmada = true;
    }

    /**
     * Calcula o valor previsto para todo o período reservado.
     *
     * @return diária do item multiplicada pela quantidade de dias
     */
    public double calcularValorTotal() {
        return alugavel.calcularValorDiaria() * dias;
    }
}
