import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { dummyData } from '../utils/data';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === dummyData.admin.username && password === dummyData.admin.password) {
        storage.set('adminLoggedIn', true);
        navigate('/');
      } else {
        setError('Invalid credentials. Use admin@laundry.com / admin123');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="./images/image1.jpeg"
            alt="Laundry Service"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 w-full">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="">
                <img
                  src="./images/logo.jpeg"
                  alt="Logo"
                  className="h-20 w-auto"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Y Laundry</h1>
                <p className="text-white/90 text-sm">Management System</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold text-white mb-3">
                Welcome Back
              </h2>
              <p className="text-white/80">
                Sign in to manage your laundry operations efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">🧺</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">LaundryPro</h1>
            <p className="text-gray-600 text-sm">Admin Dashboard</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
              <p className="text-gray-600 text-sm mt-1">Enter your credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
                  placeholder="admin@laundry.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 text-primary border-gray-300 rounded"
                  />
                  <span className="text-gray-600 text-xs">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:text-primary-dark text-xs font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm font-medium mb-2 text-center">Demo Credentials</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                  <span className="text-gray-600">Email:</span>
                  <code className="text-primary font-medium">admin@laundry.com</code>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                  <span className="text-gray-600">Password:</span>
                  <code className="text-primary font-medium">admin123</code>
                </div>
              </div>
              <p className="text-gray-500 text-xs text-center mt-2">
                Use these to explore the dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;