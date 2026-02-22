import React, { useState, useEffect, useContext, useCallback, lazy, Suspense } from 'react';
import './App.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DarkModeToggle from './components/DarkModeToggle';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import TaskStats from './components/TaskStats';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';

// Lazy load auth components for better performance
const AuthPage = lazy(() => import('./components/AuthPage'));
const UserHeader = lazy(() => import('./components/UserHeader'));

// Main App Content Component
function AppContent() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated()) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleAddTask = useCallback(async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks(prev => [response.data, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    }
  }, []);

  const handleToggleComplete = useCallback(async (id, currentStatus) => {
    try {
      const response = await updateTask(id, { completed: !currentStatus });
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data : task
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(prev => prev.filter(task => task._id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error(err);
      }
    }
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  }, []);

  if (authLoading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="App">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <AuthPage />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div>
          <h1>📝 My Todo App</h1>
          <p>Manage your tasks efficiently</p>
        </div>
        <div className="header-actions">
          <DarkModeToggle />
          <Suspense fallback={<div>...</div>}>
            <UserHeader />
          </Suspense>
        </div>
      </header>

      <div className="container">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}
        
        <TaskStats tasks={tasks} />
        <AddTask onAddTask={handleAddTask} />
        
        <TaskFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <div className="filter-info">
            <span>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        )}
        
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;