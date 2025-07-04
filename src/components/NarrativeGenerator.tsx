import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles, Settings, Send } from "lucide-react";
import { RootState } from "../store";
import {
  generateNarrative,
  addMessage,
  continueNarrative,
} from "../store/slices/narrativesSlice";
import { NarrativeParameters } from "../types";
import ChatMessage from "./common/ChatMessage";
import NarrativeForm from "./forms/NarrativeForm";
import LoadingSpinner from "./common/LoadingSpinner";

const NarrativeGenerator: React.FC = () => {
  const editable = true;

  const dispatch = useDispatch();
  const {
    currentThread,
    isGenerating,
    isStreaming,
    currentChatId: chatId,
  } = useSelector((state: RootState) => state.narratives);
  const { remaining: credits } = useSelector(
    (state: RootState) => state.credits,
  );

  const [showForm, setShowForm] = useState(false);
  const [narrativeType, setNarrativeType] = useState<"short" | "long">("short");
  const [prompt, setPrompt] = useState("");

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credits <= 0) {
      alert("You have no credits remaining. Please upgrade your plan.");
      return;
    }

    if (!prompt.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: prompt,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));

    // Generate narrative and consume credit
    try {
      setPrompt("");
      await dispatch(continueNarrative({ prompt, chatId: chatId! }) as any);
    } catch (error) {
      console.error("Failed to generate narrative:", error);
    }
  };

  const handleGenerateNarrative = async (
    parameters: NarrativeParameters,
    type: "short" | "long",
  ) => {
    if (credits <= 0) {
      alert("You have no credits remaining. Please upgrade your plan.");
      return;
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: `Generate a ${type} brand narrative for my ${parameters.industry} business`,
      timestamp: new Date().toISOString(),
      metadata: { narrativeType: type, parameters },
    };

    dispatch(addMessage(userMessage));

    // Generate narrative and consume credit
    try {
      await dispatch(generateNarrative({ parameters, type }) as any);
    } catch (error) {
      console.error("Failed to generate narrative:", error);
    }

    setShowForm(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {currentThread.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to craft your brand story?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Share your brand details and let AI create compelling narratives
                that resonate with your audience.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Creating
              </button>
            </div>
          </div>
        ) : (
          currentThread.map((message, idx) => {
            const isLatest =
              idx === currentThread.length - 1 &&
              message.type === "assistant" &&
              isStreaming;
            return (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={isLatest}
              />
            );
          })
        )}

        {isGenerating && (
          <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <LoadingSpinner size="sm" />
            <span className="text-gray-600 dark:text-gray-300">
              Crafting your brand narrative...
            </span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4 transition-colors duration-200">
        <form
          onSubmit={handlePromptSubmit}
          className="flex items-center space-x-3"
        >
          {editable && currentThread?.length > 1 ? (
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write your prompt here..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={isGenerating || isStreaming || credits <= 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {credits <= 0
                  ? "No credits remaining"
                  : "Configure brand parameters"}
              </span>
            </button>
          )}

          <div className="flex items-center space-x-2">
            {editable && currentThread?.length > 1 ? (
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                <Send />
              </button>
            ) : (
              <select
                value={narrativeType}
                onChange={(e) =>
                  setNarrativeType(e.target.value as "short" | "long")
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="short">Short Narrative</option>
                <option value="long">Long Narrative</option>
              </select>
            )}
          </div>
        </form>
      </div>

      {/* Narrative Form Modal */}
      {showForm && (
        <NarrativeForm
          type={narrativeType}
          onSubmit={(params) => handleGenerateNarrative(params, narrativeType)}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default NarrativeGenerator;
