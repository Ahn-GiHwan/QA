import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, Alert, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {ThemeSafeAreaView, ThemeText, ThemeView} from '../style/common';
import {Itheme} from '../style/theme';
import accountSlice from '../redux/accountSlice';
import {useAppDispatch} from '../redux';
import {signInFetch} from '../api/account';

const SafeArea = styled(ThemeSafeAreaView)`
  flex: 1;
`;

const Container = styled(ThemeView)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled(ThemeText)`
  margin-bottom: 50px;
  font-size: 50px;
  font-weight: bold;
`;

const Form = styled(ThemeView)`
  width: 80%;
  padding-horizontal: 20px;
  padding-top: 40px;
  padding-bottom: 20px;
  border-color: ${({theme}: {theme: Itheme}) => theme.text && theme.text};
  border-radius: 10px;
  background-color: white;
`;

const InputWrapper = styled.View`
  padding-horizontal: 10px;
  margin-bottom: 10px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: black;
`;

const Input = styled.TextInput.attrs({
  importantForAutofill: 'yes',
  placeholderTextColor: 'gray',
})`
  margin-vertical: 7px;
  border-bottom-width: 1px;
  border-bottom-color: gray;
  padding: 5px;
  color: black;
`;

const ErrorText = styled.Text`
  font-size: 11px;
  color: red;
  text-align: right;
`;

const LoginButton = styled.Pressable`
  border-radius: 10px;
  padding-vertical: 15px;
  background-color: ${({theme}: {theme: Itheme}) => theme.bg};
  opacity: ${({disabled}) => (disabled ? 0.4 : 1)};
`;

const LoginButtonText = styled.Text`
  text-align: center;
  font-weight: bold;
  color: ${({color, theme}: {color: string; theme: Itheme}) =>
    color ? 'white' : theme.text};
`;

const SignUpButton = styled.Pressable`
  margin-top: 10px;
`;
const SignUpButtonText = styled.Text`
  text-align: right;
  text-decoration: underline;
  color: black;
`;

function SignIn({navigation: {navigate}}) {
  const [id, setId] = useState('');
  const [idErrMsg, setIdErrMsg] = useState('');
  const [pw, setPw] = useState('');
  const [pwErrMsg, setPwErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const idRef = useRef<TextInput | any>(null);
  const pwRef = useRef<TextInput | any>(null);

  const dispatch = useAppDispatch();

  const fillInput = id && pw && !idErrMsg && !pwErrMsg;

  const onChangeEmail = useCallback(text => {
    const value = text.trim();
    if (!value) {
      setIdErrMsg('* 아이디를 입력해 주세요');
    } else if (!/^(?=.*[A-Za-z])(?=.*[0-9]).{6,50}$/.test(value)) {
      setIdErrMsg('* 영문, 숫자를 포함 6자 이상');
    } else {
      setIdErrMsg('');
    }
    setId(value);
  }, []);

  const onChangePW = useCallback(text => {
    const value = text.trim();
    if (!value) {
      setPwErrMsg('* 비밀번호를 입력해 주세요');
    } else if (
      !/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(value)
    ) {
      setPwErrMsg('* 영문, 숫자, 특수문자를 포함 8자 이상');
    } else {
      setPwErrMsg('');
    }
    setPw(value);
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const result = await signInFetch(id, pw);
      if (result) {
        Alert.alert('성공', '환영합니다.');
        await AsyncStorage.setItem('id', id);
        dispatch(accountSlice.actions.setSignIn(id));
      } else {
        Alert.alert('실패', '아이디와 비빌번호를 다시 확인해 주세요.');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [dispatch, id, pw]);

  const reset = useCallback(() => {
    setId('');
    setIdErrMsg('');
    setPw('');
    setPwErrMsg('');
  }, []);

  const onGoSignUp = useCallback(() => {
    reset();
    navigate('Signup');
  }, [navigate, reset]);

  return (
    <SafeArea>
      {/* <DismissKeyboardView> */}
      <Container>
        <Title>QA</Title>
        <Form>
          <InputWrapper>
            <Label>아이디</Label>
            <Input
              placeholder="아이디를 입력해 주세요."
              value={id}
              onChangeText={onChangeEmail}
              clearButtonMode="while-editing"
              ref={idRef}
              onSubmitEditing={() => pwRef.current?.focus()}
            />
            <ErrorText>{idErrMsg}</ErrorText>
          </InputWrapper>
          <InputWrapper>
            <Label>비밀번호</Label>
            <Input
              placeholder="비밀번호를 입력해 주세요."
              value={pw}
              onChangeText={onChangePW}
              secureTextEntry
              autoCompleteType="password"
              clearButtonMode="while-editing"
              ref={pwRef}
              onSubmitEditing={onSubmit}
            />
            <ErrorText>{pwErrMsg}</ErrorText>
          </InputWrapper>
          <LoginButton disabled={!fillInput} onPress={onSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <LoginButtonText color={!fillInput}>로그인</LoginButtonText>
            )}
          </LoginButton>
          <SignUpButton onPress={onGoSignUp}>
            <SignUpButtonText>회원가입하기</SignUpButtonText>
          </SignUpButton>
        </Form>
      </Container>
      {/* </DismissKeyboardView> */}
    </SafeArea>
  );
}

export default SignIn;
