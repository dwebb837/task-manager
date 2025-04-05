import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/tasks';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  if (isLoading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error: {(error as Error).message}</div>;

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Task List</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="create-task-btn"
        >
          + Create New Task
        </button>
      </div>

      {isCreating && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm
              onSuccess={() => setIsCreating(false)}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        </div>
      )}

      <ul className="task-list">
        {tasks?.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};
