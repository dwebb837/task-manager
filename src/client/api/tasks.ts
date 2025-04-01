import axios from 'axios';
import { Task, PaginatedTasksResult } from '../../types/task';

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get<Task[]>('/api/tasks');
    return response.data;
};

export const fetchPaginatedTasks = async (
    pageParam: any
): Promise<PaginatedTasksResult> => {
    try {
        const response = await axios.get<PaginatedTasksResult>(
            `/api/tasks?page=${pageParam}&size=10`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching paginated tasks:', error);
        throw error;
    }
};

export const fetchTaskById = async (taskId?: string): Promise<Task | null> => {
    if (!taskId) return null;
    const response = await axios.get<Task>(`/api/tasks/${taskId}`);
    return response.data;
};