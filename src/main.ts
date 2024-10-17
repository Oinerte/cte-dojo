import { PrismaClient } from "@prisma/client";
import { seed } from "./seed";
import { UpdateTotalBoardStatusService } from "./service";
// import { WithCteService } from "./with-cte-service";
import { WithPrismaService } from "./with-prisma-service";
// import { WithTsLogic as WithTsLogicService } from "./with-ts-logic";
import { BaseService } from "./base-service";
import { SeedInput } from "./dto/seed.input";
import { RefactoredService } from "./refactored-service";
import { validateAnswer } from "./validate-answer";

async function testService({
  Service,
  serviceName,
  seedInput,
  prisma,
}: {
  Service: new (prisma: PrismaClient) => BaseService;
  serviceName: string;
  seedInput: SeedInput;
  prisma: PrismaClient;
}) {
  console.log(`\n---- INICIANDO TESTE ------`);
  let boardIds = await seed(seedInput);
  const service = new Service(prisma);

  const start = Date.now();
  await service.execute(boardIds);
  const end = Date.now();
  console.log(`${serviceName} demorou ${end - start} ms`);

  await validateAnswer({ prisma, boardIds });
}

async function main() {
  const prisma = new PrismaClient();

  const seedInput: SeedInput = {
    maxIndividualActions: 10,
    maxTasks: 10,
    numberOfBoards: 100,
    numberOfSharedActions: 20,
    percentageOfDoneTasks: 50,
    prisma,
  };

  await testService({
    Service: UpdateTotalBoardStatusService,
    serviceName: "Serviço atual do pesquisa",
    seedInput,
    prisma,
  });
  // Serviço atual do pesquisa demorou 1793 ms

  await testService({
    Service: RefactoredService,
    serviceName: "Sua resolução",
    seedInput,
    prisma,
  });
  // Meta: obter o resultado correto em até 100ms
  // Bônus: obter o resultado correto em até 50ms

  /*
  Testes que fiz localmente, depois do exercício será disponibilizado o código.


  // teste 2

  await testService({
    Service: WithCteService,
    serviceName: "Resolução usando CTEs",
    seedInput,
    prisma,
  });
  // Resolução usando CTEs demorou 45 ms

  // teste 3
  */

  await testService({
    Service: WithPrismaService,
    serviceName: "Resolução usando Prisma",
    seedInput,
    prisma,
  });
  // Resolução usando Prisma demorou 267 ms

  /*

  // teste 4
  await testService({
    Service: WithTsLogicService,
    serviceName: "Resolução usando Lógica Typescript",
    seedInput,
    prisma,
  });
  // Resolução usando Lógica Typescript demorou 98 ms
  */
}

main().then();
