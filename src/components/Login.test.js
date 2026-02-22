import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

// Mock the API
jest.mock('../services/api');

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockSwitchToRegister = jest.fn();

  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login onSwitchToRegister={mockSwitchToRegister} />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    renderLogin();
    
    expect(screen.getByText('🔐 Welcome Back!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to type in email and password fields', () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows "register here" link and calls switch function', () => {
    renderLogin();
    
    const registerLink = screen.getByText('Register here');
    fireEvent.click(registerLink);

    expect(mockSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  test('submits form and calls login on success', async () => {
    const mockResponse = {
      success: true,
      data: {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        token: 'fake-token'
      }
    };

    api.loginUser.mockResolvedValue(mockResponse);

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockLogin).toHaveBeenCalledWith(
        { _id: '123', name: 'Test User', email: 'test@example.com' },
        'fake-token'
      );
    });
  });

  test('displays error message on login failure', async () => {
    api.loginUser.mockRejectedValue({
      message: 'Invalid credentials'
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});