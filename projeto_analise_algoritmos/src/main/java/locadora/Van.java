package locadora;

/**
 * Representa uma van que pode ser alugada.
 *
 * <p>Vans com maior capacidade de carga possuem uma diária maior. A classe
 * implementa {@link Alugavel} para participar dos cálculos polimórficos.</p>
 */
public class Van implements Alugavel {

    private String placa;
    private String modelo;
    private double capacidadeCarga;
    private double valorDiariaBase;
    private boolean disponivel;

    /**
     * Cria uma van inicialmente disponível.
     *
     * @param placa placa da van
     * @param modelo modelo da van
     * @param capacidadeCarga capacidade de carga em toneladas
     * @param valorDiariaBase valor base cobrado por dia
     */
    public Van(String placa, String modelo, double capacidadeCarga, double valorDiariaBase) {
        if (capacidadeCarga <= 0) {
            throw new IllegalArgumentException("A capacidade de carga deve ser positiva");
        }
        this.placa = placa;
        this.modelo = modelo;
        this.capacidadeCarga = capacidadeCarga;
        this.valorDiariaBase = valorDiariaBase;
        this.disponivel = true;
    }

    /**
     * Retorna a placa da van.
     *
     * @return placa cadastrada
     */
    public String getPlaca() {
        return placa;
    }

    /**
     * Retorna o modelo da van.
     *
     * @return modelo cadastrado
     */
    public String getModelo() {
        return modelo;
    }

    /**
     * Retorna a capacidade de carga da van.
     *
     * @return capacidade em toneladas
     */
    public double getCapacidadeCarga() {
        return capacidadeCarga;
    }

    /**
     * Retorna o valor base da diária.
     *
     * @return valor base por dia
     */
    public double getValorDiariaBase() {
        return valorDiariaBase;
    }

    /**
     * Atualiza a disponibilidade da van.
     *
     * @param disponivel novo estado de disponibilidade
     */
    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    /**
     * Calcula a diária aplicando acréscimo proporcional à capacidade de carga.
     *
     * <p>O acréscimo é de R$ 30,00 por tonelada de capacidade.</p>
     *
     * @return valor final da diária
     */
    @Override
    public double calcularValorDiaria() {
        return valorDiariaBase + capacidadeCarga * 30.0;
    }

    /**
     * Verifica se a van está disponível.
     *
     * @return {@code true} quando a van está disponível
     */
    @Override
    public boolean isDisponivel() {
        return disponivel;
    }

    /**
     * Retorna uma descrição resumida da van.
     *
     * @return descrição contendo modelo, placa, capacidade e diária
     */
    @Override
    public String getDescricao() {
        return "Van " + modelo + " (placa " + placa + ", capacidade "
                + capacidadeCarga + "t) - R$" + calcularValorDiaria() + "/dia";
    }
}
