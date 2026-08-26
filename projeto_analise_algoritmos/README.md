# Trabalho — Análise de Algoritmos - Depuração e Documentação

Esse trabalho pode ser feito em dupla ou individual. Você deve entregar o seu projeto no Classroom através
de um arquivo .zip. O projeto que você entregar, eu devo conseguir rodar na minha máquina. Para isso, basta compactar 
a pasta src, o arquivo pom.xml, e o arquivo JUSTIFICATIVAS.md

## O que fazer (Parte 1)

A classe `Locadora` tem 11 métodos. Cada um tem um comentário acima explicando
o que ele **deveria** fazer. Alguns estão corretos, outros têm um bug lógico
(rodam sem travar, mas devolvem um resultado errado) ou um bug de execução
(travam o programa com uma exceção).

**Não confiem só nos testes prontos do `Main.java`** — alguns bugs só aparecem
com entradas que o menu não testa por padrão. Vale a pena editar o `Main.java`
e testar valores diferentes.

Para cada um dos 11 métodos, vocês precisam:

1. **Corrigir o código**, se houver bug.
2. **Escrever o Javadoc completo** (classe, construtores e métodos) — inclusive
   nos métodos que já estavam corretos. Os lugares marcados com `// TODO:
   adicionar Javadoc` indicam onde.
3. **Preencher o `JUSTIFICATIVAS.md`** — para cada método, uma explicação curta
    do que estava errado e por que a correção resolve (ou por
   que vocês concluíram que o método já estava certo).

## O que fazer (Parte 2)

Seguir as instruções do arquivo `EXTENSAO.md` e implmentar novas classes. Documentar
tudo com Javadoc. 


## Entrega

Junto com o projeto corrigido, incluam:
- `JUSTIFICATIVAS.md` preenchido
- A documentação HTML gerada através do Javadoc.