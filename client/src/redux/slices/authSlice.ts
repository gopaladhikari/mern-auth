import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Payload = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
};

type InitialState = Payload & {
  isAuthenticated: boolean;
};

const initialState: InitialState = {
  isAuthenticated: false,
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  accessToken: "",
  refreshToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Payload>) => {
      state.isAuthenticated = true;
      state._id = action.payload._id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
