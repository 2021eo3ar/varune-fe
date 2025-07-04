import React from "react";
import { Menu, Sparkles, CreditCard } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick }) => {
  const { user, credits } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors duration-200"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              BrandNarrative AI
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Credits display */}
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {Math.max(credits, 0)} credits
            </span>
          </div>

          {/* User profile */}
          <button
            onClick={onProfileClick}
            className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <img
              src={
                user?.profileImage ||
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
              }
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {user?.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
