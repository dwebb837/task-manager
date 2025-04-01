import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { InfiniteTaskList } from './components/InfiniteTaskList';
import { TaskDetail } from './components/TaskDetail';
import { TaskList } from './components/TaskList';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Basic Task List</Link>
            </li>
            <li>
              <Link to="/infinite">Infinite Scroll</Link>
            </li>
          </ul>
        </nav>
        <h1>Task Manager</h1>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/infinite" element={<InfiniteTaskList />} />
          <Route path="/task/:taskId" element={<TaskDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;