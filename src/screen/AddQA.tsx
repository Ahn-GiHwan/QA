import {useRoute} from '@react-navigation/native';
import React from 'react';
import {Text, SafeAreaView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/reducer';

function AddQA() {
  const id = useSelector((state: RootState) => state.account.id);
  const {
    params: {_id},
  } = useRoute();

  return (
    <SafeAreaView>
      <View>
        <Text>{id + ', ' + _id}</Text>
      </View>
    </SafeAreaView>
  );
}

export default AddQA;
