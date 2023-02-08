import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const transactionsApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'transactions',
  baseQuery: fetchBaseQuery({ // transactionsApi.fetchBaseQuery === fetch
    baseUrl: 'http://localhost:5555',
    fetchFn: async (...args) => { // Manipulate the RTKQ fetching function
      // Remove for production
      await pause(1000);
      return fetch(...args);
    }
  }),
  endpoints(builder) {
    return { // CONFIGURATION
      fetchPendingTransactions: builder.query({ // === useFetchPendingTransactionsQuery()
        query: () => {
          return {
            url: '/transactions/confirmed',
            method: 'GET'
          };
        },
      }),
      // fetchBlockByHash: builder.query({
      //   query: (hash) => {
      //     return {
      //       url: ''
      //     }
      //   }
      // }),
    };
  },
});

export const { useFetchPendingTransactionsQuery } = transactionsApi;
export { transactionsApi };