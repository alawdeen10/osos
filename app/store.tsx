import { configureStore, createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    setProducts: (state, action) => {
      return action.payload;
    },

    incrementQuantity: (state, action) => {
      const product = state.find((p) => p.id === action.payload);
      if (product) {
        product.quantity += 1;
      } else {
        console.warn(`Product with ID ${action.payload} not found`);
      }
    },

    decrementQuantity: (state, action) => {
      const product = state.find((p) => p.id === action.payload);
      if (product) {
        if (product.quantity > 0) {
          product.quantity -= 1;
        } else {
          console.warn(
            `Product with ID ${action.payload} already has a quantity of 0`
          );
        }
      } else {
        console.warn(`Product with ID ${action.payload} not found`);
      }
    },

    addToCart: (state, action) => {
      const product = state.find((p) => p.id === action.payload);
      if (product) {
        product.quantity = (product.quantity || 0) + 1;
      } else {
        console.warn(
          `Attempted to add non-existent product with ID ${action.payload} to cart`
        );
      }
    },
  },
});

export const { setProducts, incrementQuantity, decrementQuantity, addToCart } =
  productsSlice.actions;

const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
  },
});

export default store;
