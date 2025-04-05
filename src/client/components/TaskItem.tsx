import { forwardRef, useState } from 'react';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '../api/tasks';
import { PaginatedTasksResult, Task } from '@/types/task';
import { TaskForm } from './TaskForm';
import { toast } from 'react-toastify';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = forwardRef<HTMLLIElement, TaskItemProps>(
    ({ task }, ref) => {
        const queryClient = useQueryClient();
        const [isEditing, setIsEditing] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

        const { mutate: updateTaskMutation, isPending: isUpdating } = useMutation({
            mutationFn: updateTask,
            onMutate: async (updatedTask) => {
                await queryClient.cancelQueries({ queryKey: ['tasks', 'paginatedTasks'] });

                const previousTasks = queryClient.getQueryData<InfiniteData<PaginatedTasksResult>>(['paginatedTasks']);
                const previousTaskList = queryClient.getQueryData<Task[]>(['tasks']);

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

                queryClient.setQueryData<Task[]>(['tasks'], (old) =>
                    old?.map(t => t.id === updatedTask.id ? updatedTask : t)
                );

                return { previousTasks, previousTaskList };
            },
            onError: (err, updatedTask, context) => {
                queryClient.setQueryData(['paginatedTasks'], context?.previousTasks);
                queryClient.setQueryData(['tasks'], context?.previousTaskList);
                toast.error('Failed to update task');
            },
            onSuccess: () => {
                toast.success('Task updated successfully!');
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['tasks', 'paginatedTasks'] });
            }
        });

        const { mutate: deleteTaskMutation, isPending: isDeleting } = useMutation({
            mutationFn: deleteTask,
            onMutate: async (taskId) => {
                await queryClient.cancelQueries({ queryKey: ['tasks', 'paginatedTasks'] });

                const previousTasks = queryClient.getQueryData<InfiniteData<PaginatedTasksResult>>(['paginatedTasks']);
                const previousTaskList = queryClient.getQueryData<Task[]>(['tasks']);

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

                queryClient.setQueryData<Task[]>(['tasks'], (old) =>
                    old?.filter(t => t.id !== taskId)
                );

                return { previousTasks, previousTaskList };
            },
            onError: (err, taskId, context) => {
                queryClient.setQueryData(['paginatedTasks'], context?.previousTasks);
                queryClient.setQueryData(['tasks'], context?.previousTaskList);
                toast.error('Failed to delete task');
            },
            onSuccess: () => {
                toast.success('Task deleted successfully!');
                setShowDeleteConfirm(false);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['tasks', 'paginatedTasks'] });
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
                <li className="task-card editing">
                    <TaskForm
                        existingTask={task}
                        onSuccess={() => setIsEditing(false)}
                        onCancel={() => setIsEditing(false)}
                    />
                </li>
            );
        }

        return (
            <li className={`task-card ${task.status}`} ref={ref}>
                <h3>{task.title}</h3>
                <div className="task-meta">
                    <button
                        className={`status-badge ${task.status}`}
                        onClick={toggleStatus}
                        disabled={isUpdating}
                    >
                        {isUpdating ? '...' : task.status}
                    </button>
                    <span>Due: {task.dueDate}</span>
                    <span>Assigned to: {task.assignee}</span>
                </div>
                <div className="task-actions">
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isUpdating || isDeleting}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>

                {showDeleteConfirm && (
                    <div className="delete-confirm-overlay">
                        <div className="delete-confirm">
                            <p>Are you sure you want to delete this task?</p>
                            <div className="confirm-buttons">
                                <button
                                    onClick={() => deleteTaskMutation(task.id)}
                                    disabled={isDeleting}
                                    className="confirm-btn"
                                >
                                    {isDeleting ? 'Deleting...' : 'Confirm'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </li>
        );
    }
);

TaskItem.displayName = 'TaskItem';
