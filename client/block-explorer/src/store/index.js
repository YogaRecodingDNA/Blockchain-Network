import { configureStore } from "@reduxjs/toolkit";
import { blocksReducer } from "./slices/blocksSlice";


export const store = configureStore({
  reducer: {
    blocks: blocksReducer
  }
});