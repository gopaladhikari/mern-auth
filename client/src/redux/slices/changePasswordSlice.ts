import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShowOldPassword: false,
  isShowNewPassword: false,
  isshowConfirmPassword: false,
  isShowChangePassword: false,
  isChangePasswordSucess: false,
};

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    showNewPassword: (state) => ({
      ...state,
      isShowNewPassword: !state.isShowNewPassword,
    }),
    showConfirmPassword: (state) => ({
      ...state,
      isshowConfirmPassword: !state.isshowConfirmPassword,
    }),
    showChangePasswordForm: (state) => ({
      ...state,
      isShowChangePassword: !state.isShowChangePassword,
    }),

    showOldPassword: (state) => ({
      ...state,
      isShowOldPassword: !state.isShowOldPassword,
    }),

    changePasswordSucess: (state, action) => ({
      ...state,
      isChangePasswordSucess: action.payload,
    }),
  },
});

export const changePasswordReducer = changePasswordSlice.reducer;

export const {
  showConfirmPassword,
  showNewPassword,
  showChangePasswordForm,
  showOldPassword,
  changePasswordSucess,
} = changePasswordSlice.actions;
