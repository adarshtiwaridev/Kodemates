import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTotalItems(state, action) {
      state.totalItems = action.payload;
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },

    setCartItems(state, action) {
      state.cartItems = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // ➕ Add to Cart
    addToCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += 1;
        toast.success("Increased product quantity 🛒");
      } else {
        const tempProduct = { ...action.payload, quantity: 1 };
        state.cartItems.push(tempProduct);
        state.totalItems += 1;
        toast.success("Product added to cart 🎉");
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },

    // ❌ Remove from Cart
    removeFromCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );

      state.cartItems = nextCartItems;
      state.totalItems -= 1;
      toast.success("Product removed from cart 🗑️");

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },

    // 🔄 Reset Cart
    resetCart(state) {
      state.cartItems = [];
      state.totalItems = 0;
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("totalItems", JSON.stringify(0));
      toast.success("Cart cleared 🧹");
    },

    // ⬇️ Decrease Cart Item
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.id === action.payload.id
      );

      if (itemIndex >= 0 && state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
        toast.success("Decreased product quantity ⬇️");
      } else {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload.id
        );
        state.cartItems = nextCartItems;
        state.totalItems -= 1;
        toast.success("Product removed from cart 🗑️");
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  resetCart,
  decreaseCart,
  setTotalItems,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
