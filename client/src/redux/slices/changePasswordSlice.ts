import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showOldPassword: false,
  showNewPassword: false,
  showConfirmPassword: false,
  showChangePassword: false,
  changePasswordSucess: false,
};

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    showNewPassword: (state) => ({
      ...state,
      showNewPassword: !state.showNewPassword,
    }),
    showConfirmPassword: (state) => ({
      ...state,
      showConfirmPassword: !state.showConfirmPassword,
    }),
    showChangePasswordForm: (state) => ({
      ...state,
      showChangePassword: !state.showChangePassword,
    }),

    showOldPassword: (state) => ({
      ...state,
      showOldPassword: !state.showOldPassword,
    }),

    changePasswordSucess: (state, action) => ({
      ...state,
      changePasswordSucess: action.payload,
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
