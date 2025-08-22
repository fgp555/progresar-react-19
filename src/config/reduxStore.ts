// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/features/authSlice";

export const reduxStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
export default reduxStore;
