import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../api/tasks';
import { Task } from '@/types/task';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface TaskFormProps {
    existingTask?: Task;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const TaskForm = ({ existingTask, onSuccess, onCancel }: TaskFormProps) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(existingTask?.title || '');
    const [status, setStatus] = useState<Task['status']>(existingTask?.status || 'todo');
    const [assignee, setAssignee] = useState(existingTask?.assignee || '');
    const [dueDate, setDueDate] = useState(existingTask?.dueDate || '');

    const { mutate: saveTask, isPending } = useMutation({
        mutationFn: existingTask
            ? (updatedTask: Task) => updateTask(updatedTask)
            : (newTask: Task) => createTask(newTask),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
            queryClient.setQueryData(['tasks'], (old: Task[] = []) =>
                existingTask
                    ? old?.map(t => t.id === newTask.id ? newTask : t)
                    : [newTask, ...old]
            );
            return { previousTasks };
        },
        onError: (err, newTask, context) => {
            queryClient.setQueryData(['tasks'], context?.previousTasks);
            toast.error(`Failed to ${existingTask ? 'update' : 'create'} task`);
        },
        onSuccess: () => {
            toast.success(`Task ${existingTask ? 'updated' : 'created'} successfully!`);
            onSuccess?.();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskData = {
            title,
            status,
            assignee,
            dueDate,
            id: existingTask ? existingTask.id : uuidv4()
        };
        saveTask(taskData);
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h3>{existingTask ? 'Edit Task' : 'Create New Task'}</h3>
            <div className="form-group">
                <label>Title *</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isPending}
                />
            </div>
            <div className="form-group">
                <label>Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Task['status'])}
                    disabled={isPending}
                >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>
            <div className="form-group">
                <label>Assignee</label>
                <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <div className="form-group">
                <label>Due Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <div className="form-actions">
                <button type="submit" disabled={isPending} className="submit-btn">
                    {isPending ? 'Saving...' : existingTask ? 'Update Task' : 'Create Task'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={isPending} className="cancel-btn">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};
