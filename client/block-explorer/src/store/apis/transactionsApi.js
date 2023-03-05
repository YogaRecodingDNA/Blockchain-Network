import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const faucetPrivate = process.env.REACT_APP_FAUCET_KEY;
const faucetPublic = process.env.REACT_APP_FAUCET_PUBLIC;

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
        invalidatesTags: ["AllTxns", "ConfirmedTxns", "PendingTxns", "TxnsByAddress"],
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
              senderPubKey: "",
              transactionDataHash: faucetPublic,
              senderPrivKey: faucetPrivate,
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
  useSendTransactionMutation,
  useFaucetTxnSendMutation
} = transactionsApi;
export { transactionsApi };