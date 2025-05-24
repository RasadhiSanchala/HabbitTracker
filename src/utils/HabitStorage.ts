import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';
const COMPLETED_HABITS_KEY = '@completedHabits';

export type CompletedHabitsType = {
  [date: string]: string[]; 
};


export const saveCompletedHabits = async (completedHabits: CompletedHabitsType) => {
  try {
    const jsonValue = JSON.stringify(completedHabits);
    await AsyncStorage.setItem(COMPLETED_HABITS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving completed habits:', e);
  }
};

export const getCompletedHabits = async (): Promise<CompletedHabitsType> => {
  try {
    const jsonValue = await AsyncStorage.getItem(COMPLETED_HABITS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Error loading completed habits:', e);
    return {};
  }
};


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