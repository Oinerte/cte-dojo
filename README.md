# CTE Exercise Repository

## Descrição

Este repositório contém um exercício prático utilizando **CTE (Common Table Expressions)**, baseado em um código de exemplo utilizado no ambiente de trabalho. O objetivo é realizar cálculos relacionados a tasks e ações de boards específicos.

### Funcionalidades:

1. **Seed**: Inclui dados fictícios para simular boards, tasks, e ações.
2. **Exercício**:
   - Calcular o total de tasks de cada board.
   - Calcular o total de ações de cada board.
   - Contabilizar o número de tasks concluídas por board.
   - Contabilizar o número de ações concluídas por board.

## Implementação

Você deve implementar a solução utilizando **CTE** na classe `RefactoredService`, que estende a classe `BaseService`. A classe `RefactoredService` será responsável por fornecer a lógica necessária para calcular os totais e as contagens das tasks e ações, tanto concluídas quanto pendentes, para cada board.

A classe `BaseService` já contém a estrutura básica, e a implementação da lógica usando CTE deve ser feita na classe `RefactoredService`.

## Executando o Projeto

Siga os passos abaixo para rodar o projeto e executar os testes:

1. Instale as dependências do projeto:

   ```bash
   pnpm install
   ```

2. Suba o Docker:

   ```bash
   docker compose up -d --build
   ```

3. Migre o banco:

   ```bash
   npm run migrate:dev
   ```

4. Execute os testes rodando o seguinte comando:

   ```bash
   npm run start
   ```

   Este comando executará os testes que verificarão a implementação correta da lógica de cálculo.

## Tecnologias Usadas

- Node.js
- Prisma (para ORM e Seed)

- SQL Server
- TypeScript

## Objetivo

O objetivo é calcular:

- totalActions (total de ações do board)
- totalTasks (total de tarefas do board)
- tasksDone (total de tarefas concluídas do board)
- actionsDone (total de ações concluídas do board - todas tarefas concluídas)

Observações:
- ação não é considerada concluída caso ela não tenha tarefas
- Uma ação pode estar em vários boards, e um board tem várias ações
- O board completar uma tarefa não afeta em outros boards
