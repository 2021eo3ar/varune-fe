import React from "react";
import { User, Sparkles, Copy, Check } from "lucide-react";
import { ChatMessage as ChatMessageType, RootState } from "../../types";
import { setIsStreaming } from "../../store/slices/narrativesSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatTime } from "../../utils";

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
  onStream?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLatest,
  onStream,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [displayedText, setDisplayedText] = React.useState("");
  const dispatch = useDispatch();
  const userImage = useSelector(
    (state: RootState) => state.auth.user?.profileImage,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  React.useEffect(() => {
    if (!isLatest) {
      setDisplayedText(message?.content);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + message.content[i]);
      onStream?.();
      i++;
      if (i >= message.content.length) {
        clearInterval(interval);
        dispatch(setIsStreaming(false));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [isLatest, message]);

  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end pl-20" : "justify-start pr-20"}`}
    >
      <div
        className={`flex max-w-4xl ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === "user"
                ? "bg-blue-100 dark:bg-blue-900/30 ml-3"
                : "bg-purple-100 dark:bg-purple-900/30 mr-3"
            }`}
          >
            {message.type === "user" ? (
              <>
                {userImage && userImage !== "" ? (
                  <img
                    src={userImage}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </>
            ) : (
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${message.type === "user" ? "mr-3" : "ml-3"}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              message.type === "user"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-white"
            } transition-colors duration-200`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {displayedText}
            </div>

            {/* Metadata for narrative parameters */}
            {message.metadata?.parameters && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 opacity-75">
                <div className="text-xs space-y-1">
                  <div>
                    <strong>Industry:</strong>{" "}
                    {message.metadata.parameters.industry}
                  </div>
                  <div>
                    <strong>Type:</strong> {message.metadata.narrativeType}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Actions */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>

            {message.type === "assistant" && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
