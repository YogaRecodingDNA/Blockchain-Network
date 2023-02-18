import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const peersApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'peers',
  baseQuery: fetchBaseQuery({ // networkNodesApi.fetchBaseQuery === fetch
    baseUrl: 'http://localhost:5555',
  }),
  endpoints(builder) {
    return { // CONFIGURATION
      fetchPeerInfo: builder.query({ // === useFetchPeerInfoQuery()
        query: (nodeUrl) => {
          return {
            url: (nodeUrl && `${nodeUrl}/info`) || '/info',
            method: 'GET'
          };
        },
      }),
      fetchAllPeers: builder.query({ // === useFetchAllPeersQuery()
        query: () => {
          return {
            url: '/peers',
            method: 'GET'
          }
        }
      }),
    };
  },
});

export const {
  useFetchPeerInfoQuery,
  useFetchAllPeersQuery
} = peersApi;

export { peersApi };