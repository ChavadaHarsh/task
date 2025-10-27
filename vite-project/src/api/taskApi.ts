import type {
  CreateTaskResponse,
  GetTaskResponse,
  GetTasksResponse,
  Task,
  updatedata,
  UserByRoleResponse,
} from "../pages/types";
import { apiClient } from "./apiClient";

export const createTask = async (
  token: string | null | undefined,
  taskData: Task
): Promise<CreateTaskResponse> => {
  return apiClient("/tasks/createTask", {
    method: "POST",
    body: taskData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTaskForSeparateUser = async (
  token: string | null | undefined,
  userId: string | null | undefined,

): Promise<GetTasksResponse> => {
  if (!token || !userId) throw new Error("Token and userId are required");

  return apiClient(
    `/tasks/getTaskForSeparateUser/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const statusChangeTask = async (
  token: string | null | undefined,
  id: string | null,
  status: "completed" | "pending",
  statusChangeRole: "none" | "admin" | "employee",
  adminId?: string | null
): Promise<void> => {
  await apiClient(`/tasks/status/${id}`, {
    method: "PUT",
    body: { status, statusChangeRole },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTaskById = async (
  token: string,
  id: string
): Promise<GetTaskResponse> => {
  const res = await apiClient(`/tasks/getParticulerTask/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res; // ✅ return the response
};
export const deleteTask = async (
  token: string | null,
  id: string | null | undefined
) => {
  await apiClient(`/tasks/deleteTask/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTask = async (
  token: string | null,
  id: string | null | undefined,
  taskData: Task
): Promise<GetTaskResponse> => {
  return await apiClient(`/tasks/updateTask/${id}`, {
    method: "PUT",
    body: taskData, // ensure apiClient handles JSON body
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserById = async (
  token: string,
  id: string
): Promise<UserByRoleResponse> => {
  return await apiClient(`/tasks/getUserById/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};