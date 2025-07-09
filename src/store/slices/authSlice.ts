import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "../../services/authService";

interface User {
  id: string;
  nickname: string;
  name: string;
  email: string;
  gender: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  tokenType: string;
  userInfo: User;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  tokenType: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  tokenType: null,
  loading: false,
  error: null,
};

// Async Thunk Actions - These call AuthService
export const naverLogin = createAsyncThunk(
  "auth/naverLogin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.naverLogin();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return true;
    } catch (error) {
      // Even if backend logout fails, we still want to logout locally
      console.error("Backend logout failed:", error);
      return true;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions
    restoreSession: (state) => {
      const token = localStorage.getItem("auth_token");
      const tokenType = localStorage.getItem("token_type");
      const userInfo = localStorage.getItem("user_info");

      if (token && tokenType && userInfo) {
        state.isAuthenticated = true;
        state.token = token;
        state.tokenType = tokenType;
        state.user = JSON.parse(userInfo);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk actions
    builder
      // Naver Login
      .addCase(naverLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(naverLogin.fulfilled, (state, action) => {
        const { token, tokenType, userInfo } = action.payload;
        state.isAuthenticated = true;
        state.user = userInfo;
        state.token = token;
        state.tokenType = tokenType;
        state.loading = false;
        state.error = null;

        // Store in localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("token_type", tokenType);
        localStorage.setItem("user_info", JSON.stringify(userInfo));
      })
      .addCase(naverLogin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.tokenType = null;
        state.loading = false;
        state.error = action.payload as string;

        // Clear localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user_info");
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.tokenType = null;
        state.loading = false;
        state.error = null;

        // Clear localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user_info");
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear local state
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.tokenType = null;
        state.loading = false;

        // Clear localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user_info");
      });
  },
});

export const { restoreSession, clearError } = authSlice.actions;
export default authSlice.reducer;
