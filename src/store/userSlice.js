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
    // logout: (state, action) => {
    //   state.loggedInUserDetails = null;
    // },
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
