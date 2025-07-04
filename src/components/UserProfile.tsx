import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, LogOut, CreditCard, Calendar, Mail, User } from "lucide-react";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { remaining: credits, lastReset } = useSelector(
    (state: RootState) => state.credits,
  );

  // Redirect to landing page after logout
  useEffect(() => {
    if (isAuthenticated === false) {
      onClose();
      window.location.href = "/";
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout() as any);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <img
              src={
                user?.profileImage ||
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
              }
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Email:</span>
              <span className="text-gray-900 dark:text-white">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Joined:</span>
              <span className="text-gray-900 dark:text-white">
                {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                Account ID:{user?.publicId}
              </span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {user?.id}
              </span>
            </div>
          </div>

          {/* Credits Info */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Credits
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">
                  Remaining
                </span>
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  {Math.max(credits, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">
                  Last Reset:
                </span>
                <span className="text-blue-900 dark:text-blue-100">
                  {formatDate(lastReset)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
