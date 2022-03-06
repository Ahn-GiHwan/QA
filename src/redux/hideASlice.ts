import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isHideA: true,
};

const hideASlice = createSlice({
  name: 'hideA',
  initialState,
  reducers: {
    setChange(state, action) {
      state.isHideA = action.payload;
    },
  },
});

export default hideASlice;
