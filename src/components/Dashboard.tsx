import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { RootState } from "../store";
import { fetchChatHistory } from "../store/slices/narrativesSlice";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import NarrativeGenerator from "./NarrativeGenerator";
import UserProfile from "./UserProfile";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { chatHistory } = useSelector((state: RootState) => state.narratives);

  useEffect(() => {
    if (chatHistory.length === 0) {
      dispatch(fetchChatHistory() as any);
    }
  }, [dispatch, chatHistory.length]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chat History
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => setShowProfile(true)}
        />

        <main className="flex-1 overflow-hidden">
          <NarrativeGenerator />
        </main>
      </div>

      {/* User Profile Modal */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default Dashboard;
