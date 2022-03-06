import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, Alert, TextInput} from 'react-native';
import styled from 'styled-components/native';
import {signUpFetch} from '../api/account';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {ThemeSafeAreaView, ThemeText, ThemeView} from '../style/common';
import {Itheme} from '../style/theme';

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

const SignUpButton = styled.Pressable`
  border-radius: 10px;
  padding-vertical: 15px;
  background-color: ${({theme}: {theme: Itheme}) => theme.bg};
  opacity: ${({disabled}) => (disabled ? 0.4 : 1)};
`;

const SignUpButtonText = styled.Text`
  text-align: center;
  font-weight: bold;
  color: ${({color, theme}: {color: string; theme: Itheme}) =>
    color ? 'white' : theme.text};
`;

function SignUp({navigation: {navigate}}) {
  const [id, setId] = useState('');
  const [idErrMsg, setIdErrMsg] = useState('');
  const [pw, setPw] = useState('');
  const [pwErrMsg, setPwErrMsg] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwConfirmErrMsg, setPwConfirmErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const idRef = useRef<TextInput | any>(null);
  const pwRef = useRef<TextInput | any>(null);
  const pwConfirmRef = useRef<TextInput | any>(null);

  const fillInput =
    id && pw && pwConfirm && !idErrMsg && !pwErrMsg && !pwConfirmErrMsg;

  const onChangeId = useCallback(text => {
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

  const onChangePWConfirm = useCallback(
    text => {
      const value = text.trim();
      if (!value) {
        setPwConfirmErrMsg('* 비밀번호를 입력해 주세요');
      } else if (value !== pw) {
        setPwConfirmErrMsg('* 비밀번호가 일치하지 않습니다.');
      } else {
        setPwConfirmErrMsg('');
      }
      setPwConfirm(value);
    },
    [pw],
  );

  const onSubmit = useCallback(async () => {
    if (!fillInput) {
      return;
    }
    try {
      setLoading(true);
      const result = await signUpFetch(id, pw);

      setLoading(false);
      if (result) {
        Alert.alert('성공', '회원가입 성공.');
        navigate('Signin');
      } else {
        Alert.alert('실패', '이미 있는 아이디입니다.');
        idRef.current?.focus();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [fillInput, id, navigate, pw]);

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
              onChangeText={onChangeId}
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
              onSubmitEditing={() => pwConfirmRef.current?.focus()}
            />
            <ErrorText>{pwErrMsg}</ErrorText>
          </InputWrapper>
          <InputWrapper>
            <Label>비밀번호 확인</Label>
            <Input
              placeholder="비밀번호 확인을 입력해 주세요."
              value={pwConfirm}
              onChangeText={onChangePWConfirm}
              secureTextEntry
              autoCompleteType="password"
              clearButtonMode="while-editing"
              ref={pwRef}
              onSubmitEditing={onSubmit}
            />
            <ErrorText>{pwConfirmErrMsg}</ErrorText>
          </InputWrapper>
          <SignUpButton disabled={!fillInput} onPress={onSubmit}>
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <SignUpButtonText color={!fillInput}>가입</SignUpButtonText>
            )}
          </SignUpButton>
        </Form>
      </Container>
      {/* </DismissKeyboardView> */}
    </SafeArea>
  );
}

export default SignUp;
