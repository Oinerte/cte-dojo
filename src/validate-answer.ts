import { PrismaClient } from "@prisma/client";

export async function validateAnswer({
  boardIds,
  prisma,
}: {
  boardIds: number[];
  prisma: PrismaClient;
}) {
  const boards = await prisma.board.findMany({
    where: {
      id: {
        in: boardIds,
      },
    },
    select: {
      id: true,
      actionsDone: true,
      tasksDone: true,
      totalActions: true,
      totalTasks: true,
      actions: {
        select: {
          action: {
            select: {
              id: true,
              tasks: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      doneTasks: {
        select: {
          taskId: true,
        },
      },
    },
  });

  let totalActionsError = false;
  let totalTasksError = false;
  let tasksDoneError = false;
  let actionsDoneError = false;

  for (const board of boards) {
    const doneTasksSet = new Set(board.doneTasks.map((t) => t.taskId));

    if (board.totalActions != board.actions.length) {
      if (!totalActionsError) {
        console.log("erro com totalActions");
        totalActionsError = true;
        console.log(
          `board with id ${board.id} has ${board.actions.length} actions but totalActions = ${board.totalActions}`
        );
      }
    }
    const totalTasks = board.actions.reduce((sum, { action }) => {
      return sum + action.tasks.length;
    }, 0);

    if (totalTasks != board.totalTasks) {
      if (!totalTasksError) {
        console.log("erro com totalTasks");
        totalTasksError = true;
        console.log(
          `board with id ${board.id} has ${totalTasks} tasks but totalTasks = ${board.totalTasks}`
        );
      }
    }

    const doneTasks = board.doneTasks.length;

    if (doneTasks != board.tasksDone) {
      if (!tasksDoneError) {
        console.log("erro com tasksDone");
        console.log(
          `board with id ${board.id} has ${doneTasks} tasks but doneTasks = ${board.tasksDone}`
        );
        tasksDoneError = true;
      }
    }

    const doneActions = board.actions.filter(({ action }) => {
      return action.tasks.every((task) => doneTasksSet.has(task.id));
    }).length;

    if (doneActions != board.actionsDone) {
      if (!actionsDoneError) {
        console.log("erro com actionsDone");
        console.log(
          `board with id ${board.id} has ${doneActions} done actions but actionsDone = ${board.actionsDone}`
        );
        actionsDoneError = true;
      }
    }
  }
  if (
    !tasksDoneError &&
    !actionsDoneError &&
    !totalActionsError &&
    !totalTasksError
  )
    console.log("Service está correto!");
}
