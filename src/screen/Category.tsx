import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import CategoryList from './CategoryList';
import CategoryInfo from './CategoryInfo';
import {afterSigninNavigation} from '../../AppInner';
import Detail from './Detail';
import QAInfo from './QAInfo';

const Container = styled.Pressable`
  border-width: 1px;
  border-radius: 10px;
  padding: 5px;
`;

const AddText = styled.Text`
  font-size: 16px;
  color: black;
`;

const Stack = createNativeStackNavigator();

function ListHeaderRight() {
  const navigation = useNavigation<NavigationProp<afterSigninNavigation>>();
  const onAdd = useCallback(() => {
    navigation.navigate('CategoryInfo');
  }, [navigation]);

  return (
    <Container onPress={onAdd}>
      <AddText>추가</AddText>
    </Container>
  );
}

function Category() {
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="CategoryList"
        component={CategoryList}
        options={{
          title: '카테고리',
          headerRight: ListHeaderRight,
        }}
      />
      <Stack.Screen name="Detail" component={Detail} options={{title: ''}} />
      <Stack.Screen
        name="CategoryInfo"
        component={CategoryInfo}
        options={{
          title: '카테고리 추가',
        }}
      />
      <Stack.Screen
        name="QAInfo"
        component={QAInfo}
        options={{
          title: 'QA 추가',
        }}
      />
    </Stack.Navigator>
  );
}

export default Category;
