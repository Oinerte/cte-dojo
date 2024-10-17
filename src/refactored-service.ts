import { Prisma, PrismaClient } from "@prisma/client";
import { BaseService } from "./base-service";

/*
Escreva sua solução nesse Service
*/
export class RefactoredService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async execute(boardIds: number[]) {
    await this.prisma.$queryRaw`
      WITH TotalActionOnBoard AS (
      	SELECT abm.boardId, COUNT(a.id) as totalActions 
      	FROM action_board_mappers abm 
      	JOIN actions a ON abm.actionId = a.id 
      	WHERE abm.boardId IN (${Prisma.join(boardIds)})
      	GROUP BY abm.boardId

      ),
      TotalTasksOnBoard AS (
      	SELECT abm.boardId, COUNT(t.id) as totalTasks  
      	FROM action_board_mappers abm 
      	JOIN actions a ON abm.actionId = a.id 
      	JOIN tasks t ON t.actionId = a.id 
      	WHERE abm.boardId IN (${Prisma.join(boardIds)})
      	GROUP BY abm.boardId
      ),
      ActionsDoneOnBoard as (
      	SELECT abm.boardId, COUNT(DISTINCT a.id) as actionsDone  
      	FROM action_board_mappers abm
      	JOIN actions a ON abm.actionId = a.id
      	JOIN tasks t ON t.actionId = a.id
      	LEFT JOIN done_tasks_boards dtb ON t.id = dtb.taskId AND dtb.boardId = abm.boardId
      	WHERE abm.boardId IN (${Prisma.join(boardIds)})
      	GROUP BY abm.boardId, a.id
      	HAVING COUNT(t.id) = COUNT(dtb.taskId)
      ),
      TasksDoneOnBoard as (
      	SELECT abm.boardId, COUNT(t.id) as tasksDone  
      	FROM action_board_mappers abm 
      	JOIN actions a ON abm.actionId = a.id 
      	JOIN tasks t ON t.actionId = a.id 
      	JOIN done_tasks_boards dtb ON t.id = dtb.taskId AND dtb.boardId = abm.boardId
      	WHERE abm.boardId IN (${Prisma.join(boardIds)})
      	GROUP BY abm.boardId
      )
      UPDATE b
      SET 
      	b.totalActions = COALESCE(ta.totalActions, 0),
      	b.totalTasks = COALESCE(tt.totalTasks, 0), 
      	b.actionsDone = COALESCE((SELECT SUM(ad.actionsDone) FROM ActionsDoneOnBoard ad WHERE ad.boardId = b.id), 0),
      	b.tasksDone = COALESCE(td.tasksDone, 0)
      FROM boards b 
      JOIN TotalActionOnBoard ta ON ta.boardId = b.id
      JOIN TotalTasksOnBoard tt ON tt.boardId = b.id
      JOIN ActionsDoneOnBoard ad ON ad.boardId = b.id
      JOIN TasksDoneOnBoard td ON td.boardId = b.id;
    `;
  }
}
