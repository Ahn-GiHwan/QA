import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';
import {afterSigninNavigation} from '../../AppInner';
import {Iitem} from '../screen/List';
import {Itheme} from '../style/theme';

const Container = styled.Pressable`
  flex: 1;
  margin-top: 10px;
  margin-horizontal: 10px;
  border-radius: 10px;
  padding-vertical: 12px;
  padding-horizontal: 20px;
  background-color: ${({theme}: {theme: Itheme}) => theme.theme};
`;

const Name = styled.View``;

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
  q: string;
  a: string;
  categoryId: string;
}

function EachQA({item, ishideA}: {item: Iitem; ishideA: boolean}) {
  const navigation = useNavigation<NavigationProp<afterSigninNavigation>>();

  return (
    <Container>
      <Name>
        <NameText>{item.q}</NameText>
      </Name>
      <Memo>
        {ishideA ? <MemoText>???</MemoText> : <MemoText>{item?.a}</MemoText>}
      </Memo>
    </Container>
  );
}

export default EachQA;
