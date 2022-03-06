import {combineReducers} from 'redux';

import accountSlice from './accountSlice';
import hideASlice from './hideASlice';

const rootReducer = combineReducers({
  account: accountSlice.reducer,
  hideA: hideASlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
