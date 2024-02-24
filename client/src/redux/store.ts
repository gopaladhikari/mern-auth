import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { changePasswordReducer } from "./slices/changePasswordSlice";

const isDev = import.meta.env.DEV;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    changePassword: changePasswordReducer,
  },
  devTools: isDev,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
