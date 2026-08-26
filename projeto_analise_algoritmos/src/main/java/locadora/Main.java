package locadora;

import java.util.Scanner;

/**
 * Ponto de entrada interativo do sistema da locadora.
 */
public class Main {

    /**
     * Impede a criação de instâncias da classe de entrada.
     */
    private Main() {
    }

    /**
     * Executa o menu principal da aplicação.
     *
     * @param args argumentos de linha de comando, não utilizados
     */
    public static void main(String[] args) {
        Carro[] carros = {
            new Carro("ABC1234", "Toyota Supra", 100.0),
            new Carro("XYZ9988", "Nissan Skyline R34", 220.0),
            new Carro("JJK4521", "Dodge Demon", 90.0),
            new Carro("QRS7788", "Honda Civic Type R", 250.0)
        };
        carros[1].setDisponivel(false);

        Cliente[] clientes = {
            new Cliente("Renan Santos", 25, 5),
            new Cliente("Kim Kataguiri", 19, 0),
            new Cliente("IGOR", 30, 3),
            new Cliente("Vladimir Putin", 25, 1)
            new Cliente("Thanos", 22, 1)
            new Cliente("Doutor Destino", 25, 1)
        };

        Cliente[] clientesNovos = {};

        Seguro seguroCompleto = new Seguro("Completo", 25.0);

        Moto moto = new Moto("MOT2026", "City", 160, 60.0);
        Van van = new Van("VAN2026", "Cargo", 2.5, 180.0);
        Alugavel[] frotaMista = {carros[0], moto, van};

        Locadora locadora = new Locadora();
        Scanner scanner = new Scanner(System.in);
        int opcao = -1;

        while (opcao != 0) {
            exibirMenu();
            opcao = scanner.nextInt();

            switch (opcao) {
                case 1:
                    System.out.println("Carros disponiveis: " + locadora.contarCarrosDisponiveis(carros));
                    break;
                case 2:
                    System.out.println("Receita total da frota: R$" + locadora.calcularReceitaTotalFrota(carros));
                    break;
                case 3:
                    System.out.println("Calculando media de idade (nenhum cliente cadastrado ainda)...");
                    System.out.println("Media de idade: " + locadora.calcularMediaIdadeClientes(clientesNovos));
                    break;
                case 4:
                    Cliente maisVelho = locadora.buscarClienteMaisVelho(clientes);
                    System.out.println("Cliente mais velho: " + maisVelho.getNome() + " (" + maisVelho.getIdade() + " anos)");
                    break;
                case 5:
                    System.out.println("Buscando carro de placa ZZZ0000...");
                    System.out.println(locadora.buscarCarroPorPlaca(carros, "ZZZ0000"));
                    break;
                case 6:
                    System.out.println("Multa para 3 dias de atraso: R$" + locadora.calcularMultaAtraso(3));
                    break;
                case 7:
                    System.out.println("Processando locacao do Onix para Pedro, 10 dias, com seguro completo...");
                    System.out.println("Valor total: R$" + locadora.processarLocacaoCompleta(carros[0], clientes[1], seguroCompleto, 10));
                    break;
                case 8:
                    System.out.println("Diaria da categoria 1 por 5 dias: R$" + locadora.calcularDiariaComCategoria(1, 5));
                    break;
                case 9:
                    System.out.println(locadora.gerarResumoFrota(carros));
                    break;
                case 10:
                    System.out.println("Aplicando desconto escalonado em R$1000,00 por 10 dias...");
                    System.out.println("Valor com desconto: R$" + locadora.calcularDescontoEscalonado(1000, 10));
                    break;
                case 11:
                    System.out.println("Verificando fidelidade da cliente Ana (25 anos, 5 locacoes anteriores)...");
                    System.out.println("Elegivel? " + locadora.clienteElegivelDescontoFidelidade(clientes[3], 5));
                    break;
                case 12:
                    System.out.println("Total das diarias de carro, moto e van: R$"
                            + locadora.calcularValorTotalDiarias(frotaMista));
                    break;
                case 0:
                    System.out.println("Encerrando o sistema...");
                    break;
                default:
                    System.out.println("Opcao invalida. Tente novamente.");
            }
        }

        scanner.close();
    }

    /**
     * Exibe as opções disponíveis no menu principal.
     */
    private static void exibirMenu() {
        System.out.println("\n===== SISTEMA LOCADORA - TRABALHO ANALISE DE ALGORITMOS =====");
        System.out.println("1 - Contar carros disponiveis");
        System.out.println("2 - Calcular receita total da frota");
        System.out.println("3 - Calcular media de idade dos clientes");
        System.out.println("4 - Buscar cliente mais velho");
        System.out.println("5 - Buscar carro por placa");
        System.out.println("6 - Calcular multa por atraso");
        System.out.println("7 - Processar locacao completa");
        System.out.println("8 - Calcular diaria por categoria");
        System.out.println("9 - Gerar resumo da frota");
        System.out.println("10 - Calcular desconto escalonado");
        System.out.println("11 - Verificar elegibilidade de fidelidade");
        System.out.println("12 - Somar diarias de carro, moto e van");
        System.out.println("0 - Sair");
        System.out.print("Escolha uma opcao: ");
    }
}
