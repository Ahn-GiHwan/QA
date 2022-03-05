import axios from 'axios';
import Config from 'react-native-config';

const POINT = '/account';

export const signInFetch = async (id: string, pw: string) => {
  const {
    data: {success},
  } = await axios.post(`${Config.URL + POINT}/signin`, {id, pw});
  return success;
};

export const signUpFetch = async (id: string, pw: string) => {
  const {
    data: {success},
  } = await axios.post(`${Config.URL + POINT}/signup`, {id, pw});
  return success;
};
