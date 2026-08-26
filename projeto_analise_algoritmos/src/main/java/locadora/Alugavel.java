package locadora;

/**
 * Representa qualquer item que possa ser alugado pela locadora.
 *
 * <p>O contrato permite que a locadora execute operações comuns sem conhecer
 * a classe concreta de cada item.</p>
 */
public interface Alugavel {

    /**
     * Obtém o valor da diária do item.
     *
     * @return valor da diária
     */
    double calcularValorDiaria();

    /**
     * Verifica se o item está disponível para locação.
     *
     * @return {@code true} quando o item pode ser alugado
     */
    boolean isDisponivel();

    /**
     * Obtém uma descrição textual do item.
     *
     * @return descrição do item
     */
    String getDescricao();
}
