import React, {useCallback, useEffect, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import {ActivityIndicator, Alert} from 'react-native';
import {afterSigninNavigation} from '../../AppInner';
import {useQuery} from 'react-query';
import {
  deleteCategory,
  getCategoryDetailFetch,
  getCategoryFetch,
} from '../api/category';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducer';
import {getQAListFetch} from '../api/QA';
import EachQA from '../components/EachQA';
import {ThemeText, ThemeView} from '../style/common';

const HeaderContainer = styled.View`
  flex-direction: row;
`;

const DeleteButton = styled.Pressable`
  border-width: 1px;
  border-radius: 10px;
  border-color: red;
  padding: 5px;
  margin-horizontal: 5px;
  justify-content: center;
`;

const DeleteButtonText = styled.Text`
  font-size: 12px;
  color: red;
`;

const EditButton = styled.Pressable`
  border-width: 1px;
  border-radius: 10px;
  padding: 5px;
`;

const EditButtonText = styled.Text`
  font-size: 12px;
  color: black;
`;

interface Idata {
  _id: string;
  name: string;
  memo: string;
}

function DetailHeaderRight({data}: {data: Idata}) {
  const id = useSelector((state: RootState) => state.account.id);
  const navigation = useNavigation<NavigationProp<afterSigninNavigation>>();
  const {refetch} = useQuery('getCategory', () => getCategoryFetch(id));

  const onAddQA = useCallback(() => {
    navigation.navigate('QAInfo', {_id: data?._id});
  }, [data?._id, navigation]);

  const onDelete = useCallback(() => {
    Alert.alert(
      `[${data?.name}] 삭제`,
      'QA가 모두 삭제됩니다. 정말로 삭제하시겠습니까?',
      [
        {
          text: '취소',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              const result = await deleteCategory(data?._id);
              if (result) {
                Alert.alert('삭제', '삭제가 완료되었습니다.');
              }
              refetch();
              navigation.navigate('CategoryList');
            } catch (error) {
              console.log(error);
              Alert.alert('통신 에러');
            }
          },
        },
      ],
    );
  }, [data?._id, data?.name, navigation, refetch]);

  const onEdit = useCallback(() => {
    navigation.navigate('CategoryInfo', {data});
  }, [data, navigation]);

  return (
    <HeaderContainer>
      <EditButton onPress={onAddQA}>
        <EditButtonText>QA추가</EditButtonText>
      </EditButton>
      <DeleteButton onPress={onDelete}>
        <DeleteButtonText>삭제</DeleteButtonText>
      </DeleteButton>
      <EditButton onPress={onEdit}>
        <EditButtonText>수정</EditButtonText>
      </EditButton>
    </HeaderContainer>
  );
}

const Container = styled(ThemeView)`
  flex: 1;
`;

const HeaderMenu = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-top: 5px;
  padding-right: 10px;
`;

const Switch = styled.Switch``;

const SwitchButton = styled.Pressable``;

const SwitchButtonText = styled(ThemeText)``;

const FlatList = styled.FlatList``;

const Empty = styled.View`
  align-items: center;
`;

const EmptyText = styled(ThemeText)`
  margin-vertical: 10px;
  font-size: 20px;
  font-weight: bold;
`;

const AddButton = styled.Pressable`
  border-width: 1px;
  border-radius: 10px;
  padding: 5px;
`;

const AddButtonText = styled(ThemeText)``;

function Detail({route: {params}, navigation: {setOptions}}) {
  const [ishideA, setIsHideA] = useState<boolean>(false);
  const {_id} = params;
  const {isRefetching: DetailLogin, data: DetailData} = useQuery(
    'getCategoryDetail',
    () => getCategoryDetailFetch(_id),
    {},
  );
  const {
    isLoading: ListLoading,
    data: QAListData,
    refetch: categoryListFetch,
    isRefetching,
  } = useQuery('getQAListBycategoryId', () => getQAListFetch(_id), {});
  const navigation = useNavigation<NavigationProp<afterSigninNavigation>>();

  useEffect(() => {
    setOptions({
      title: DetailData?.name,
      headerRight: () => <DetailHeaderRight data={DetailData} />,
    });
  }, [DetailData, setOptions]);

  const renderItem = useCallback(
    ({item}) => <EachQA item={item} ishideA={ishideA} />,
    [ishideA],
  );

  const onChangeSwitch = useCallback(() => {
    setIsHideA(prev => !prev);
  }, []);

  const onAddQA = useCallback(() => {
    navigation.navigate('QAInfo', {_id});
  }, [_id, navigation]);

  if (DetailLogin || ListLoading || isRefetching) {
    return (
      <Container>
        <ActivityIndicator color="white" size="large" />
      </Container>
    );
  } else {
    return (
      <Container>
        {QAListData?.length > 0 ? (
          <>
            <HeaderMenu>
              <Switch value={ishideA} onValueChange={onChangeSwitch} />
              <SwitchButton onPress={onChangeSwitch}>
                <SwitchButtonText>A 숨기기</SwitchButtonText>
              </SwitchButton>
            </HeaderMenu>
            <FlatList
              data={QAListData}
              keyExtractor={item => item._id}
              renderItem={renderItem}
              onRefresh={categoryListFetch}
              refreshing={isRefetching}
            />
          </>
        ) : (
          <Empty>
            <EmptyText>QA가 없습니다.</EmptyText>
            <AddButton onPress={onAddQA}>
              <AddButtonText>QA추가</AddButtonText>
            </AddButton>
          </Empty>
        )}
      </Container>
    );
  }
}

export default Detail;
