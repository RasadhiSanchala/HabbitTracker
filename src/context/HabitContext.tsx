import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveHabitsToStorage, getHabitsFromStorage } from '../utils/HabitStorage'; 

type Habit = {
  id: string;
  name: string;
  days: string[];
};

type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
};

const HabitContext = createContext<HabitContextType>({
  habits: [],
  addHabit: () => {},
});

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

 
  useEffect(() => {
    const loadHabits = async () => {
      const stored = await getHabitsFromStorage();
      setHabits(stored);
    };
    loadHabits();
  }, []);


  const addHabit = (habit: Habit) => {
    const updated = [...habits, habit];
    setHabits(updated);
    saveHabitsToStorage(updated);
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => useContext(HabitContext);
