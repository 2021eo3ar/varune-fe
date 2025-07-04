import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  UserType,
  ChatThread,
  ChatMessage,
  NarrativeParameters,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

class APIClient {
  public async request<T>(config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await axios({
        baseURL: API_BASE_URL,
        withCredentials: true,
        ...config,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          error?.response?.data.message || `HTTP ${error?.response?.status}`,
        );
      } else {
        throw new Error("Network error");
      }
    }
  }

  // Mock implementation for demo purposes
  async mockRequest<T>(data: T, delay: number = 1000): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }
}

class AuthAPI extends APIClient {
  async login(credential: string) {
    // Mock implementation - replace with actual Google OAuth
    return this.mockRequest({
      user: {
        id: "1",
        email: "user@example.com",
        name: "John Doe",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        googleId: "google123",
        createdAt: new Date().toISOString(),
      } as UserType,
      token: "mock-jwt-token",
    });
  }

  async validateToken(token: string) {
    return this.mockRequest({
      user: {
        id: "1",
        email: "user@example.com",
        name: "John Doe",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        googleId: "google123",
        createdAt: new Date().toISOString(),
      } as UserType,
    });
  }
}

class CreditsAPI extends APIClient {
  async getCredits() {
    const res = await this.request<{
      data: {
        credits: number;
        lastCreditReset: string;
        name: string;
        email: string;
        publicId: string;
        profileImage: string;
      };
    }>({ url: "/narratives/userCredits" });
    return {
      remaining: res?.data?.credits,
      lastReset: res?.data?.lastCreditReset,
    };
  }
}

class NarrativesAPI extends APIClient {
  async continueNarrative(chatId: string, prompt: string) {
    const data = await this.request<{
      data: { response: string; chatId: string };
    }>({
      url: "/narratives/continueChat",
      method: "POST",
      data: {
        chatId,
        newInstruction: prompt,
      },
    });

    return {
      chatId: data?.data?.chatId,
      message: {
        id: Date.now().toString(),
        type: "assistant" as const,
        content: data?.data?.response,
        timestamp: new Date().toISOString(),
      } as ChatMessage,
    };
  }

  async generateNarrative(
    parameters: NarrativeParameters,
    type: "short" | "long",
  ) {
    const data = await this.request<{
      data: { response: string; chatId: string };
    }>({
      url: "/narratives/generate",
      method: "POST",
      data: {
        ...parameters,
        usp: parameters?.uniqueSellingProposition,
        narrativeLength: type,
      },
    });

    return {
      chatId: data?.data?.chatId,
      message: {
        id: Date.now().toString(),
        type: "assistant" as const,
        content: data?.data?.response,
        timestamp: new Date().toISOString(),
        metadata: {
          narrativeType: type,
          parameters,
        },
      } as ChatMessage,
    };
  }

  async getChatHistory() {
    const data = await this.request<{
      allChats: {
        chatId: string;
        chats: {
          id: number;
          chatId: string;
          chat: {
            role: "user" | "assistant";
            content: string;
          };
          userId: number;
          publicId: string;
          parentMessageId: null | number;
          messageRole: "user" | "assistant";
          createdAt: string;
          updatedAt: string;
        }[];
      }[];
    }>({
      url: "/narratives/userChats",
      method: "GET",
    });

    return data?.allChats?.map((chat, index) => ({
      id: chat?.chatId,
      title: "Narration Chat " + (data?.allChats?.length - index),
      messages: chat?.chats?.map((message) => ({
        id: String(message?.id),
        type: message?.messageRole,
        content: message?.chat?.content,
        timestamp: message?.updatedAt,
      })),
      createdAt: chat?.chats?.[0]?.createdAt,
      updatedAt: chat?.chats?.[chat?.chats?.length - 1]?.updatedAt,
    })) as ChatThread[];
  }
}

export const authAPI = new AuthAPI();
export const creditsAPI = new CreditsAPI();
export const narrativesAPI = new NarrativesAPI();
