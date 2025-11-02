import React, { useState } from 'react';
// import { Google } from 'lucide-react'; // <-- REMOVED this broken import

// A single component to handle both Sign In and Sign Up
const AuthPage = ({ onGoogleSignIn, onEmailLogin, onEmailSignUp }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      onEmailLogin(email, password);
    } else {
      onEmailSignUp(email, password);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      {/* UPDATED: Removed card classes like bg-white, shadow, border, etc. */}
      <div className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-400 mb-4">
          Welcome to
          <br />
          NOMAD NAVIGATOR
        </h2>
        <p className="text-center text-white text-opacity-90 mb-8">
          {isLoginView ? 'Sign in to begin your journey' : 'Create an account to get started'}
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={onGoogleSignIn}
          className="w-full flex items-center justify-center p-3 mb-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
        >
          <svg className="w-6 h-6 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691c-2.209 4.302-3.566 9.206-3.566 14.622C2.74 33.717 4.097 38.621 6.306 42.929l6.33-6.33C11.104 33.159 10 28.799 10 24c0-4.799 1.104-9.159 2.636-12.929l-6.33-6.38z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-6.19C28.941 34.026 26.593 35 24 35c-4.799 0-9.159-1.104-12.929-2.636l-6.38 6.38C14.14 41.023 18.834 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 6.19C40.098 35.803 44 30.338 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
          <span className="text-gray-700 dark:text-gray-200 font-medium">Sign in with Google</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            {/* UPDATED: Added background classes to match the transparent style */}
            <span className="px-2 bg-blue-50 dark:bg-blue-950 text-gray-500 dark:text-gray-400">Or with email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white text-opacity-90">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-orange-500 focus:border-orange-500 shadow-inner text-gray-700 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white text-opacity-90">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-orange-500 focus:border-orange-500 shadow-inner text-gray-700 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition duration-150 transform hover:scale-[1.02] active:scale-100"
          >
            {isLoginView ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-sm text-blue-400 hover:underline"
          >
            {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

