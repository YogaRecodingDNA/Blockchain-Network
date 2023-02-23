import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { blocksApi } from "./apis/blocksApi";
import { peersApi } from "./apis/peersApi";
import { transactionsApi } from "./apis/transactionsApi";
import { addressesAndBalancesApi } from "./apis/addressesAndBalancesApi";


export const store = configureStore({
  reducer: {
    [blocksApi.reducerPath]: blocksApi.reducer,
    [peersApi.reducerPath]: peersApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [addressesAndBalancesApi.reducerPath]: addressesAndBalancesApi.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(blocksApi.middleware)
      .concat(peersApi.middleware)
      .concat(transactionsApi.middleware)
      .concat(addressesAndBalancesApi.middleware)
  },
});

setupListeners(store.dispatch);

export {
  useFetchBlocksQuery,
  useFetchBlockByIndexQuery
} from './apis/blocksApi';

export {
  useFetchPeerInfoQuery,
  useFetchAllPeersQuery
} from './apis/peersApi';

export {
  useFetchAllTransactionsQuery,
  useFetchConfirmedTransactionsQuery,
  useFetchPendingTransactionsQuery,
  useFetchTransactionByHashQuery,
  useFaucetTxnSendMutation
} from "./apis/transactionsApi";

export {
  useFetchAllBalancesQuery,
  useFetchBalancesByAddressQuery,
  useFetchTransactionsByAddressQuery
} from "./apis/addressesAndBalancesApi";