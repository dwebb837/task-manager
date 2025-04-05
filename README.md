# Task Manager Application
```
Build a Task Manager Application with advanced features of React Query.
⠀⠀⠀➥ Day 1
⠀⠀⠀⠀⠀⠀• Set up React Query with basic task fetching
⠀⠀⠀⠀⠀⠀• Configured default cache settings (staleTime, cacheTime)
⠀⠀⠀⠀⠀⠀• Built simple task list display
⠀⠀⠀➥ Day 2
⠀⠀⠀⠀⠀⠀• Implemented paginated task fetching
⠀⠀⠀⠀⠀⠀• Created infinite scroll with useInfiniteQuery
⠀⠀⠀⠀⠀⠀• Added basic filtering by task status
⠀⠀⠀➥ Day 3
⠀⠀⠀⠀⠀⠀• Built CRUD operations with useMutation
⠀⠀⠀⠀⠀⠀• Implemented optimistic updates for tasks
⠀⠀⠀⠀⠀⠀• Added error handling and toast notifications
⠀⠀⠀➥ Day 4
⠀⠀⠀⠀⠀⠀• Set up query invalidation after mutations
⠀⠀⠀⠀⠀⠀• Implemented automatic refetching on window focus
⠀⠀⠀⠀⠀⠀• Added loading states and UI feedback
⠀⠀⠀➥ Day 5
⠀⠀⠀⠀⠀⠀• Optimized component rendering
⠀⠀⠀⠀⠀⠀• Finalized UI polish and accessibility
```

## Tech Stacks
### Frontend:
- React with TypeScript
- React Query for data fetching and state management
- Axios for HTTP requests
- UUID for ID generation
- React Toastify for notifications
- Tailwind CSS for utility classes
- CSS Modules for component styling

### Backend:
- Express.js server
- REST API endpoints
- In-memory data storage (for demo purposes)

## Components

- TaskList - Displays the main list of tasks
- TaskItem - Individual task card with edit/delete functionality
- TaskForm - Form for creating/editing tasks
- InfiniteTaskList - Paginated task list with infinite scroll
- App - Main application container with routing

## Challenges

- Real-time UI updates:
- Implemented optimistic updates for smooth CRUD operations
- Managed loading states during mutations
- Type safety:
    * Strict TypeScript integration throughout components
    * Consistent typing between frontend and backend
- Pagination:
    * Infinite scroll implementation with proper query key management
    * Page parameter handling
- State synchronization:
    * Coordinated updates between different task views
    * Query invalidation after mutations

## Setup Guide

- Clone the repository:
```
git clone git@github.com:dwebb837/task-manager.git
cd task-manager-react-query
```

- Install dependencies:
```
npm install
```

- Start the development server:
```
npm run dev
```

- Access the application:
```
http://localhost:3002
```
