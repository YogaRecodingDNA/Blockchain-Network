import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const blocksApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'blocks',
  baseQuery: fetchBaseQuery({ // blocksApi.fetchBaseQuery === fetch
    baseUrl: 'http://localhost:5555',
  }),
  tagTypes: ['Peer'],
  endpoints(builder) {
    return { // CONFIGURATION
      fetchBlocks: builder.query({ // === useFetchBlocksQuery()
        query: (nodeUrl) => {
          return {
            url: (nodeUrl && `${nodeUrl}/blocks`) || '/blocks',
            method: 'GET'
          };
        },
      }),
      fetchBlockByIndex: builder.query({ // === useFetchBlockByIndexQuery()
        query: (blockIndex) => {
          return {
            url: `/blocks/${blockIndex}`,
            method: 'GET'
          }
        }
      }),
      fetchMineNewBlock: builder.query({ // === useFetchMineNewBlockQuery()
        query: (miner) => {
          console.log("API MINER ARGS ", miner);
          console.log("API miner node URL ", miner.nodeUrl);
          console.log("API miner ADDRESS ", miner.address);
          return {
            url: `${miner.nodeUrl}/mining/get-mining-job/${miner.address}`,
            method: 'GET'
          };
        },
      }),
      fetchPeerInfo: builder.query({ // === useFetchPeerInfoQuery()
        query: (nodeUrl) => {
          return {
            url: (nodeUrl && `${nodeUrl}/info`) || '/info',
            method: 'GET'
          };
        },
        providesTags: ['Peer']
      }),
      fetchAllPeers: builder.query({ // === useFetchAllPeersQuery()
        query: () => {
          return {
            url: '/peers',
            method: 'GET'
          }
        },
        providesTags: ['Peer']
      }),
      connectToPeer: builder.mutation({
        query: (peerUrl) => {
          console.log(peerUrl);
          return { // THE REQUEST-CONFIGURATION OBJECT
            url: '/peers/connect',
            method: 'POST',
            body: {
              peerUrl: peerUrl,
            }
          };
        },
        invalidatesTags: ['Peer'],
      }),
    };
  },
});

export const {
  useFetchBlocksQuery,
  useFetchBlockByIndexQuery,
  useFetchMineNewBlockQuery,
  useFetchPeerInfoQuery,
  useFetchAllPeersQuery,
  useConnectToPeerMutation
} = blocksApi;
export { blocksApi };