package locadora;

/**
 * Representa um carro disponível para cadastro e locação.
 *
 * <p>Um carro também é um {@link Alugavel}, permitindo que participe dos
 * cálculos agregados da extensão.</p>
 */
public class Carro implements Alugavel {

    private String placa;
    private String modelo;
    private double valorDiaria;
    private boolean disponivel;

    /**
     * Cria um carro inicialmente disponível.
     *
     * @param placa placa do carro
     * @param modelo modelo do carro
     * @param valorDiaria valor cobrado por dia
     */
    public Carro(String placa, String modelo, double valorDiaria) {
        this.placa = placa;
        this.modelo = modelo;
        this.valorDiaria = valorDiaria;
        this.disponivel = true;
    }

    /**
     * Retorna a placa do carro.
     *
     * @return placa cadastrada
     */
    public String getPlaca() {
        return placa;
    }

    /**
     * Retorna o modelo do carro.
     *
     * @return modelo cadastrado
     */
    public String getModelo() {
        return modelo;
    }

    /**
     * Retorna o valor da diária do carro.
     *
     * @return valor cobrado por dia
     */
    public double getValorDiaria() {
        return valorDiaria;
    }

    /**
     * Verifica se o carro está disponível.
     *
     * @return {@code true} quando o carro está disponível
     */
    @Override
    public boolean isDisponivel() {
        return disponivel;
    }

    /**
     * Atualiza a disponibilidade do carro.
     *
     * @param disponivel novo estado de disponibilidade
     */
    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    /**
     * Retorna o valor da diária deste carro.
     *
     * @return valor da diária
     */
    @Override
    public double calcularValorDiaria() {
        return valorDiaria;
    }

    /**
     * Cria uma descrição resumida do carro.
     *
     * @return descrição contendo placa, modelo e valor da diária
     */
    @Override
    public String getDescricao() {
        return "Carro " + modelo + " (placa " + placa + ") - R$" + valorDiaria + "/dia";
    }
}
