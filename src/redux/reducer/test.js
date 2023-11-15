import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  tests: null,
  test: null,
};

const testSlice = createSlice({
  name: "tests",
  initialState: INITIAL_STATE,
  reducers: {
    setTests(state, action) {
      state.tests = action.payload;
    },
    setTest(state, action) {
      state.test = action.payload;
    },
  },
});

export const { setTests, setTest } = testSlice.actions;

export default testSlice.reducer;
