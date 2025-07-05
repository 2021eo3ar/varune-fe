import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, MessageSquare, Clock } from "lucide-react";
import { RootState } from "../../store";
import {
  clearCurrentThread,
  setCurrentChatID,
  setCurrentThread,
} from "../../store/slices/narrativesSlice";
import { formatTime } from "../../utils";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { chatHistory, loading } = useSelector(
    (state: RootState) => state.narratives,
  );

  const handleNewChat = () => {
    dispatch(clearCurrentThread());
  };

  const handleSelectChat = (threadId: string) => {
    const thread = chatHistory.find((t) => t.id === threadId);
    if (thread) {
      dispatch(setCurrentChatID(thread.id));
      dispatch(setCurrentThread(thread.messages));
    }
  };

  const formatDate = (dateString: string) => {
    const inputDate = new Date(dateString);
    const now = new Date();

    // Reset times to midnight for calendar day comparison
    const input = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate(),
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = today.getTime() - input.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return inputDate.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">New Brand Story</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Recent Conversations
          </h3>

          {loading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full animate-pulse p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No conversations yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Start your first brand narrative
              </p>
            </div>
          ) : (
            chatHistory.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleSelectChat(thread.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full opacity-60 group-hover:opacity-100"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {thread.title}
                    </h4>

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                      {thread.messages[
                        thread.messages.length - 1
                      ]?.content.substring(0, 50)}
                      ...
                    </p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(thread.updatedAt)},{" "}
                        {formatTime(thread.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
