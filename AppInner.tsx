import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {RootState} from './src/redux/reducer';
import {useAppDispatch} from './src/redux';
import accountSlice from './src/redux/accountSlice';
import Bottom from './src/navigation/Bottom';
import NativeStack from './src/navigation/NativeStack';

export type afterSigninNavigation = {
  Home: undefined;
  Category: undefined;
  Setting: undefined;
  List: undefined;
  Info: {_id: string; name: string; memo: string | undefined};
  Detail: {_id: string; name: string; memo: string | undefined};
  AddQA: {_id: string | undefined};
};
export type beforeSigninNavigation = {
  Signin: undefined;
  Signup: undefined;
};

function AppInner() {
  const id = useSelector((state: RootState) => state.account.id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getIsLogin() {
      const storageId = await AsyncStorage.getItem('id');
      dispatch(accountSlice.actions.setSignIn(storageId));
    }
    getIsLogin();
  }, [dispatch]);

  return id ? <Bottom /> : <NativeStack />;
}

export default AppInner;
