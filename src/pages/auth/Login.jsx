import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  // Controlled form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [success, setSuccess] = useState(false); // optional

  const handleSubmit = async (e) => {
    e.preventDefault();           // ← very important!
    setError('');                 // clear previous error
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/login',   // ← change to your real endpoint
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          // withCredentials: true,   // ← uncomment if using cookies / httpOnly tokens
        }
      );

      // ────────────────────────────────────────────────
      // Success — do what you need with the response
      // ────────────────────────────────────────────────
      console.log('Login successful:', response.data);

      const { token, user } = response.data;   // example structure

      // Most common patterns:
      // 1. Save token → localStorage / sessionStorage
      localStorage.setItem('token', token);

      // 2. Save to context / redux / zustand
      // setAuth({ user, token });

      // 3. Redirect
      // navigate('/dashboard');
      // window.location.href = '/dashboard';  // if not using router

      // setSuccess(true);   // optional success message

    } catch (err) {
      // ────────────────────────────────────────────────
      // Error handling — very important for good UX
      // ────────────────────────────────────────────────
      console.error('Login failed:', err);

      if (err.response) {
        // Server responded with 4xx / 5xx
        setError(
          err.response.data?.message ||
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`
        );
      } else if (err.request) {
        // No response received (network error, CORS, timeout...)
        setError('Network error. Please check your connection.');
      } else {
        // Something else went wrong while preparing request
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Kelab Fotokreatif UTM"
          src="https://studentaffairs.utm.my/kelabfotokreatif/wp-content/uploads/sites/69/2011/05/Watermark-KFK-copy1.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Not register yet?{' '}
          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;