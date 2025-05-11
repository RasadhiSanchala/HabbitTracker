import React, { createContext, useState, useContext } from 'react';

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

  const addHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => useContext(HabitContext);
