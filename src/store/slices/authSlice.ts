import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserType } from '../../types';
import { authAPI } from '../../services/api';
import axios from 'axios';
import { clearAuthCookies } from './_logoutHelper';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (credential: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credential);
      localStorage.setItem('auth_token', response.token);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Call backend logout endpoint to clear cookies
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });
      // Proactively clear cookies on the client (for SPA logout UX)
      clearAuthCookies();
      // Clear localStorage auth_token and user info
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return null;
    } catch (error: any) {
      // Still try to clear cookies even if backend fails
      clearAuthCookies();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return rejectWithValue(error?.response?.data?.message || error.message || 'Logout failed');
    }
  }
);

export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');
      
      const response = await authAPI.validateToken(token);
      return response.user;
    } catch (error: any) {
      localStorage.removeItem('auth_token');
      return rejectWithValue(error.message || 'Token validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Validate token
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;