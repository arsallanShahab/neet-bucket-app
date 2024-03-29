const { createSlice } = require("@reduxjs/toolkit");

const INITIAL_STATE = {
  cartItems: [],
  hardCopyItem: null,
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
        (i) => i.demo_pdf_id === item.demo_pdf_id,
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
      const itemIndex = state.cartItems.findIndex((i) => i.demo_pdf_id === id);
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
    setCartItems(state, action) {
      const { cart, totalPrice, totalQuantity } = action.payload;
      state.cartItems = cart;
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      localStorage.setItem(
        "totalQuantity",
        JSON.stringify(state.totalQuantity),
      );
      localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice));
    },
    setHardCopyItem(state, action) {
      const { data } = action.payload;
      state.hardCopyItem = data;
      // localStorage.setItem("hardCopyItems", JSON.stringify(hardCopyItems));
    },
  },
});

export const { addToCart, removeFromCart, setCartItems, setHardCopyItem } =
  cartSlice.actions;

export default cartSlice.reducer;
