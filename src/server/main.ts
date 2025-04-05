import express from "express";
import bodyParser from "body-parser";
import ViteExpress from "vite-express";
import { Task, PaginatedTasksResult } from 'src/types/task';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(bodyParser.json());

const TASK_COUNT = 100;

const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [];
  for (let i = 1; i <= TASK_COUNT; i++) {
    tasks.push({
      id: uuidv4(),
      title: `Task ${i}`,
      status: ['todo', 'in-progress', 'done'][Math.floor(Math.random() * 3)] as Task['status'],
      dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      assignee: ['Alice', 'Bob', 'Charlie'][Math.floor(Math.random() * 3)],
    });
  }
  return tasks;
};

const allTasks: Task[] = generateMockTasks();

app.get('/api/tasks', async (req: express.Request, res: express.Response) => {
  if (req.query?.page) {
    const pageSize = Number(req.query?.size) || 10;
    const pageParam = Number(req.query?.page) || 1;
    const startIdx = (pageParam - 1) * pageSize;
    const endIdx = startIdx + pageSize;

    const result: PaginatedTasksResult = {
      tasks: allTasks.slice(startIdx, endIdx),
      nextPage: endIdx < allTasks.length ? pageParam + 1 : undefined,
      totalTasks: allTasks.length,
    };

    res.status(200).json(result);
  }
  else {
    res.status(200).json(allTasks);
  }
});

app.get('/api/tasks/:taskId', async (req: express.Request, res: express.Response) => {
  const taskId = req.params.taskId;
  const task = allTasks.find(t => t.id === taskId);
  res.status(200).json(task || null);
});

app.post('/api/tasks', async (req, res) => {
  const newTask = {
    id: allTasks.length + 1,
    ...req.body,
  };
  allTasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const taskIndex = allTasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = { ...allTasks[taskIndex], ...req.body };
  allTasks[taskIndex] = updatedTask;
  res.status(200).json(updatedTask);
});

app.delete('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const taskIndex = allTasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  allTasks.splice(taskIndex, 1);
  res.status(204).send();
});

ViteExpress.listen(app, 3002, () =>
  console.log("Server is listening on port 3002...")
);
