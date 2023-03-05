import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const minerApi = createApi({ // Autogenerate hooks \ slices \ thunks
  reducerPath: 'miner',
  baseQuery: fetchBaseQuery({ // minerApi.fetchBaseQuery === fetch
    baseUrl: 'http://localhost:5555',
  }),
  endpoints(builder) {
    return { // CONFIGURATION
      mineNewBlock: builder.query({ // === useMineNewBlockQuery()
        query: (miner) => {
          return {
            url: `${miner.nodeUrl}/mining/get-mining-job/${miner.address}`,
            method: 'GET'
          };
        },
      }),
    };
  },
});

export const { useMineNewBlockQuery } = minerApi;
export { minerApi };