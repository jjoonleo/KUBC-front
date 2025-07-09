const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const NAVER_LOGIN_ENDPOINT =
  process.env.REACT_APP_NAVER_LOGIN_ENDPOINT ||
  "/api/auth/oauth2/authorization/naver";

export interface LoginResponse {
  success: boolean;
  token: string;
  tokenType: string;
  userInfo: {
    id: string;
    nickname: string;
    name: string;
    email: string;
    gender: string;
  };
}

export class AuthService {
  static async naverLogin(): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${NAVER_LOGIN_ENDPOINT}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (!data.success) {
        throw new Error("Login failed");
      }

      return data;
    } catch (error) {
      console.error("Naver login error:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("auth_token");
      const tokenType = localStorage.getItem("token_type");

      if (token && tokenType) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on backend, we'll clear local storage
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("auth_token");
    const tokenType = localStorage.getItem("token_type");

    if (token && tokenType) {
      return {
        Authorization: `${tokenType} ${token}`,
        "Content-Type": "application/json",
      };
    }

    return {
      "Content-Type": "application/json",
    };
  }
}
