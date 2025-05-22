import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  saveHabitsToStorage,
  getHabitsFromStorage,
  saveCompletedHabits,
  getCompletedHabits,
} from '../utils/HabitStorage';

type Habit = {
  id: string;
  name: string;
  days: string[];
};

type CompletedHabitsType = {
  [date: string]: string[]; // e.g. "2025-05-22": ["habit1", "habit2"]
};

type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (updatedHabit: Habit) => void;
  completedHabits: CompletedHabitsType;
  toggleHabitComplete: (id: string, date: string) => void;  // updated signature here
  deleteHabit: (id: string) => void;
  setEditingHabit: (habit: Habit | null) => void;
  editingHabit: Habit | null;
};

const HabitContext = createContext<HabitContextType>({
  habits: [],
  addHabit: () => {},
  updateHabit: () => {},
  completedHabits: {},
  toggleHabitComplete: () => {},
  deleteHabit: () => {},
  setEditingHabit: () => {},
  editingHabit: null,
});

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<CompletedHabitsType>({});
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const loadHabitsAndCompleted = async () => {
      const storedHabits = await getHabitsFromStorage();
      const storedCompleted = await getCompletedHabits();
      setHabits(storedHabits);
      setCompletedHabits(storedCompleted);
    };
    loadHabitsAndCompleted();
  }, []);

  const getToday = () => {
    return new Date().toISOString().split('T')[0]; // format: "YYYY-MM-DD"
  };

  const addHabit = (habit: Habit) => {
    const updated = [...habits, habit];
    setHabits(updated);
    saveHabitsToStorage(updated);
  };

  const updateHabit = (updatedHabit: Habit) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    setHabits(updatedHabits);
    saveHabitsToStorage(updatedHabits);
    setEditingHabit(null);
  };

  // Updated toggleHabitComplete to accept date parameter
  const toggleHabitComplete = (id: string, date: string) => {
    setCompletedHabits((prev) => {
      const todayCompleted = prev[date] || [];
      let updatedCompleted: string[];

      if (todayCompleted.includes(id)) {
        updatedCompleted = todayCompleted.filter((habitId) => habitId !== id);
      } else {
        updatedCompleted = [...todayCompleted, id];
      }

      const newState = { ...prev, [date]: updatedCompleted };
      saveCompletedHabits(newState);
      return newState;
    });
  };

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);

    const updatedCompleted: CompletedHabitsType = {};
    for (const date in completedHabits) {
      updatedCompleted[date] = completedHabits[date].filter((habitId) => habitId !== id);
    }

    setHabits(updatedHabits);
    setCompletedHabits(updatedCompleted);

    saveHabitsToStorage(updatedHabits);
    saveCompletedHabits(updatedCompleted);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        completedHabits,
        toggleHabitComplete,
        deleteHabit,
        setEditingHabit,
        editingHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => useContext(HabitContext);
