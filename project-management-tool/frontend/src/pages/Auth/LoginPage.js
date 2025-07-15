// frontend/src/pages/Auth/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Essential for auth state

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  // Get isAuthenticated, loading from AuthContext, and the login function itself
  const { isAuthenticated, loading, login } = useAuth(); // Destructure 'login' from useAuth

  // Effect to handle redirection *after* authentication state changes in AuthContext
  useEffect(() => {
    console.log("LoginPage useEffect triggered:");
    console.log("  AuthContext Loading:", loading);
    console.log("  AuthContext Authenticated:", isAuthenticated);

    // If AuthContext has finished its initial load AND user is now authenticated, navigate.
    if (!loading && isAuthenticated) {
      console.log("LoginPage: Auth state is true, redirecting to Dashboard!");
      // Add a small delay to ensure React Router processes the navigation
      // after the state update has fully propagated. This helps prevent race conditions.
      setTimeout(() => {
        navigate('/dashboard', { replace: true }); // Use replace for clean history
      }, 50);
    }
  }, [isAuthenticated, loading, navigate]); // Dependencies: effect runs when these values change

  // Handles the form submission (login attempt)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage('Logging in...'); // Set a loading message
    console.log("LoginPage: handleSubmit triggered. Attempting login...");
    try {
      // Call the 'login' function from AuthContext.
      // This function internally calls authService.login and then AuthContext's loadUser().
      await login({ email, password });
      setMessage('Login successful!'); // Message will update, then useEffect handles navigation
      console.log("LoginPage: Login process complete. AuthContext state should now update.");

    } catch (error) {
      console.error('LoginPage: Login error:', error.response?.data || error.message);
      setMessage(error.response?.data?.msg || 'Login failed. Invalid credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-10
                    bg-white dark:bg-neutral-800
                    border border-neutral-300 dark:border-neutral-700
                    rounded-xl shadow-xl
                    font-sans
                    text-neutral-800 dark:text-neutral-200">
      <h2 className="text-4xl font-semibold text-center text-primary-700 dark:text-primary-400 mb-8 tracking-tight">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-left text-neutral-800 dark:text-neutral-300 text-sm font-medium mb-2" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="shadow-sm appearance-none border border-neutral-300 dark:border-neutral-600 rounded-lg
                  w-full py-2.5 px-4
                  text-neutral-900 dark:text-neutral-100
                  leading-tight focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500
                  transition-all duration-200 ease-in-out"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-left text-neutral-800 dark:text-neutral-300 text-sm font-medium mb-2" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="shadow-sm appearance-none border border-neutral-300 dark:border-neutral-600 rounded-lg
                  w-full py-2.5 px-4
                  text-neutral-900 dark:text-neutral-100
                  mb-4 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500
                  transition-all duration-200 ease-in-out"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-3 px-6
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800
                     w-full transition-all duration-200 ease-in-out"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-6 text-accent-600 text-center text-sm italic dark:text-accent-400">{message}</p>}
      <p className="mt-6 text-center text-neutral-700 text-base dark:text-neutral-300">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 ease-in-out dark:text-primary-400 dark:hover:text-primary-500">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
