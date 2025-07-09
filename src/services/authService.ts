import { apiClient } from "../utils/axios/apiClient";
import { ApiResponse, ApiResponseWrapper } from "../utils/apiResponse";
import { SocialLoginData } from "../types/dtos/auth";

const NAVER_LOGIN_ENDPOINT = process.env.REACT_APP_NAVER_LOGIN_ENDPOINT!;

// Re-export for backward compatibility
export type { SocialLoginData };
export type SocialLoginResponse = ApiResponse<SocialLoginData>;

export class AuthService {
  // OAuth flow - redirect to backend which redirects to Naver
  static initiateNaverLogin(): void {
    // For OAuth, we need full browser redirect, not AJAX
    const baseUrl = apiClient.defaults.baseURL;
    const loginUrl = `${baseUrl!.replace(/\/$/, "")}${NAVER_LOGIN_ENDPOINT}`;
    console.log("Redirecting to Naver OAuth:", loginUrl);
    window.location.href = loginUrl;
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on backend, we'll clear local storage
      throw error;
    }
  }

  static async refreshToken(
    refreshToken: string
  ): Promise<SocialLoginResponse> {
    try {
      const response = await apiClient.post<SocialLoginResponse>(
        "/auth/refresh",
        {
          refreshToken,
        }
      );

      return ApiResponseWrapper.validateResponse<SocialLoginData>(
        response.data
      );
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }

  /**
   * 소셜로그인 성공시, HttpOnly Cookie를 통해 액세스토큰을 발급받습니다.
   * redirectedFromSocialLogin 파라미터가 있을 때 호출됩니다.
   */
  static async socialLoginAccessToken(): Promise<void> {
    try {
      // HttpOnly cookie(refresh token)를 통해 액세스토큰 요청
      const response = await apiClient.post<SocialLoginResponse>(
        "/auth/social/token"
      );

      const validatedResponse =
        ApiResponseWrapper.validateResponse<SocialLoginData>(response.data);
      const { token, tokenType, memberId, memberRole, userInfo } =
        validatedResponse.data;

      // 로컬스토리지에 저장
      localStorage.setItem("auth_token", token);
      localStorage.setItem("token_type", tokenType);
      localStorage.setItem("memberId", memberId);
      localStorage.setItem("memberRole", memberRole);
      localStorage.setItem("user_info", JSON.stringify(userInfo));

      // URL에서 redirectedFromSocialLogin 파라미터 제거
      const url = new URL(window.location.href);
      url.searchParams.delete("redirectedFromSocialLogin");
      const cleanUrl = url.pathname + url.search;
      window.history.replaceState({}, document.title, cleanUrl);
    } catch (error) {
      console.error("Social login access token exchange error:", error);

      // 실패시 쿠키 정리 요청 (optional)
      try {
        await apiClient.post("/auth/logout");
      } catch (logoutError) {
        console.error("Cookie cleanup failed:", logoutError);
      }

      // 로컬스토리지 정리 (navigation is handled by the calling component)
      localStorage.clear();
      throw error;
    }
  }
}
