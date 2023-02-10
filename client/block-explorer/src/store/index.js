import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { blocksApi } from "./apis/blocksApi";
import { transactionsApi } from "./apis/transactionsApi";


export const store = configureStore({
  reducer: {
    [blocksApi.reducerPath]: blocksApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(blocksApi.middleware)
      .concat(transactionsApi.middleware)
  },
});

setupListeners(store.dispatch);

export { useFetchBlocksQuery } from './apis/blocksApi';
export {
  useFetchConfirmedTransactionsQuery,
  useFetchPendingTransactionsQuery
} from "./apis/transactionsApi";