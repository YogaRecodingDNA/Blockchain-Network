import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const blocksApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'blocks',
  baseQuery: fetchBaseQuery({ // blocksApi.fetchBaseQuery === fetch
    baseUrl: 'http://localhost:5555',
    fetchFn: async (...args) => { // Manipulate the RTKQ fetching function
      // Remove for production
      await pause(1000);
      return fetch(...args);
    }
  }),
  endpoints(builder) {
    return { // CONFIGURATION
      fetchBlocks: builder.query({ // === useFetchBlocksQuery()
        query: () => {
          return {
            url: '/blocks',
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
    };
  },
});

export const { useFetchBlocksQuery, useFetchBlockByIndexQuery } = blocksApi;
export { blocksApi };