import React, { useState, useEffect } from 'react';
import './App.css';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import TaskStats from './components/TaskStats';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Apply filters whenever tasks or filter criteria change
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
      setError('Failed to fetch tasks. Make sure your backend is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks([response.data, ...tasks]);
      setError(null);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const response = await updateTask(id, { completed: !currentStatus });
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error(err);
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📝 My Todo App</h1>
        <p>Manage your tasks efficiently</p>
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

export default App;