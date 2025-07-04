export interface UserType {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  googleId: string;
  createdAt: string;
  publicId: string;
  credits: number;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    narrativeType?: "short" | "long";
    parameters?: NarrativeParameters;
  };
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface NarrativeParameters {
  industry: string;
  brandValues: string;
  targetAudience: string;
  brandMission: string;
  uniqueSellingProposition: string;
  // Long narrative additional fields
  toneOfVoice?: string;
  brandPersonality?: string;
  competitorAnalysis?: string;
  marketPositioning?: string;
  successMetrics?: string;
}

export interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CreditsState {
  remaining: number;
  lastReset: string;
  loading: boolean;
}

export interface NarrativesState {
  chatHistory: ChatThread[];
  currentThread: ChatMessage[];
  currentChatId: string | null;
  isGenerating: boolean;
  isStreaming: boolean;
  error: string | null;
  loading: boolean;
}

export interface ThemeState {
  mode: "light" | "dark";
}

export interface RootState {
  auth: AuthState;
  credits: CreditsState;
  narratives: NarrativesState;
  theme: ThemeState;
}
