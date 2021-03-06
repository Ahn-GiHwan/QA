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
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {beforeSigninNavigation} from '../../AppInner';

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
  color: ${({color, theme}: {color: boolean; theme: Itheme}) =>
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

function SignIn() {
  const [id, setId] = useState('');
  const [idErrMsg, setIdErrMsg] = useState('');
  const [pw, setPw] = useState('');
  const [pwErrMsg, setPwErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const idRef = useRef<TextInput | any>(null);
  const pwRef = useRef<TextInput | any>(null);

  const navigation = useNavigation<NavigationProp<beforeSigninNavigation>>();
  const dispatch = useAppDispatch();

  const fillInput = id && pw && !idErrMsg && !pwErrMsg;

  const onChangeEmail = useCallback(text => {
    const value = text.trim();
    if (!value) {
      setIdErrMsg('* ???????????? ????????? ?????????');
    } else if (!/^(?=.*[A-Za-z])(?=.*[0-9]).{6,50}$/.test(value)) {
      setIdErrMsg('* ??????, ????????? ?????? 6??? ??????');
    } else {
      setIdErrMsg('');
    }
    setId(value);
  }, []);

  const onChangePW = useCallback(text => {
    const value = text.trim();
    if (!value) {
      setPwErrMsg('* ??????????????? ????????? ?????????');
    } else if (
      !/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(value)
    ) {
      setPwErrMsg('* ??????, ??????, ??????????????? ?????? 8??? ??????');
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
        Alert.alert('??????', '???????????????.');
        await AsyncStorage.setItem('id', id);
        dispatch(accountSlice.actions.setSignIn(id));
      } else {
        Alert.alert('??????', '???????????? ??????????????? ?????? ????????? ?????????.');
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
    navigation.navigate('Signup');
  }, [navigation, reset]);

  return (
    <SafeArea>
      {/* <DismissKeyboardView> */}
      <Container>
        <Title>QA</Title>
        <Form>
          <InputWrapper>
            <Label>?????????</Label>
            <Input
              placeholder="???????????? ????????? ?????????."
              value={id}
              onChangeText={onChangeEmail}
              clearButtonMode="while-editing"
              ref={idRef}
              onSubmitEditing={() => pwRef.current?.focus()}
            />
            <ErrorText>{idErrMsg}</ErrorText>
          </InputWrapper>
          <InputWrapper>
            <Label>????????????</Label>
            <Input
              placeholder="??????????????? ????????? ?????????."
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
              <LoginButtonText color={!fillInput}>?????????</LoginButtonText>
            )}
          </LoginButton>
          <SignUpButton onPress={onGoSignUp}>
            <SignUpButtonText>??????????????????</SignUpButtonText>
          </SignUpButton>
        </Form>
      </Container>
      {/* </DismissKeyboardView> */}
    </SafeArea>
  );
}

export default SignIn;
