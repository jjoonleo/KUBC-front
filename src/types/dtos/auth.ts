import { User } from "../entities/user";

export interface SocialLoginData {
  token: string;
  tokenType: string;
  memberId: string;
  memberRole: string;
  userInfo: {
    id: string;
    nickname: string;
    name: string;
    email: string;
    gender: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  tokenType: string | null;
  loading: boolean;
  error: string | null;
}
