const { createSlice } = require("@reduxjs/toolkit");

const INITIAL_STATE = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (i) => i.demoId === item.demoId,
      );
      if (itemIndex === -1) {
        state.cartItems.push({
          ...item,
          quantity: 1,
        });
        if (typeof item.price === "string") {
          item.price = parseInt(item.price);
        }
        if (typeof item.quantity === "string") {
          item.quantity = parseInt(item.quantity);
        }
        state.totalQuantity += 1;
        state.totalPrice += item.price;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
        localStorage.setItem(
          "totalQuantity",
          JSON.stringify(state.totalQuantity),
        );
        localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const itemIndex = state.cartItems.findIndex((i) => i.demoId === id);
      if (itemIndex !== -1) {
        state.totalQuantity -= state.cartItems[itemIndex].quantity;
        state.totalPrice -=
          state.cartItems[itemIndex].price *
          state.cartItems[itemIndex].quantity;
        state.cartItems.splice(itemIndex, 1);
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
        localStorage.setItem(
          "totalQuantity",
          JSON.stringify(state.totalQuantity),
        );
        localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
      }
    },
    addCartFromLocalStorage(state, action) {
      const { cart, totalPrice, totalQuantity } = action.payload;
      state.cartItems = cart;
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
    },
  },
});

export const { addToCart, removeFromCart, addCartFromLocalStorage } =
  cartSlice.actions;

export default cartSlice.reducer;
