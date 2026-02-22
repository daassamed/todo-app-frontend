import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from './TaskList';

describe('TaskList Component', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      completed: false,
      priority: 'high'
    },
    {
      _id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      completed: true,
      priority: 'low'
    }
  ];

  const mockToggle = jest.fn();
  const mockDelete = jest.fn();

  test('renders loading state', () => {
    render(
      <TaskList
        tasks={[]}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
        loading={true}
      />
    );

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('renders empty state when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
        loading={false}
      />
    );

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  test('renders task list with correct count', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
        loading={false}
      />
    );

    expect(screen.getByText('Your Tasks (2)')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  test('renders tasks with correct priority badges', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
        loading={false}
      />
    );

    const highPriority = screen.getByText('high');
    const lowPriority = screen.getByText('low');

    expect(highPriority).toHaveClass('priority-high');
    expect(lowPriority).toHaveClass('priority-low');
  });
});