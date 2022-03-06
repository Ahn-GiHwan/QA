import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  id: '',
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setSignIn(state, action) {
      state.id = action.payload;
    },
    setLogout(state) {
      state.id = '';
    },
  },
});

export default accountSlice;
