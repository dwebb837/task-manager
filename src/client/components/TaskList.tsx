import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/tasks';

export const TaskList = () => {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks?.map((task: any) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Due: {task.dueDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
