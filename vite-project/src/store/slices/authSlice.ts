import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse, user } from "../../pages/types";

interface AuthState {
  user: user | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const ONE_HOUR = 60 * 60 * 1000; // 1 hour

// ✅ Helper: check if session is valid
const isSessionValid = (): boolean => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");
  if (!token || !loginTime) return false;

  const now = Date.now();
  return now - parseInt(loginTime) <= ONE_HOUR;
};

// ✅ Initialize from localStorage if valid
const initialState: AuthState = isSessionValid()
  ? {
      user: JSON.parse(localStorage.getItem("user")!),
      token: localStorage.getItem("token"),
      loading: false,
      error: null,
    }
  : {
      user: null,
      token: null,
      loading: false,
      error: null,
    };

// ✅ Clear expired or invalid session
if (!isSessionValid()) localStorage.clear();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionSet: (
      state,
      action: PayloadAction<{ user: LoginResponse["user"]; token: string }>
    ) => {
      const existingUser = localStorage.getItem("user");

      // ✅ If another user already logged in — logout them first
      if (existingUser) {
        const storedUser = JSON.parse(existingUser);
        if (storedUser.email !== action.payload.user.email) {
          // Notify all tabs to logout
          localStorage.setItem(
            "auth-event",
            JSON.stringify({ type: "force-logout", time: Date.now() })
          );
          localStorage.clear();
          alert("Another user was logged in — previous session cleared.");
        }
      }

      // ✅ Save new session in localStorage
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("loginTime", Date.now().toString());

      // Notify other tabs
      localStorage.setItem(
        "auth-event",
        JSON.stringify({
          type: "login",
          user: action.payload.user.email,
          time: Date.now(),
        })
      );
    },

    sessionRemove: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
      // Notify other tabs
      localStorage.setItem(
        "auth-event",
        JSON.stringify({ type: "logout", time: Date.now() })
      );
    },

    updateUser: (state, action: PayloadAction<Partial<user>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { sessionSet, sessionRemove, updateUser } = authSlice.actions;
export default authSlice.reducer;
