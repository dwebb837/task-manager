import express from "express";
import bodyParser from "body-parser";
import ViteExpress from "vite-express";
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const mockTasks = [
  { id: 1, title: 'Setup React Query', status: 'done', dueDate: '2023-03-31' },
  { id: 2, title: 'Create task list UI', status: 'in-progress', dueDate: '2023-04-01' },
  { id: 3, title: 'Implement pagination', status: 'todo', dueDate: '2023-04-02' },
];

app.get('/api/tasks', async (req, res) => {
  res.status(200).json(mockTasks);
});

ViteExpress.listen(app, 3002, () =>
  console.log("Server is listening on port 3002...")
);
