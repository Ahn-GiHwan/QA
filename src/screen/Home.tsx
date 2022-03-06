import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {ThemeView} from '../style/common';

const Container = styled(ThemeView)`
  flex: 1;
`;

function Home() {
  return (
    <Container>
      <View>
        <Text>Home</Text>
      </View>
    </Container>
  );
}

export default Home;
