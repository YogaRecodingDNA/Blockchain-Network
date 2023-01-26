import { createSlice } from "@reduxjs/toolkit";;

const blocksSlice = createSlice({
  name: 'blocks',
  initialState: {
    data: []
  },
  reducers: {}
});

export const blocksReducer = blocksSlice.reducer;