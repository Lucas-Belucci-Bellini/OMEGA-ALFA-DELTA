package locadora;

/**
 * Representa uma moto que pode ser alugada.
 *
 * <p>Motos de maior cilindrada possuem uma diária maior. A classe implementa
 * {@link Alugavel} para participar dos cálculos polimórficos da locadora.</p>
 */
public class Moto implements Alugavel {

    private String placa;
    private String modelo;
    private int cilindrada;
    private double valorDiariaBase;
    private boolean disponivel;

    /**
     * Cria uma moto inicialmente disponível.
     *
     * @param placa placa da moto
     * @param modelo modelo da moto
     * @param cilindrada cilindrada em centímetros cúbicos
     * @param valorDiariaBase valor base cobrado por dia
     */
    public Moto(String placa, String modelo, int cilindrada, double valorDiariaBase) {
        if (cilindrada <= 0) {
            throw new IllegalArgumentException("A cilindrada deve ser positiva");
        }
        this.placa = placa;
        this.modelo = modelo;
        this.cilindrada = cilindrada;
        this.valorDiariaBase = valorDiariaBase;
        this.disponivel = true;
    }

    /**
     * Retorna a placa da moto.
     *
     * @return placa cadastrada
     */
    public String getPlaca() {
        return placa;
    }

    /**
     * Retorna o modelo da moto.
     *
     * @return modelo cadastrado
     */
    public String getModelo() {
        return modelo;
    }

    /**
     * Retorna a cilindrada da moto.
     *
     * @return cilindrada em centímetros cúbicos
     */
    public int getCilindrada() {
        return cilindrada;
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
     * Atualiza a disponibilidade da moto.
     *
     * @param disponivel novo estado de disponibilidade
     */
    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    /**
     * Calcula a diária aplicando acréscimo proporcional à cilindrada.
     *
     * <p>O acréscimo é de R$ 0,05 por centímetro cúbico.</p>
     *
     * @return valor final da diária
     */
    @Override
    public double calcularValorDiaria() {
        return valorDiariaBase + cilindrada * 0.05;
    }

    /**
     * Verifica se a moto está disponível.
     *
     * @return {@code true} quando a moto está disponível
     */
    @Override
    public boolean isDisponivel() {
        return disponivel;
    }

    /**
     * Retorna uma descrição resumida da moto.
     *
     * @return descrição contendo modelo, placa, cilindrada e diária
     */
    @Override
    public String getDescricao() {
        return "Moto " + modelo + " (placa " + placa + ", " + cilindrada
                + "cc) - R$" + calcularValorDiaria() + "/dia";
    }
}
