import { verifyToken } from "@/lib/authUtils";
import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    setUser(state, action) {
      const decodeToken = verifyToken(action.payload);
      state.user = decodeToken;
    },
    resetUser(state) {
      state.user = null;
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    resetToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, resetUser, setToken, resetToken } = authSlice.actions;

export default authSlice.reducer;
