import axios from 'axios';
import Config from 'react-native-config';

const POINT = '/category';

export const getCategoryFetch = async (id: string) => {
  const {data} = await axios.post(`${Config.URL + POINT}/getCategory`, {id});
  return data;
};

export const getCategoryDetailFetch = async (_id: string) => {
  const {data} = await axios.get(`${Config.URL + POINT}/getCategory/${_id}`);
  return data[0];
};

export const setCategoryFetch = async (
  _id: string,
  name: string,
  memo: string,
) => {
  const {data: success} = await axios.patch(
    `${Config.URL + POINT}/setCategory`,
    {_id, name, memo},
  );
  return success;
};

export const addCategoryFetch = async (
  name: string,
  id: string,
  memo: string,
) => {
  const {
    data: {success},
  } = await axios.post(`${Config.URL + POINT}/addCategory`, {
    name,
    id,
    memo,
  });
  return success;
};

export const deleteCategory = async (_id: string) => {
  const {
    data: {success},
  } = await axios.delete(`${Config.URL + POINT}/deleteCategory/${_id}`);
  return success;
};
