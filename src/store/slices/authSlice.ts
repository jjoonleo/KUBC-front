import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/authService";
import { NavigateFunction } from "react-router-dom";

interface User {
  id: string;
  nickname: string;
  name: string;
  email: string;
  gender: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  tokenType: string | null;
  loading: boolean;
  error: string | null;
}

// Check localStorage immediately when creating initial state
const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem("auth_token");
  const tokenType = localStorage.getItem("token_type");
  const userInfo = localStorage.getItem("user_info");

  if (token && tokenType && userInfo) {
    try {
      return {
        isAuthenticated: true,
        user: JSON.parse(userInfo),
        token,
        tokenType,
        loading: false,
        error: null,
      };
    } catch (error) {
      console.error("Failed to parse user info from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("user_info");
    }
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
    tokenType: null,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

// Async Thunk Actions - These call AuthService
export const naverLogin = createAsyncThunk(
  "auth/naverLogin",
  async (_, { rejectWithValue }) => {
    try {
      // This will redirect the browser - no return value
      AuthService.initiateNaverLogin();
      // Return a placeholder since we're redirecting
      return { redirecting: true };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const handleSocialLoginCallback = createAsyncThunk(
  "auth/handleSocialLoginCallback",
  async (navigate: NavigateFunction, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Starting social login callback thunk...");

      await AuthService.socialLoginAccessToken();

      console.log("📋 Redux: Reading stored values from localStorage...");

      // Return user info from localStorage after successful login
      const token = localStorage.getItem("auth_token");
      const tokenType = localStorage.getItem("token_type");
      const memberId = localStorage.getItem("memberId");
      const memberRole = localStorage.getItem("memberRole");
      const userInfo = localStorage.getItem("user_info");

      console.log("📋 Redux: Retrieved from localStorage:", {
        token: token ? `${token.substring(0, 20)}...` : "MISSING",
        tokenType: tokenType || "MISSING",
        memberId: memberId || "MISSING",
        memberRole: memberRole || "MISSING",
        userInfo: userInfo ? "EXISTS" : "MISSING",
      });

      if (!token || !tokenType || !userInfo) {
        console.error("❌ Redux: Missing required login information");
        throw new Error("Failed to retrieve login information");
      }

      const payload = {
        token,
        tokenType,
        memberId: memberId || "",
        memberRole: memberRole || "",
        userInfo: JSON.parse(userInfo),
      };

      console.log(
        "✅ Redux: Social login callback successful, returning payload"
      );
      return payload;
    } catch (error) {
      console.error("❌ Redux: Social login callback failed:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Social login callback failed"
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
      console.log("🔄 Redux: Restoring session from localStorage...");
      const token = localStorage.getItem("auth_token");
      const tokenType = localStorage.getItem("token_type");
      const userInfo = localStorage.getItem("user_info");

      console.log("📋 Redux: Found in localStorage:", {
        token: token ? `${token.substring(0, 20)}...` : "MISSING",
        tokenType: tokenType || "MISSING",
        userInfo: userInfo ? "EXISTS" : "MISSING",
      });

      if (token && tokenType && userInfo) {
        state.isAuthenticated = true;
        state.token = token;
        state.tokenType = tokenType;
        state.user = JSON.parse(userInfo);
        console.log(
          "✅ Redux: Session restored successfully, user authenticated"
        );
      } else {
        console.log(
          "❌ Redux: Session restoration failed - missing required data"
        );
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.tokenType = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk actions
    builder
      // Naver Login (redirects - no real state changes)
      .addCase(naverLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(naverLogin.fulfilled, (state) => {
        // This case probably won't be reached since we redirect
        state.loading = false;
      })
      .addCase(naverLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Social Login Callback Handling
      .addCase(handleSocialLoginCallback.pending, (state) => {
        console.log("🔄 Redux State: Social login callback pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSocialLoginCallback.fulfilled, (state, action) => {
        console.log("✅ Redux State: Social login callback fulfilled!");
        const { token, tokenType, memberId, memberRole, userInfo } =
          action.payload;

        console.log("📋 Redux State: Updating auth state with:", {
          tokenType,
          memberId: memberId || "EMPTY",
          memberRole: memberRole || "EMPTY",
          userNickname: userInfo?.nickname || "UNKNOWN",
        });

        state.isAuthenticated = true;
        state.user = userInfo;
        state.token = token;
        state.tokenType = tokenType;
        state.loading = false;
        state.error = null;

        // Store in localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("token_type", tokenType);
        localStorage.setItem("memberId", memberId || "");
        localStorage.setItem("memberRole", memberRole || "");
        localStorage.setItem("user_info", JSON.stringify(userInfo));

        console.log(
          "💾 Redux State: Authentication successful, user logged in!"
        );
      })
      .addCase(handleSocialLoginCallback.rejected, (state, action) => {
        console.log("❌ Redux State: Social login callback rejected!");
        console.error("Error payload:", action.payload);

        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.tokenType = null;
        state.loading = false;
        state.error = action.payload as string;

        // Clear localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("memberId");
        localStorage.removeItem("memberRole");
        localStorage.removeItem("user_info");

        console.log(
          "🧹 Redux State: Cleared authentication state due to error"
        );
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
