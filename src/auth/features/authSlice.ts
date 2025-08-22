// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IAuthState, IUserState } from "../interfaces/user.interface";

const initialState: IAuthState = {
  accessToken: null,
  userState: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setUser(state, action: PayloadAction<IUserState>) {
      state.userState = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.userState = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    toggleRole: (state) => {
      if (state.userState) {
        const roles = ["user", "admin", "superadmin", "collaborator"];
        const currentIndex = roles.indexOf(state.userState.role);
        const newRole = roles[(currentIndex + 1) % roles.length]; // Alterna entre los roles

        state.userState.role = newRole;

        localStorage.setItem("auth", JSON.stringify(state));
      }
    },
  },
});

export const { setAccessToken, setUser, logout, setError, setLoading, toggleRole } = authSlice.actions;
export default authSlice.reducer;
