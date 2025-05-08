import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (user: object) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.log('Saving error:', e);
    throw e;
  }
};

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Loading error:', e);
    return null;
  }
};
