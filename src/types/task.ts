export interface Task {
    id?: number;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    dueDate: string;
    assignee: string;
}

export interface PaginatedTasksResult {
    tasks: Task[];
    nextPage?: number;
    totalTasks: number;
}
