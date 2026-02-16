import React from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task._id, task.completed)}
          className="task-checkbox"
        />
        <div className="task-details">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`priority priority-${task.priority}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="due-date">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={() => onDelete(task._id)} 
        className="delete-btn"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;