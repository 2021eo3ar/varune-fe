import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  NarrativesState,
  ChatMessage,
  NarrativeParameters,
  ChatThread,
} from "../../types";
import { narrativesAPI } from "../../services/api";
import { decrementCredits } from "./creditsSlice";

const initialState: NarrativesState = {
  chatHistory: [],
  currentThread: [],
  currentChatId: null,
  isGenerating: false,
  isStreaming: false,
  error: null,
  loading: false,
};

export const generateNarrative = createAsyncThunk(
  "narratives/generateNarrative",
  async (
    params: { parameters: NarrativeParameters; type: "short" | "long" },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await narrativesAPI.generateNarrative(
        params.parameters,
        params.type,
      );
      dispatch(decrementCredits());
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to generate narrative",
      );
    }
  },
);

export const continueNarrative = createAsyncThunk(
  "narratives/continueNarrative",
  async (
    params: { chatId: string; prompt: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await narrativesAPI.continueNarrative(
        params.chatId,
        params.prompt,
      );
      dispatch(decrementCredits());
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to generate narrative",
      );
    }
  },
);

export const fetchChatHistory = createAsyncThunk(
  "narratives/fetchChatHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await narrativesAPI.getChatHistory();
      return response.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch chat history",
      );
    }
  },
);

const narrativesSlice = createSlice({
  name: "narratives",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.currentThread.push(action.payload);
    },
    clearCurrentThread: (state) => {
      state.currentThread = [];
    },
    setCurrentThread: (state, action: PayloadAction<ChatMessage[]>) => {
      state.currentThread = action.payload;
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    addHistoryItem: (state, action: PayloadAction<ChatThread>) => {
      state.chatHistory = [action.payload, ...state.chatHistory];
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChatID: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateNarrative.pending, (state) => {
        state.isGenerating = true;
        state.isStreaming = true;
        state.error = null;
      })
      .addCase(generateNarrative.fulfilled, (state, action) => {
        const msg = action.payload.message.content;
        const threadMsgs = [...state.currentThread, action.payload.message];
        const match = msg?.match(/\*\*Title of Narrative:\*\*\s*(.+)/);
        const title = match ? match[1]?.trim()?.replace(/"/g, "") : msg;

        state.isGenerating = false;
        state.currentChatId = action.payload.chatId;
        state.currentThread.push(action.payload.message);
        state.chatHistory = [
          {
            id: action.payload.chatId,
            messages: threadMsgs,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.chatHistory,
        ];
      })
      .addCase(generateNarrative.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      })

      .addCase(continueNarrative.pending, (state) => {
        state.isGenerating = true;
        state.isStreaming = true;
        state.error = null;
      })
      .addCase(continueNarrative.fulfilled, (state, action) => {
        const threadMsgs = [...state.currentThread, action.payload.message];
        state.isGenerating = false;
        state.currentThread.push(action.payload.message);
        state.chatHistory[0] = {
          ...state.chatHistory[0],
          messages: threadMsgs,
          updatedAt: new Date().toISOString(),
        };
      })
      .addCase(continueNarrative.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      })

      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addMessage,
  clearCurrentThread,
  setCurrentThread,
  clearError,
  setIsStreaming,
  setCurrentChatID,
  addHistoryItem,
} = narrativesSlice.actions;
export default narrativesSlice.reducer;
