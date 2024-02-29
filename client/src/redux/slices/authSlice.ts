import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Payload = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  isPhoneNumberVerified: boolean;
  otpSent: boolean;
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
  phoneNumber: "",
  isPhoneNumberVerified: false,
  otpSent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Payload>) => ({
      ...state,
      ...action.payload,
      isAuthenticated: true,
    }),
    logout: () => initialState,

    setOtpSent: (state, action: PayloadAction<boolean>) => ({
      ...state,
      otpSent: action.payload,
    }),

    setIsPhoneNumberVerified: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isPhoneNumberVerified: action.payload,
    }),
  },
});

export const { login, logout, setOtpSent, setIsPhoneNumberVerified } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
