import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPaginatedTasks } from '../api/tasks';
import { useCallback, useRef, useEffect } from 'react';
import { PaginatedTasksResult } from '../../types/task';

export const InfiniteTaskList = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery<PaginatedTasksResult>({
        queryKey: ['paginatedTasks'],
        queryFn: ({ pageParam = 1 }) => fetchPaginatedTasks(pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        refetchOnWindowFocus: false,
    });

    const observer = useRef<IntersectionObserver>();
    const lastTaskRef = useCallback(
        (node: HTMLLIElement | null) => {
            if (isLoading || isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, hasNextPage, fetchNextPage, isFetchingNextPage]
    );

    // Debugging effect
    useEffect(() => {
        console.log('Current data:', data);
    }, [data]);

    if (isLoading) return <div className="loading">Loading tasks...</div>;
    if (isError) return <div className="error">Error: {error?.message}</div>;

    const allTasks = data?.pages.flatMap((page) => page.tasks) || [];

    return (
        <div className="task-list">
            <h2>Task List (Infinite Scroll)</h2>
            <div className="task-stats">
                Total Tasks: {data?.pages[0]?.totalTasks || 0}
            </div>
            <ul>
                {allTasks.map((task, index) => (
                    <li
                        key={`${task.id}-${index}`}
                        ref={index === allTasks.length - 1 ? lastTaskRef : null}
                        className={`task-card ${task.status}`}
                    >
                        <h3>{task.title}</h3>
                        <div className="task-meta">
                            <span className={`status-badge ${task.status}`}>
                                {task.status}
                            </span>
                            <span>Due: {task.dueDate}</span>
                            <span>Assigned to: {task.assignee}</span>
                        </div>
                    </li>
                ))}
            </ul>
            {isFetchingNextPage && (
                <div className="loading-more">Loading more tasks...</div>
            )}
            {!hasNextPage && allTasks.length > 0 && (
                <div className="no-more-tasks">No more tasks to load</div>
            )}
        </div>
    );
};