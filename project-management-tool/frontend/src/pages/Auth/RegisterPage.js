// frontend/src/pages/Auth/RegisterPage.js
import React, { useState } from 'react';
import authService from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.register({ username, email, password });
      setMessage(response.msg || 'Registration successful!');
      navigate('/login'); // Navigate to login after successful registration
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setMessage(error.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-10
                    bg-white dark:bg-neutral-800
                    border border-neutral-300 dark:border-neutral-700
                    rounded-xl shadow-xl
                    font-sans
                    text-neutral-800 dark:text-neutral-200">
      <h2 className="text-4xl font-semibold text-center text-primary-700 dark:text-primary-400 mb-8 tracking-tight">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-left text-neutral-800 dark:text-neutral-300 text-sm font-medium mb-2" htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="shadow-sm appearance-none border border-neutral-300 dark:border-neutral-600 rounded-lg
                  w-full py-2.5 px-4
                  text-neutral-900 dark:text-neutral-100
                  leading-tight focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500
                  transition-all duration-200 ease-in-out"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
          Register
        </button>
      </form>
      {message && <p className="mt-6 text-accent-600 text-center text-sm italic dark:text-accent-400">{message}</p>}
      <p className="mt-6 text-center text-neutral-700 text-base dark:text-neutral-300">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 ease-in-out dark:text-primary-400 dark:hover:text-primary-500">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
