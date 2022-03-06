import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TextInput, ActivityIndicator, Alert} from 'react-native';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducer';
import {addQAFetch, getQAListFetch} from '../api/QA';
import {useQuery} from 'react-query';

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const Form = styled.View`
  position: relative;
  width: 80%;
  padding-horizontal: 20px;
  padding-top: 40px;
  padding-bottom: 20px;
  border-radius: 10px;
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

const AddButton = styled.Pressable`
  position: absolute;
  right: 0;
  bottom: 0;
  border-width: 1px;
  border-radius: 10px;
  padding: 5px;
  opacity: ${({disabled}) => (disabled ? 0.4 : 1)};
`;
const AddButtonText = styled.Text`
  text-align: right;
  color: black;
`;

type ParamList = {
  QAInfo: {
    _id: string;
    q?: string;
    a?: string;
    categoryId: string;
  };
};

function QAInfo() {
  const id = useSelector((state: RootState) => state.account.id);
  const navigation = useNavigation();
  const {
    params: {_id, q: prevQ, a: prevA, categoryId},
  } = useRoute<RouteProp<ParamList, 'QAInfo'>>();
  const {refetch} = useQuery('getQAListBycategoryId', () =>
    getQAListFetch(_id),
  );
  const [q, setQ] = useState(prevQ || '');
  const [a, setA] = useState(prevQ || '');
  const [loading, setLoading] = useState(false);

  const qRef = useRef<TextInput | any>(null);
  const aRef = useRef<TextInput | any>(null);

  const fillCheck = q && a;

  const onChangeQ = useCallback(text => {
    setQ(text);
  }, []);

  const onChangeA = useCallback(text => {
    setA(text);
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const result = await addQAFetch(q.trim(), a.trim(), _id, id);
      if (result) {
        setLoading(false);
        refetch();
        navigation.goBack();
        Alert.alert('성공', '추가되었습니다.');
      } else {
        Alert.alert('실패', '서버오류');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('실패', '서버오류');
    }
  }, [_id, a, id, navigation, q, refetch]);

  useEffect(() => {
    qRef.current?.focus();
    if (prevQ) {
      navigation.setOptions({
        title: 'QA 수정',
      });
    }
  }, [navigation, prevQ]);

  return (
    <Container>
      <Form>
        <InputWrapper>
          <Label>Q</Label>
          <Input
            value={q}
            onChangeText={onChangeQ}
            ref={qRef}
            clearButtonMode="while-editing"
            onSubmitEditing={() => aRef.current?.focus()}
            placeholder={prevQ || '질문을 입력해 주세요.'}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>A</Label>
          <Input
            value={a}
            onChangeText={onChangeA}
            ref={aRef}
            clearButtonMode="while-editing"
            onSubmitEditing={onSubmit}
            placeholder={prevA || '답변을 입력해 주세요.'}
          />
        </InputWrapper>
        <AddButton disabled={!fillCheck} onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <AddButtonText>{prevQ ? '수정하기' : '추가하기'}</AddButtonText>
          )}
        </AddButton>
      </Form>
    </Container>
  );
}

export default QAInfo;
