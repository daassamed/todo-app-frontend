import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleComplete, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>No tasks yet. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Your Tasks ({tasks.length})</h2>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;