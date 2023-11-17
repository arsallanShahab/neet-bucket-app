import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  orders: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: INITIAL_STATE,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
  },
});

export const { setOrders, setOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
