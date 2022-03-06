import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useState} from 'react';
import {Text, Alert} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch} from '../redux';
import accountSlice from '../redux/accountSlice';
import {ThemeText, ThemeView} from '../style/common';

const Container = styled(ThemeView)`
  flex: 1;
`;

const Id = styled(ThemeText)`
  font-size: 20px;
  font-weight: bold;
`;

const LogoutButton = styled.Pressable``;

const LogoutButtonText = styled(Text)``;

function Setting() {
  const [id, setId] = useState<string | null>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getId() {
      const storageId = await AsyncStorage.getItem('id');
      setId(storageId);
    }
    getId();
  }, []);

  const onLogout = useCallback(async () => {
    await AsyncStorage.removeItem('id');
    dispatch(accountSlice.actions.setLogout());
    Alert.alert('성공', '로그아웃이 되었습니다.');
  }, [dispatch]);

  return (
    <Container>
      <Id>{id}</Id>
      <LogoutButton onPress={onLogout}>
        <LogoutButtonText>로그아웃</LogoutButtonText>
      </LogoutButton>
    </Container>
  );
}

export default Setting;
