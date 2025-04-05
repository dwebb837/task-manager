export interface Task {
    id: string;
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
