import React, { useState } from 'react';

const AddTask = ({ onAddTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const { title, description, priority, dueDate } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onAddTask(formData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  return (
    <form onSubmit={onSubmit} className="add-task-form">
      <h2>Add New Task</h2>
      
      <div className="form-group">
        <input
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Task title *"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <textarea
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Task description (optional)"
          className="form-input"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            name="priority"
            value={priority}
            onChange={onChange}
            className="form-input"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={onChange}
            className="form-input"
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Add Task
      </button>
    </form>
  );
};

export default AddTask;