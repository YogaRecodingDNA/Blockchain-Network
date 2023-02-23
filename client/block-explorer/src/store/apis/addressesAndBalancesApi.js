import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const addressesAndBalancesApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'addresses',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5555',
  }),
  endpoints(builder) {
    return { // CONFIGURATION
      fetchAllBalances: builder.query({ // === useFetchAllBalancesQuery()
        query: () => {
          return {
            url: '/balances',
            method: 'GET'
          };
        },
      }),
      fetchBalancesByAddress: builder.query({ // === useFetchBalancesByAddressQuery()
        query: (address) => {
          return {
            url: `/address/${address}/balance`,
            method: 'GET',
            params: {
              userAddress: address
            },
          };
        },
      }),
      fetchTransactionsByAddress: builder.query({ // === useFetchTransactionsByAddressQuery()
        query: (address) => {
          return {
            url: `/address/${address}/transactions`,
            method: 'GET',
            params: {
              userAddress: address
            },
          };
        },
      }),
    };
  },
});

export const { 
  useFetchAllBalancesQuery,
  useFetchBalancesByAddressQuery,
  useFetchTransactionsByAddressQuery,
} = addressesAndBalancesApi;
export { addressesAndBalancesApi };