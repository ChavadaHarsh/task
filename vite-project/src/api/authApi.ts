import type {
  ForgotPasswordResponse,
  ForgotPasswordValues,
  LoginResponse,
  LoginValues,
  RegisterResponse,
  RegisterValues,
  UpdateProfile,
  user,
} from "../pages/types";
import { apiClient } from "./apiClient";

// Register API function
export const registerApi = async (
  userData: RegisterValues
): Promise<RegisterResponse> => {
  return apiClient("/auth/register", {
    method: "POST",
    body: userData,
  });
};

export const loginUser = async (
  credentials: LoginValues
): Promise<LoginResponse> => {
  return apiClient("/auth/login", {
    method: "POST",
    body: credentials,
  });
};

export const forgotPassword = async (
  values: ForgotPasswordValues
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient("/auth/forgotPassword", {
    method: "PUT",
    body: values,
  });

  return response as ForgotPasswordResponse;
};

export const logoutUser = async (token: string | null): Promise<void> => {
  await apiClient("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = async (
  token: string | null,
  user: Partial<user>
): Promise<UpdateProfile> => {
  return await apiClient("/auth/updateProfile", {
    method: "POST",
    body: user,
    headers: {
      Authorization: `Bearer ${token}` ,
      "Content-Type": "application/json",
    },
  });
};