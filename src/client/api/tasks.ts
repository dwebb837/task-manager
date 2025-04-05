import axios from 'axios';
import { Task, PaginatedTasksResult } from '../../types/task';
import { toast } from 'react-toastify';

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get<Task[]>('/api/tasks');
    return response.data;
};

export const fetchPaginatedTasks = async ( pageParam: any): Promise<PaginatedTasksResult> => {
    const response = await axios.get<PaginatedTasksResult>(`/api/tasks?page=${pageParam}&size=10`);
    return response.data;
};

export const fetchTaskById = async (taskId: string): Promise<Task> => {
    const response = await axios.get<Task>(`/api/tasks/${taskId}`);
    return response.data;
};

export const createTask = async (task: Task): Promise<Task> => {
    const response = await axios.post<Task>('/api/tasks', task);
    return response.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
    const response = await axios.put<Task>(`/api/tasks/${task.id}`, task);
    return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    await axios.delete(`/api/tasks/${taskId}`);
};
