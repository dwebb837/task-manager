import { forwardRef, useState } from 'react';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '../api/tasks';
import { PaginatedTasksResult, Task } from '@/types/task';
import { TaskForm } from './TaskForm';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = forwardRef<HTMLElement, TaskItemProps>(
    ({ task }, ref) => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { mutate: updateTaskMutation } = useMutation({
        mutationFn: updateTask,
        onMutate: async (updatedTask) => {
            await queryClient.cancelQueries({ queryKey: ['paginatedTasks'] });

            const previousTasks = queryClient.getQueryData<InfiniteData<PaginatedTasksResult>>(['paginatedTasks']);

            queryClient.setQueryData<InfiniteData<PaginatedTasksResult>>(['paginatedTasks'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map(page => ({
                        ...page,
                        tasks: page.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
                    }))
                };
            });

            return { previousTasks };
        },
        onError: (err, updatedTask, context) => {
            queryClient.setQueryData(['paginatedTasks'], context?.previousTasks);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['paginatedTasks'] });
        }
    });

    const { mutate: deleteTaskMutation } = useMutation({
        mutationFn: deleteTask,
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: ['paginatedTasks'] });

            const previousTasks = queryClient.getQueryData<InfiniteData<PaginatedTasksResult>>(['paginatedTasks']);

            queryClient.setQueryData<InfiniteData<PaginatedTasksResult>>(['paginatedTasks'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map(page => ({
                        ...page,
                        tasks: page.tasks.filter(t => t.id !== taskId)
                    }))
                };
            });

            return { previousTasks };
        },
        onError: (err, taskId, context) => {
            queryClient.setQueryData(['paginatedTasks'], context?.previousTasks);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['paginatedTasks'] });
        }
    });

    const toggleStatus = () => {
        const newStatus =
            task.status === 'todo' ? 'in-progress' :
                task.status === 'in-progress' ? 'done' : 'todo';

        updateTaskMutation({ ...task, status: newStatus });
    };

    if (isEditing) {
        return (
            <TaskForm
                existingTask={task}
                onSuccess={() => setIsEditing(false)}
            />
        );
    }

    return (
        <li className={`task-card ${task.status}`} ref={ref as React.Ref<HTMLLIElement>}>
            <h3>{task.title}</h3>
            <div className="task-meta">
                <button
                    className={`status-badge ${task.status}`}
                    onClick={toggleStatus}
                >
                    {task.status}
                </button>
                <span>Due: {task.dueDate}</span>
                <span>Assigned to: {task.assignee}</span>
            </div>
            <div className="task-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={() => deleteTaskMutation(task.id ?? 0)}>Delete</button>
            </div>
        </li>
    );
});

TaskItem.displayName = 'TaskItem';
