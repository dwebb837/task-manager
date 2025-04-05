import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../api/tasks';
import { Task } from '@/types/task';
import { useState } from 'react';

interface TaskFormProps {
    existingTask?: Task;
    onSuccess?: () => void;
}

export const TaskForm = ({ existingTask, onSuccess }: TaskFormProps) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(existingTask?.title || '');
    const [status, setStatus] = useState<Task['status']>(existingTask?.status || 'todo');
    const [assignee, setAssignee] = useState(existingTask?.assignee || '');
    const [dueDate, setDueDate] = useState(existingTask?.dueDate || '');

    const { mutate: saveTask, isPending } = useMutation({
        mutationFn: existingTask
            ? (updatedTask: Task) => updateTask(updatedTask)
            : (newTask: Omit<Task, 'id'>) => createTask(newTask),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paginatedTasks'] });
            onSuccess?.();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskData = { title, status, assignee, dueDate };
        saveTask(existingTask ? { ...taskData, id: existingTask.id } : taskData);
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Task['status'])}
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
                />
            </div>

            <div className="form-group">
                <label>Due Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            <button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Task'}
            </button>
        </form>
    );
};
