import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedInUserDetails: null,
  },
  reducers: {
    login: (state, action) => {
      state.loggedInUserDetails = action.payload;
    },
    logout: (state) => {
      state.loggedInUserDetails = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
