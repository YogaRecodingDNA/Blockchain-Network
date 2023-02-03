import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
// import { blocksReducer } from "./slices/blocksSlice";
import { blocksApi } from "./apis/blocksApi";


export const store = configureStore({
  reducer: {
    [blocksApi.reducerPath]: blocksApi.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(blocksApi.middleware)
  },
});

setupListeners(store.dispatch);

export { useFetchBlocksQuery } from './apis/blocksApi';