import React from 'react';

const TaskFilter = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange 
}) => {
  return (
    <div className="task-filter">
      <div className="filter-section">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <label>Status:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-section">
        <label>Priority:</label>
        <select 
          value={priorityFilter} 
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilter;