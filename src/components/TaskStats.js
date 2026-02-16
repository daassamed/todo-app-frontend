import React from 'react';

const TaskStats = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="task-stats">
      <div className="stat-card">
        <div className="stat-value">{total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{active}</div>
        <div className="stat-label">Active</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{completed}</div>
        <div className="stat-label">Completed</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{completionRate}%</div>
        <div className="stat-label">Completion Rate</div>
      </div>
    </div>
  );
};

export default TaskStats;