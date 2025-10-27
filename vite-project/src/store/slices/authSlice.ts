import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse, user } from "../../pages/types";

interface AuthState {
  user: user | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper: check if session is valid
const isSessionValid = (): boolean => {
  const token = sessionStorage.getItem("token");
  const loginTime = sessionStorage.getItem("loginTime");
  if (!token || !loginTime) return false;

  const now = Date.now();
  return now - parseInt(loginTime) <= ONE_HOUR;
};

// Initialize state from sessionStorage if valid
const initialState: AuthState = isSessionValid()
  ? {
      user: JSON.parse(sessionStorage.getItem("user")!),
      token: sessionStorage.getItem("token"),
      loading: false,
      error: null,
    }
  : {
      user: null,
      token: null,
      loading: false,
      error: null,
    };

// Clear expired session
if (!isSessionValid()) {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("loginTime");
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionSet: (
      state,
      action: PayloadAction<{ user: LoginResponse["user"]; token: string }>
    ) => {
      console.log("�� Session Set:", action.payload);
      // Only set session if no valid session exists
      if (!isSessionValid()) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        sessionStorage.setItem("loginTime", Date.now().toString());
      }
    },
    sessionRemove: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("loginTime");
    },
      updateUser: (state, action: PayloadAction<Partial<user>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { sessionSet, sessionRemove,updateUser  } = authSlice.actions;
export default authSlice.reducer;
