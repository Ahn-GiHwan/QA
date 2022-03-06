import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import {afterSigninNavigation} from '../../AppInner';
import {Itheme} from '../style/theme';

const Container = styled.Pressable`
  flex: 1;
  margin: 5px;
  margin-bottom: 15px;
  border-radius: 10px;
  padding-vertical: 12px;
  padding-horizontal: 20px;
  background-color: ${({theme}: {theme: Itheme}) => theme.theme};
`;

const Name = styled.View`
  margin-bottom: 7px;
`;

const NameText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({theme}: {theme: Itheme}) =>
    theme.theme === 'white' ? 'black' : 'white'};
`;

const Memo = styled.View``;

const MemoText = styled.Text`
  text-align: right;
  color: ${({theme}: {theme: Itheme}) =>
    theme.theme === 'white' ? 'black' : 'white'};
`;

interface Iitem {
  _id: string;
  id: string;
  name: string;
  memo: string;
}

function EachCategory({item}: {item: Iitem}) {
  const navigation = useNavigation<NavigationProp<afterSigninNavigation>>();
  const {_id, name, memo} = item;
  const onGoCategory = useCallback(() => {
    navigation.navigate('Detail', {_id, name, memo});
  }, [_id, memo, name, navigation]);

  return (
    <Container onPress={onGoCategory}>
      <Name>
        <NameText>{item.name}</NameText>
      </Name>
      <Memo>
        <MemoText>{item?.memo}</MemoText>
      </Memo>
    </Container>
  );
}

export default EachCategory;
