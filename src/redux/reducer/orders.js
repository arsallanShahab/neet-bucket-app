import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  orders: [],
  order: {},
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
    setOrder(state, action) {
      state.order = action.payload;
    },
  },
});

export const { setOrders, setOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
