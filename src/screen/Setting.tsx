import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useState} from 'react';
import {Text, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useAppDispatch} from '../redux';
import accountSlice from '../redux/accountSlice';
import hideASlice from '../redux/hideASlice';
import {RootState} from '../redux/reducer';
import {ThemeText, ThemeView} from '../style/common';

const Container = styled(ThemeView)`
  flex: 1;
  align-items: center;
`;

const Id = styled(ThemeText)`
  font-size: 20px;
  font-weight: bold;
`;

const SwitchText = styled(ThemeText)``;

const Switch = styled.Switch``;

const LogoutButton = styled.Pressable``;

const LogoutButtonText = styled(Text)``;

function Setting() {
  const [id, setId] = useState<string | null>('');
  const isHideA = useSelector((state: RootState) => state.hideA.isHideA);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getId() {
      const storageId = await AsyncStorage.getItem('id');
      setId(storageId);
    }
    getId();
  }, []);

  const onChangeHide = useCallback(() => {
    dispatch(hideASlice.actions.setChange(!isHideA));
  }, [dispatch, isHideA]);

  const onLogout = useCallback(async () => {
    await AsyncStorage.removeItem('id');
    dispatch(accountSlice.actions.setLogout());
    Alert.alert('성공', '로그아웃이 되었습니다.');
  }, [dispatch]);

  return (
    <Container>
      <Id>{id}</Id>
      <SwitchText>기본 A 숨기기 </SwitchText>
      <Switch value={isHideA} onValueChange={onChangeHide} />
      <LogoutButton onPress={onLogout}>
        <LogoutButtonText>로그아웃</LogoutButtonText>
      </LogoutButton>
    </Container>
  );
}

export default Setting;
