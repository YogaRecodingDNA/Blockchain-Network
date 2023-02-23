import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const transactionsApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'transactions',
  baseQuery: fetchBaseQuery({ // transactionsApi.fetchBaseQuery === fetch
    baseUrl: 'http://localhost:5555',
  }),
  tagTypes: ["AllTxns", "ConfirmedTxns", "PendingTxns", "TxnsByAddress"],
  endpoints(builder) {
    return { // CONFIGURATION
      fetchAllTransactions: builder.query({ // === useFetchAllTransactionsQuery()
        query: () => {
          return {
            url: '/transactions/all',
            method: 'GET'
          };
        },
        providesTags: ["AllTxns"],
      }),
      fetchConfirmedTransactions: builder.query({ // === useFetchConfirmedTransactionsQuery()
        query: () => {
          return {
            url: '/transactions/confirmed',
            method: 'GET'
          };
        },
        providesTags: ["ConfirmedTxns"],
      }),
      fetchPendingTransactions: builder.query({ // === useFetchPendingTransactionsQuery()
        query: () => {
          return {
            url: '/transactions/pending',
            method: 'GET'
          };
        },
        providesTags: ["PendingTxns"],
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
        providesTags: ["TxnsByAddress"],
      }),
      faucetTxnSend: builder.mutation({
        query: (formData) => {
          console.log(formData);
          console.log(formData.recipientAddress);
          console.log(+formData.amount);
          return { // THE REQUEST-CONFIGURATION OBJECT
            url: '/transactions/send',
            method: 'POST',
            body: {
              from: "",
              to: formData.recipientAddress,
              value: +formData.amount,
              fee: 10,
              dateCreated: "",
              data: "Faucet withdrawal",
              senderPubKey: "c53e76ee33f73997639edce6818e03914229722926669aabe16f58c001f40f911",
              transactionDataHash: "",
              senderPrivKey: "687e39772b92fd475264cf6bd059d2201760471b6ed04cc02b73306c24f5cc30",
              senderSignature: ""
            }
          };
        },
        invalidatesTags: ["AllTxns", "ConfirmedTxns", "PendingTxns", "TxnsByAddress"],
      }),
    };
  },
});

export const { 
  useFetchAllTransactionsQuery,
  useFetchConfirmedTransactionsQuery,
  useFetchPendingTransactionsQuery,
  useFetchTransactionByHashQuery,
  useFaucetTxnSendMutation
} = transactionsApi;
export { transactionsApi };