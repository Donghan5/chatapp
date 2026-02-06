import { client } from "../../../lib/axios";
import type {
  LoginRequest,
  GoogleLoginRequest,
  AuthResponse,
  RegisterRequest,
} from "../types";
import type { User } from "@chatapp/common-types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  loginWithGoogle: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>("/auth/google", data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await client.get<User>("/auth/me");
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>("/auth/register", {
        username: data.username,
        email: data.email,
        passwordHash: data.password,
    });
    return response.data;
  },
};

