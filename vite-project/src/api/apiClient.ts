import type { ApiOptions } from "../pages/types";

const API_URL = import.meta.env.VITE_API_URL as string;

export const apiClient = async (
  endpoint: string,
  {
    method = "GET",
    body = null,
    token = null,
    headers: customHeaders = {},
  }: ApiOptions = {}
) => {
  // Base headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders, // merge any custom headers
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    const message = data?.message || `API Error: ${response.status}`;
    throw new Error(message);
  }

  return data;
};
