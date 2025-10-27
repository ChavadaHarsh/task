import type {
  DepartmentUserCountResponse,
  GetAllUserResponse,
  UsersByRoleResponse,
} from "../../pages/types";
import { apiClient } from "../apiClient";

export const getParticularDepartmentUserCount = async (
  token: string | null
): Promise<DepartmentUserCountResponse> => {
  const response = await apiClient("/auth/getParticularDepartmentUserCount", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response as DepartmentUserCountResponse;
};

export const getUsersByRole = async (
  token: string | null,
  department: string | null
): Promise<UsersByRoleResponse> => {
  const response = await apiClient(`/auth/getUsersByRole/${department}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response as UsersByRoleResponse;
};

export const getAllUser = async (
  token: string | null
): Promise<GetAllUserResponse> => {
  if (!token) throw new Error("No token provided");

  const response = await apiClient(`/auth/getAllUser`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteUser = async (
  token: string | null,
  id: string
): Promise<any> => {
  const response = await apiClient(`/auth/deleteUser/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
