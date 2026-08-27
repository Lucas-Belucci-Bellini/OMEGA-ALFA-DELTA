# Trabalho — Parte 2: Extensão de POO

## Contexto

A locadora que vocês já conhecem da Parte 1 está diversificando a frota. Até
agora o sistema só sabia lidar com carros — mas a empresa decidiu passar a
alugar **motos** e **vans** também. Vocês vão estender o sistema pra dar conta
disso.

## O que vocês precisam fazer

**1. Criar um mecanismo de abstração comum chamado `Alugavel`.**

A dupla escolhe se implementa como **interface** ou como **superclasse/classe
abstrata** — usem o que vocês aprenderam na matéria de POO. Não existe
resposta "mais certa" entre as duas; o importante é que a escolha faça
sentido e que vocês consigam justificar por que optaram por ela.

Contrato mínimo sugerido (podem adicionar mais se quiserem):

- `calcularValorDiaria()` — retorna o valor da diária daquele item
- `isDisponivel()` — indica se está disponível pra locação
- `getDescricao()` — retorna uma descrição textual do item

**2. Criar pelo menos 2 classes novas** que se encaixem em `Alugavel`.

Sugestão: `Moto` e `Van`. Cada uma precisa ter **pelo menos um atributo
específico** que influencie o cálculo do valor da diária — por exemplo:

- `Moto` pode ter `cilindrada` (motos de cilindrada maior custam mais)
- `Van` pode ter `capacidadeCarga` (vans com mais capacidade custam mais)

Como exatamente esse atributo influencia o preço é decisão de vocês — só
precisa fazer sentido.

**3. Escrever um método que receba um conjunto de `Alugavel` e calcule algo agregado.**

Por exemplo, um método que recebe um array (ou lista) misturando `Moto` e
`Van` e devolve a soma do valor de todas as diárias. Esse método pode ficar
na classe `Locadora` (da Parte 1) ou em uma classe nova — decisão de vocês.
O importante é que ele funcione **percorrendo tipos diferentes através da
abstração** (`Alugavel`), sem precisar saber se cada item é uma `Moto` ou
uma `Van`.

**4. Javadoc completo em tudo que for criado** — a mesma exigência da Parte 1
vale aqui: classe, construtores e métodos.

**5. Escrever pelo menos mais 3 classes que se encaixem de alguma forma no contexto do projeto.**

Além dos alugaveis, 

## Como isso se conecta com a Parte 1

Não é obrigatório, mas é uma boa ideia integrar a Parte 2 ao sistema da Parte
1 — por exemplo, usando as classes `Moto` e `Van` dentro do `Main.java` que
vocês já têm, ao lado dos carros. Eu gostaria que
`Carro` passe a implementar `Alugavel` — porém caso estejam com muita dificuldade em POO, podem deixar como está e fazer 
as novas classes como uma parte
separada do sistema, se preferirem.

## Critérios de avaliação

| Critério |
|----------|
| Mecanismo de abstração (`Alugavel`) existe e faz sentido como contrato 
| Pelo menos 2 classes novas se encaixam corretamente nele 
| Método agregador funciona corretamente com tipos variados 
| Javadoc completo e coerente em tudo que foi criado 
| Criado pelo menos novas 3 classes que se encaixem de alguma forma no projeto.
## Entrega

Incluam as classes novas dentro do mesmo projeto da Parte 1 (mesma pasta
`src/main/java/locadora`), com a documentação HTML gerada pelo Javadoc
atualizada para incluir também essas classes novas.