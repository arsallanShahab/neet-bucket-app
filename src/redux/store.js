import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./reducer/app";
import authReducer from "./reducer/auth";
import cartReducer from "./reducer/cart";
import ordersReducer from "./reducer/orders";
import testReducer from "./reducer/test";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    app: appReducer,
    tests: testReducer,
  },
});

export default store;
