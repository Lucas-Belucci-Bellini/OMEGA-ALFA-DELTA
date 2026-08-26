package locadora;

/**
 * Representa um serviço de manutenção associado a um item alugável.
 */
public class Manutencao {

    private Alugavel alugavel;
    private String descricao;
    private double custo;
    private boolean concluida;

    /**
     * Cria um registro de manutenção pendente.
     *
     * @param alugavel item que receberá a manutenção
     * @param descricao descrição do serviço
     * @param custo custo estimado ou realizado
     * @throws IllegalArgumentException se o item for nulo ou o custo for negativo
     */
    public Manutencao(Alugavel alugavel, String descricao, double custo) {
        if (alugavel == null) {
            throw new IllegalArgumentException("O item alugável é obrigatório");
        }
        if (custo < 0) {
            throw new IllegalArgumentException("O custo não pode ser negativo");
        }
        this.alugavel = alugavel;
        this.descricao = descricao;
        this.custo = custo;
        this.concluida = false;
    }

    /**
     * Retorna o item que receberá o serviço.
     *
     * @return item alugável
     */
    public Alugavel getAlugavel() {
        return alugavel;
    }

    /**
     * Retorna a descrição do serviço.
     *
     * @return descrição da manutenção
     */
    public String getDescricao() {
        return descricao;
    }

    /**
     * Retorna o custo da manutenção.
     *
     * @return custo registrado
     */
    public double getCusto() {
        return custo;
    }

    /**
     * Verifica se a manutenção foi concluída.
     *
     * @return {@code true} quando o serviço foi concluído
     */
    public boolean isConcluida() {
        return concluida;
    }

    /**
     * Marca o serviço como concluído.
     */
    public void concluir() {
        concluida = true;
    }
}
