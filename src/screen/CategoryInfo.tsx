import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, TextInput} from 'react-native';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {afterSigninNavigation} from '../../AppInner';
import {
  addCategoryFetch,
  getCategoryDetailFetch,
  getCategoryFetch,
  setCategoryFetch,
} from '../api/category';
import {RootState} from '../redux/reducer';

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
  Info: {
    data: {_id: string; name: string; memo: string};
  };
};

function CategoryInfo() {
  const {params} = useRoute<RouteProp<ParamList, 'Info'>>();
  const _id = params?.data?._id;
  const prevName = params?.data?.name;
  const prevMemo = params?.data?.memo;
  const id = useSelector((state: RootState) => state.account.id);
  const {refetch} = useQuery('getCategory', () => getCategoryFetch(id));
  const {refetch: detailRefetch} = useQuery('getCategoryDetail', () =>
    getCategoryDetailFetch(_id),
  );
  const [name, setName] = useState(prevName || '');
  const [nameErrMsg, setNameErrMsg] = useState('');
  const [memo, setMemo] = useState(prevMemo || '');
  const [memoErrMsg, setMemoErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<TextInput | any>(null);
  const memoRef = useRef<TextInput | any>(null);

  const navigation = useNavigation<NavigationProp<afterSigninNavigation>>();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const onChangeName = useCallback(text => {
    if (text.length > 8) {
      setNameErrMsg('* 8자 이하만 가능합니다.');
    } else {
      setNameErrMsg('');
      setName(text);
    }
  }, []);

  const onChangeMemo = useCallback(text => {
    if (text.length > 15) {
      setMemoErrMsg('* 15자 이하만 가능합니다.');
    } else {
      setMemoErrMsg('');
      setMemo(text);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);
      if (_id) {
        const result = await setCategoryFetch(_id, name.trim(), memo.trim());
        if (result) {
          refetch();
          detailRefetch();
          Alert.alert('성공', '수정 완료');
          navigation.goBack();
        }
      } else {
        const result = await addCategoryFetch(name.trim(), id, memo.trim());
        if (result) {
          refetch();
          Alert.alert('성공', '추가 완료');
          navigation.goBack();
        } else {
          Alert.alert('실패', '이미 있는 이름');
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [_id, detailRefetch, id, memo, name, navigation, refetch]);

  return (
    <Container>
      <Form>
        <InputWrapper>
          <Label>이름(필수)</Label>
          <Input
            value={name}
            onChangeText={onChangeName}
            ref={nameRef}
            clearButtonMode="while-editing"
            onSubmitEditing={() => memoRef.current?.focus()}
            placeholder={prevName || '카테고리 이름을 입력해 주세요.'}
          />
          <ErrorText>{nameErrMsg}</ErrorText>
        </InputWrapper>
        <InputWrapper>
          <Label>설명(선택)</Label>
          <Input
            value={memo}
            onChangeText={onChangeMemo}
            ref={memoRef}
            clearButtonMode="while-editing"
            onSubmitEditing={onSubmit}
            placeholder={prevMemo || '카테고리 설명을 입력해 주세요.'}
          />
          <ErrorText>{memoErrMsg}</ErrorText>
        </InputWrapper>
        <AddButton disabled={!name} onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <AddButtonText>{_id ? '수정하기' : '추가하기'}</AddButtonText>
          )}
        </AddButton>
      </Form>
    </Container>
  );
}

export default CategoryInfo;
