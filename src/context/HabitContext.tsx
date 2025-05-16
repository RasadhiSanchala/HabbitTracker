import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveHabitsToStorage, getHabitsFromStorage, saveCompletedHabits, getCompletedHabits } from '../utils/HabitStorage';

type Habit = {
  id: string;
  name: string;
  days: string[];
};

type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  completedHabits: string[];
  toggleHabitComplete: (id: string) => void;
};

const HabitContext = createContext<HabitContextType>({
  habits: [],
  addHabit: () => {},
  completedHabits: [],
  toggleHabitComplete: () => {},
});

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  useEffect(() => {
    const loadHabitsAndCompleted = async () => {
      const storedHabits = await getHabitsFromStorage();
      const storedCompleted = await getCompletedHabits();
      setHabits(storedHabits);
      setCompletedHabits(storedCompleted);
    };
    loadHabitsAndCompleted();
  }, []);

  const addHabit = (habit: Habit) => {
    const updated = [...habits, habit];
    setHabits(updated);
    saveHabitsToStorage(updated);
  };

  const toggleHabitComplete = (id: string) => {
    setCompletedHabits((prev) => {
      let updatedCompleted: string[];
      if (prev.includes(id)) {
        updatedCompleted = prev.filter((habitId) => habitId !== id);
      } else {
        updatedCompleted = [...prev, id];
      }
      saveCompletedHabits(updatedCompleted);
      return updatedCompleted;
    });
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, completedHabits, toggleHabitComplete }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => useContext(HabitContext);
