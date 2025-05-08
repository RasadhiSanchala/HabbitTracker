import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (user: object) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.log('Saving error', e);
    throw e;
  }
};

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Loading error', e);
    return null;
  }
};

export const validateUser = async (email: string, password: string) => {
  try {
    const user = await getUser();
    if (user && user.email === email && user.password === password) {
      return true;
    }
    return false;
  } catch (e) {
    console.log('Validation error', e);
    return false;
  }
};
