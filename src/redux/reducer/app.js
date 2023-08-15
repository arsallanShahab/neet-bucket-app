import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  loading: false,
  error: null,
  data: null,
};

const appSlice = createSlice({
  name: "app",
  initialState: INITIAL_STATE,
  reducers: {
    setAppLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAppLoading } = appSlice.actions;

export default appSlice.reducer;
