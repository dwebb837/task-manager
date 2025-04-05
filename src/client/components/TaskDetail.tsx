import { useQuery } from '@tanstack/react-query';
import { fetchTaskById } from '../api/tasks';
import { useParams } from 'react-router-dom';

export const TaskDetail = () => {
    const { taskId } = useParams();
    const { data: task, isLoading, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => fetchTaskById(taskId),
    });

    if (isLoading) return <div className="loading">Loading task details...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;
    if (!task) return <div className="error">Task not found</div>;

    return (
        <div className="task-detail">
            <h2>{task.title}</h2>
            <div className="task-info">
                <p>
                    <strong>Status:</strong>{' '}
                    <span className={`status-badge ${task.status}`}>{task.status}</span>
                </p>
                <p>
                    <strong>Due Date:</strong> {task.dueDate}
                </p>
                <p>
                    <strong>Assignee:</strong> {task.assignee}
                </p>
            </div>
        </div>
    );
};
