import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { useHabit } from '../context/HabitContext';

type AddHabitNavProp = NativeStackNavigationProp<RootStackParamList, 'AddHabbit'>;

export default function AddHabbit() {
  const navigation = useNavigation<AddHabitNavProp>();
  const { addHabit, updateHabit, editingHabit, setEditingHabit } = useHabit();

  const [habitName, setHabitName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    if (editingHabit) {
      setHabitName(editingHabit.name);
      setSelectedDays(editingHabit.days);
    } else {
      setHabitName('');
      setSelectedDays([]);
    }
  }, [editingHabit]);

  const handleSave = () => {
    if (habitName.trim() === '') return;

    if (editingHabit) {
      updateHabit({
        id: editingHabit.id,
        name: habitName,
        days: selectedDays,
      });
    } else {
      addHabit({
        id: Date.now().toString(),
        name: habitName,
        days: selectedDays,
      });
    }

    setEditingHabit(null); 
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Habit Name</Text>
      <TextInput
        placeholder="e.g. Drink Water"
        value={habitName}
        onChangeText={setHabitName}
        style={styles.input}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Habit Days</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SelectDays', {
              onSelectDays: (days: string[]) => setSelectedDays(days),
            })
          }
        >
          <Text style={styles.arrow}>➡️</Text>
        </TouchableOpacity>
      </View>

      {selectedDays.length > 0 && (
        <View style={styles.daysBoxContainer}>
          {selectedDays.map((day, index) => (
            <View key={index} style={styles.dayBox}>
              <Text style={styles.dayBoxText}>{day.charAt(0)}</Text>
            </View>
          ))}
        </View>
      )}

      <Button title={editingHabit ? "Update Habit" : "Save Habit"} onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrow: { fontSize: 20 },
  daysBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dayBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#00bcd4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBoxText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
