import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const faucetPrivate = process.env.REACT_APP_FAUCET_KEY;
const faucetPublic = process.env.REACT_APP_FAUCET_PUBLIC;

const transactionsApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'transactions',
  baseQuery: fetchBaseQuery({ // transactionsApi.fetchBaseQuery === fetch
    baseUrl: 'http://localhost:5555',
  }),
  tagTypes: ['Transactions'],
  endpoints(builder) {
    return { // CONFIGURATION
      fetchAllTransactions: builder.query({ // === useFetchAllTransactionsQuery()
        query: (nodeUrl) => {
          return {
            url: (nodeUrl && `${nodeUrl}/transactions/all`) || '/transactions/all',
            method: 'GET'
          };
        },
        providesTags: ['Transactions'],
      }),
      fetchConfirmedTransactions: builder.query({ // === useFetchConfirmedTransactionsQuery()
        query: () => {
          return {
            url: '/transactions/confirmed',
            method: 'GET'
          };
        },
        providesTags: ['Transactions'],
      }),
      fetchPendingTransactions: builder.query({ // === useFetchPendingTransactionsQuery()
        query: () => {
          return {
            url: '/transactions/pending',
            method: 'GET'
          };
        },
        providesTags: ['Transactions'],
      }),
      fetchTransactionByHash: builder.query({ // === useFetchTransactionByHashQuery()
        query: (hash) => {
          return {
            url: `/transactions/${hash}`,
            method: 'GET',
            params: {
              txnDataHash: hash
            },
          };
        },
        providesTags: ['Transactions'],
      }),
      sendTransaction: builder.mutation({
        query: (formData) => {
          console.log("(((API))) VERIFY SIG DATA HASH", formData.transactionDataHash);
          console.log("(((API))) VERIFY SIG PUB KEY", formData.senderPubKey);
          console.log("(((API))) VERIFY SIG SIGNATURE", formData.senderSignature);
          return { // THE REQUEST-CONFIGURATION OBJECT
            url: '/transactions/send',
            method: 'POST',
            body: {
              from: "",
              to: formData.to,
              value: formData.value,
              fee: formData.fee,
              dateCreated: formData.dateCreated,
              data: formData.data,
              senderPubKey: formData.senderPubKey,
              transactionDataHash: "",
              senderSignature: formData.senderSignature
            }
          };
        },
        invalidatesTags: ['Transactions'],
      }),
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
  useFetchAllTransactionsQuery,
  useFetchConfirmedTransactionsQuery,
  useFetchPendingTransactionsQuery,
  useFetchTransactionByHashQuery,
  useSendTransactionMutation,
  useFetchAllBalancesQuery,
  useFetchBalancesByAddressQuery,
  useFetchTransactionsByAddressQuery,
} = transactionsApi;
export { transactionsApi };