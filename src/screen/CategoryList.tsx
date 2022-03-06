import React from 'react';
import {Text, ActivityIndicator} from 'react-native';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {getCategoryFetch} from '../api/category';
import EachCategory from '../components/EachCategory';
import {RootState} from '../redux/reducer';
import {ThemeView} from '../style/common';

const Container = styled(ThemeView)`
  flex: 1;
  padding: 20px;
`;

const FlatList = styled.FlatList``;

interface Iitem {
  _id: string;
  id: string;
  name: string;
  memo: string;
}

function CategoryList() {
  const id = useSelector((state: RootState) => state.account.id);
  const {isLoading, data, refetch, isRefetching} = useQuery('getCategory', () =>
    getCategoryFetch(id),
  );

  const renderItem = ({item}: {item: Iitem}) => <EachCategory item={item} />;

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator color="white" size="large" />
      </Container>
    );
  } else {
    return (
      <Container>
        {data.length === 0 ? (
          <Text>카테고리가 없습니다.</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            onRefresh={refetch}
            refreshing={isRefetching}
            numColumns={2}
          />
        )}
      </Container>
    );
  }
}

export default CategoryList;
