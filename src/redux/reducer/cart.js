const { createSlice } = require("@reduxjs/toolkit");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const itemIndex = state.cartItems.findIndex((i) => i.id === item.id);
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
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const itemIndex = state.cartItems.findIndex((i) => i.id === id);
      if (itemIndex !== -1) {
        state.totalQuantity -= state.cartItems[itemIndex].quantity;
        state.totalPrice -=
          state.cartItems[itemIndex].price *
          state.cartItems[itemIndex].quantity;
        state.cartItems.splice(itemIndex, 1);
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    addCartFromLocalStorage(state, action) {
      const cart = action.payload;
      state.cartItems = cart;
      state.totalQuantity = cart.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);
      state.totalPrice = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
    },
  },
});

export const { addToCart, removeFromCart, addCartFromLocalStorage } =
  cartSlice.actions;

export default cartSlice.reducer;
