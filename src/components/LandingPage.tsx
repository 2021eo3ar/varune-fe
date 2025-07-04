import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Sparkles, Target, MessageSquare, Zap } from 'lucide-react';
import { RootState } from '../store';
import { setUser } from '../store/slices/authSlice';
import LoadingSpinner from './common/LoadingSpinner';
import ThemeToggle from './common/ThemeToggle';

const LandingPage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Utility to parse cookies
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  }

  // On mount, check for user cookie and set user in Redux
  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie));
        dispatch(setUser(user));
      } catch (e) {
        // ignore
      }
    }
  }, [dispatch]);

  // Redirect to backend for Google login
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  } 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">BrandNarrative AI</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Craft Compelling
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {' '}Brand Stories
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your brand vision into powerful narratives that connect with your audience. 
            AI-powered storytelling for the modern business.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <button
              onClick={handleGoogleLogin}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            {error && (
              <div className="mt-4 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Targeted Messaging</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Create narratives that resonate with your specific audience and industry
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <MessageSquare className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Chat</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Refine your brand story through conversational AI assistance
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <Zap className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Results</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Generate compelling brand narratives in seconds, not hours
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2025 BrandNarrative AI. Crafting stories that matter.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;