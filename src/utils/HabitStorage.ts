import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';

export const saveHabitsToStorage = async (habits: any[]) => {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(HABITS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving habits to storage:', e);
  }
};

export const getHabitsFromStorage = async (): Promise<any[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading habits from storage:', e);
    return [];
  }
};
