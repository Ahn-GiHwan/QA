import {combineReducers} from 'redux';

import accountSlice from './accountSlice';

const rootReducer = combineReducers({
  account: accountSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
